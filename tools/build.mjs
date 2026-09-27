// サイトを _site/ に書き出す。GitHub Actions（.github/workflows/pages.yml）がこれを動かして公開する。
//
//   node tools/build.mjs            … 1回だけビルド（_site/ に書き出す）
//   node tools/build.mjs --out docs … 公開用の docs/ に書き出す
//   node tools/build.mjs --watch    … 保存するたびにビルドし直し、http://localhost:8000/ で見せる
//
// やること:
//   1. 教材（content/）を読み、HTML 文字列を構造データに変える（tools/html.mjs・md.mjs・navi.mjs）
//      知らないタグや壊れたリンク先があれば、ここで止まる
//   2. 画面（site/*.sunao）を sunao でコンパイルし、esbuild で 3 本の JS にまとめる
//   3. これまでと同じ URL（setup.html / index.html#/why-git …）で開ける HTML を書き出す
import { build as esbuild } from 'esbuild';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, watch, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { sunao } from '../sunao/esbuild-plugin.mjs';
import { buildNavi } from './navi.mjs';
import { areasSvg, areasAlt } from './figs.mjs';
import { buildDoc } from './doc.mjs';
import { parseHtml } from './html.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let OUT = join(ROOT, '_site');
const SITE_NAME = 'Git トレーナー';
const HOME = 'https://aq35.github.io/trainer/';

const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// <script> に埋め込む JSON。</script> や <!-- で途切れないよう < を逃がす
const inlineJson = (v) => JSON.stringify(v).replace(/</g, '\\u003c');
// 同じ内容なら毎回同じ結果にする（キャッシュを無駄に捨てない）ため、import に内容のハッシュを付けて読み直す
const load = async (file) => import(pathToFileURL(file).href + '?v=' + hash(readFileSync(file)));

function write(rel, content) {
  const p = join(OUT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
}

function shell({ title, canonical, description, css, head = '', body }) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
<title>${esc(title)}</title>
${description ? `<meta name="description" content="${esc(description)}">\n` : ''}<link rel="icon" href="media/icon-ai.svg">
<link rel="stylesheet" href="${css}">
<link rel="canonical" href="${canonical}">
${head}</head>
<body>
<div id="app"></div>
<noscript>この教材は JavaScript で動いています。ブラウザの設定で JavaScript を有効にしてから、開き直してください。</noscript>
${body}
</body>
</html>
`;
}

// esbuild で sunao の画面をまとめる。file:// で開いても動くよう、モジュールではなく1本の script にする
async function bundle(entry) {
  const r = await esbuild({
    entryPoints: [join(ROOT, entry)],
    bundle: true, minify: true, format: 'iife', target: 'es2019', write: false,
    plugins: [sunao()], logLevel: 'silent', legalComments: 'none',
  });
  return r.outputFiles[0].text;
}

export async function buildSite({ quiet = false, out = join(ROOT, '_site') } = {}) {
  OUT = out;
  const t0 = Date.now();
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  cpSync(join(ROOT, 'public'), OUT, { recursive: true });
  write('.nojekyll', '');

  // ---- 見た目（CSS）と画面（JS） ----
  const cssText = ['base', 'navi', 'doc'].map((n) => readFileSync(join(ROOT, 'site/styles', n + '.css'), 'utf8')).join('\n');
  const css = `assets/site.css?v=${hash(cssText)}`;
  write('assets/site.css', cssText);
  const js = {};
  for (const name of ['navi', 'doc', 'drill']) {
    const code = await bundle(`site/${name}/main.js`);
    write(`assets/${name}.js`, code);
    js[name] = `assets/${name}.js?v=${hash(code)}`;
  }

  // ---- ナビ（1画面1操作）: content/navi/*.js → *.html ----
  const { firstAid } = await load(join(ROOT, 'content/help.js'));
  const aid = firstAid.map((a, k) => ({ t: a.t, d: parseHtml(a.d, { where: `content/help.js firstAid[${k}]` }) }));
  const course = await load(join(ROOT, 'content/course.js'));
  // 本物の Git で打って得た出力（tools/record.mjs が作る）と、使わない言葉の表
  const recorded = JSON.parse(readFileSync(join(ROOT, 'content/runs/recorded.json'), 'utf8'));
  const { banned } = await load(join(ROOT, 'content/terms.js'));
  const naviForLinks = [];
  const navis = readdirSync(join(ROOT, 'content/navi')).filter((f) => f.endsWith('.js')).sort();
  for (const f of navis) {
    const name = f.replace(/\.js$/, '');
    const data = buildNavi(name, await load(join(ROOT, 'content/navi', f)), { firstAid, recorded, banned });
    // 目次の地図は「完了画面の番号」で完了を判定する。ずれていたら地図が永遠に「途中」になる
    const c = course.steps.find((s) => s.href === name + '.html');
    if (c && (c.key !== data.key || c.total !== data.steps.length - 1)) {
      throw new Error(`content/course.js の ${name}: key / total がナビと合いません（key=${data.key}, total は ${data.steps.length - 1} のはず）`);
    }
    data.aid = aid;
    naviForLinks.push([`content/navi/${f}`, data]);
    // 実行記録から描いた図を書き出す
    for (const st of data.steps) {
      if (!st.areas) continue;
      write(`media/gen/${st.areas.id}.svg`, areasSvg(st.areas));
      st.areas = { src: `media/gen/${st.areas.id}.svg`, alt: areasAlt(st.areas), status: st.areas.status };
    }
    write(`${name}.html`, shell({
      title: `${data.title} | ${SITE_NAME}`, canonical: `${HOME}${name}.html`, css,
      body: `<script>window.TRAINER_PAGE = ${inlineJson(data)};</script>\n<script src="${js.navi}"></script>`,
    }));
  }

  // ---- コマンド練習: content/drill.js → drill.html ----
  const drill = await load(join(ROOT, 'content/drill.js'));
  checkWords(JSON.stringify(drill.questions), banned, 'content/drill.js');
  const R = (h, at) => parseHtml(h, { where: `content/drill.js ${at}` });
  const drillData = {
    categories: drill.categories,
    questions: drill.questions.map((q, i) => ({
      cat: q.cat, type: q.type, scene: R(q.scene, i), ask: R(q.ask, i), why: R(q.why, i),
      choices: q.choices ? q.choices.map((c) => R(c, i)) : null, answer: q.answer ?? null, expect: q.expect || null,
    })),
  };
  write('drill.html', shell({
    title: `コマンド練習 | ${SITE_NAME}`, canonical: `${HOME}drill.html`, css,
    body: `<script>window.TRAINER_DRILL = ${inlineJson(drillData)};</script>\n<script src="${js.drill}"></script>`,
  }));

  // ---- 読み物: content/read/*.md → index.html（#/名前 で切り替える） ----
  const readDir = join(ROOT, 'content/read');
  const pages = {};
  const search = [];
  const docsForLinks = [];
  for (const f of readdirSync(readDir).filter((x) => x.endsWith('.md') && x !== '_sidebar.md').sort()) {
    const slug = f.replace(/\.md$/, '');
    const md = readFileSync(join(readDir, f), 'utf8');
    const known = new Set(readdirSync(readDir).filter((x) => x.endsWith('.md')).map((x) => (x === 'README.md' ? '' : x.replace(/\.md$/, ''))));
    // 改訂履歴は「以前はこう書いていた」を残す場所なので、用語の検査から外す
    if (f !== 'changelog.md') checkWords(md, banned, `content/read/${f}`);
    const doc = buildDoc(slug, md, `content/read/${f}`);
    if (f === 'changelog.md') unwrapDead(doc.nodes, known, OUT);
    else docsForLinks.push([`content/read/${f}`, doc.nodes]);
    const route = slug === 'README' ? '' : slug;
    pages[route] = { title: doc.title };
    const body = `window.__trainerDoc(${inlineJson({ route, title: doc.title, toc: doc.toc, nodes: doc.nodes, tasks: doc.tasks })});`;
    write(`assets/read/${slug}.js`, body);
    pages[route].v = hash(body);
    for (const s of doc.sections) search.push({ r: route, p: doc.title, id: s.id, h: s.title, x: s.text });
  }
  const searchBody = `window.__trainerSearch(${inlineJson(search)});`;
  write('assets/search.js', searchBody);
  const sidebar = parseSidebar(readFileSync(join(readDir, '_sidebar.md'), 'utf8'), pages);
  const siteData = { pages, sidebar, search: `assets/search.js?v=${hash(searchBody)}` };
  write('index.html', shell({
    title: SITE_NAME, canonical: HOME, css,
    description: 'Git だけを、一人で使えるところまで。1画面に1つずつ進む全10回の教材。用語は Pro Git 日本語版にそろえ、画面の出力は実際に Git で打ったものだけを載せています。',
    head: [
      '<meta property="og:type" content="website">',
      `<meta property="og:site_name" content="${SITE_NAME}">`,
      `<meta property="og:title" content="${SITE_NAME} — Git を一人で使えるところまで">`,
      '<meta property="og:description" content="Git だけを、一人で使えるところまで。1画面に1つずつ進む全10回。">',
      `<meta property="og:url" content="${HOME}">`,
      `<meta property="og:image" content="${HOME}media/ogp.png">`,
      '<meta property="og:image:width" content="1200">',
      '<meta property="og:image:height" content="630">',
      '<meta property="og:locale" content="ja_JP">',
      '<meta name="twitter:card" content="summary_large_image">',
      `<meta name="twitter:title" content="${SITE_NAME} — Git を一人で使えるところまで">`,
      '<meta name="twitter:description" content="Git だけを、一人で使えるところまで。1画面に1つずつ進む全10回。">',
      `<meta name="twitter:image" content="${HOME}media/ogp.png">`,
      '',
    ].join('\n'),
    body: `<script>window.TRAINER_SITE = ${inlineJson(siteData)};</script>\n<script src="${js.doc}"></script>`,
  }));

  // ---- 以前の URL（setup.html など）から、新しい回へ案内する ----
  for (const [old, to] of Object.entries(MOVED)) {
    if (existsSync(join(OUT, old + '.html'))) throw new Error(`${old}.html は新しいページと名前がぶつかっています`);
    write(`${old}.html`, `<!DOCTYPE html>\n<html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">` +
      `<title>ページが移りました | ${SITE_NAME}</title><meta http-equiv="refresh" content="0; url=${to}"><link rel="canonical" href="${HOME}${to}"></head>` +
      `<body><p>この教材は、Git だけを教える形に作り直しました。<a href="${to}">新しいページへ移動します</a>。</p></body></html>\n`);
  }

  // ---- リンク切れの検査（教材の中から、無いページへ飛ばない） ----
  checkLinks([...naviForLinks, ...docsForLinks], pages);

  if (!quiet) console.log(`✓ ${OUT.slice(ROOT.length + 1)}/ に書き出しました（ナビ ${navis.length} 本・読み物 ${Object.keys(pages).length} 本・${Date.now() - t0}ms）`);
  return { navis: navis.length, pages: Object.keys(pages).length };
}

// 以前のナビ（作り直す前の26本）→ 新しい行き先
const MOVED = Object.fromEntries([
  ['setup', '01-tools.html'], ['github', '02-fork.html'], ['git', '03-first-commit.html'],
  ['branch', '09-branch.html'], ['diff', '05-diff.html'],
  ...'ai-dlc ai api ask bug chart code db gitflow loop mcp observe onboard perf publish review share test theme tools work'
    .split(' ').map((n) => [n, 'index.html']),
]);

// 改訂履歴の中の、もう無いページへのリンクは、リンクを外して文字だけ残す（履歴そのものは書き換えない）
function unwrapDead(nodes, known, out) {
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (!n || typeof n !== 'object') continue;
    if (n.c) unwrapDead(n.c, known, out);
    if (n.t !== 'a' || !n.a || !n.a.href || /^(https?:|mailto:)/.test(n.a.href)) continue;
    const m = /^(?:index\.html)?#\/([^?]*)/.exec(n.a.href);
    const alive = m ? known.has(decodeURIComponent(m[1])) : existsSync(join(out, n.a.href.split('#')[0])) || /^(0\d-|drill|index)/.test(n.a.href);
    if (!alive) { nodes.splice(i, 1, ...(n.c || [])); i--; }
  }
}

// 使わない言葉（content/terms.js）が入っていないか
function checkWords(text, banned, where) {
  for (const b of banned) if (text.includes(b.word)) throw new Error(`${where}: 「${b.word}」は使いません。${b.use}（${b.why}）`);
}

// 教材の中のリンク先が、実在するページか（外のサイトは、CI の定期検査で見る）
function checkLinks(sources, pages) {
  const walk = (v, visit) => {
    if (Array.isArray(v)) v.forEach((x) => walk(x, visit));
    else if (v && typeof v === 'object') { if (v.t === 'a' && v.a && v.a.href) visit(v.a.href); for (const k of Object.keys(v)) walk(v[k], visit); }
  };
  for (const [where, data] of sources) {
    const hrefs = [];
    walk(data, (h) => hrefs.push(h));
    if (data.steps) for (const st of data.steps) { if (st.nextHref) hrefs.push(st.nextHref); if (st.readNext) hrefs.push('#/' + st.readNext.md); }
    for (const h of hrefs) {
      if (/^(https?:|mailto:)/.test(h)) continue;
      const m = /^(?:index\.html)?#\/([^?]*)/.exec(h);
      if (m) { if (!(decodeURIComponent(m[1]) in pages)) throw new Error(`${where}: 読み物「${h}」はありません`); continue; }
      const file = h.split('#')[0].split('?')[0];
      if (file && !existsSync(join(OUT, file))) throw new Error(`${where}: 「${h}」というページはありません`);
    }
  }
}

// _sidebar.md（2段の箇条書き）→ [{ label, items:[{ label, href, route?, external }] }]
function parseSidebar(md, pages) {
  const groups = [];
  for (const line of md.split('\n')) {
    const g = /^- (.+)$/.exec(line);
    if (g) { groups.push({ label: g[1].trim(), items: [] }); continue; }
    const it = /^\s+- \[(.+?)\]\((\S+?)(?:\s+'([^']*)')?\)\s*$/.exec(line);
    if (!it) { if (line.trim()) throw new Error(`content/read/_sidebar.md: 読めない行です: ${line}`); continue; }
    const [, label, href, opt] = it;
    const m = /^([\w-]+)\.md$/.exec(href);
    let item;
    if (href === '/') item = { label, route: '' };
    else if (m) item = { label, route: m[1] === 'README' ? '' : m[1] };
    else item = { label, href, blank: !!(opt && /target=_blank/.test(opt)) };
    if ('route' in item && !(item.route in pages)) throw new Error(`content/read/_sidebar.md: ${href} という読み物がありません`);
    if (item.href && !/^https?:/.test(item.href) && !existsSync(join(OUT, item.href))) throw new Error(`content/read/_sidebar.md: ${href} というページがありません`);
    groups[groups.length - 1].items.push(item);
  }
  return groups;
}

// ---- --watch: 保存したら作り直して、ブラウザで見られるようにする ----
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  // --out docs で、GitHub Pages が配信する docs/ に書き出す（Actions が main への push のたびにこれを動かす）
  const at = process.argv.indexOf('--out');
  if (at > 0) OUT = resolve(ROOT, process.argv[at + 1]);
  await buildSite({ out: OUT });
  if (process.argv.includes('--watch')) {
    const port = Number(process.env.PORT || 8000);
    const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
    createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p.endsWith('/')) p += 'index.html';
      const file = join(OUT, p);
      if (!file.startsWith(OUT) || !existsSync(file)) { res.statusCode = 404; res.end('not found'); return; }
      res.setHeader('content-type', (TYPES[extname(file)] || 'application/octet-stream') + '; charset=utf-8');
      res.end(readFileSync(file));
    }).listen(port, () => console.log(`http://localhost:${port}/ で見られます（保存すると作り直します）`));
    let timer = null;
    for (const dir of ['content', 'site', 'public', 'tools', 'sunao']) {
      watch(join(ROOT, dir), { recursive: true }, () => {
        clearTimeout(timer);
        timer = setTimeout(() => buildSite().catch((e) => console.error('✗', e.message)), 120);
      });
    }
  }
}
