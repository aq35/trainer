// 読み物 1 本（Markdown）→ 画面に渡すデータ（ビルド時だけ使う）。
//   { slug, title, toc:[{id, text}], tasks:[文章], nodes, sections:[{id, title, text}] }
// sections は検索用。nodes は site/doc/Block.sunao が描く。
import { mdToHtml, escHtml } from './md.mjs';
import { parseHtml, textOf } from './html.mjs';

// 本文に <div id="…"></div> と書いておくと、そこに部品が入る
export const WIDGETS = new Set(['map']);

// docsify と同じ見出し id（外から #/glossary?id=… でリンクされているので、形を変えない）
const RE_PUNCT = /[ -⁯⸀-⹿\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g;
export function slugger() {
  const seen = {};
  return (text) => {
    let slug = escHtml(text).trim().replace(/[A-Z]+/g, (s) => s.toLowerCase()).replace(/<[^>]+>/g, '')
      .replace(RE_PUNCT, '').replace(/\s/g, '-').replace(/-+/g, '-').replace(/^(\d)/, '_$1');
    const n = Object.prototype.hasOwnProperty.call(seen, slug) ? seen[slug] + 1 : 0;
    seen[slug] = n;
    return n ? `${slug}-${n}` : slug;
  };
}

// 読み物どうしのリンク（foo.md → #/foo）。index.html の中でハッシュで切り替える
export function rewriteMdHref(href) {
  const m = /^(?:\.\/)?([\w-]+)\.md(?:#(.*))?$/.exec(href);
  if (m) {
    const slug = m[1] === 'README' ? '' : m[1];
    return `#/${slug}${m[2] ? `?id=${m[2]}` : ''}`;
  }
  if (href === '/') return '#/';
  return href;
}

export function buildDoc(slug, md, where = slug) {
  const html = mdToHtml(md, { rewrite: rewriteMdHref });
  const nodes = parseHtml(html, {
    profile: 'doc',
    where,
    rewriteHref: (a) => { a.href = rewriteMdHref(a.href); },
  });
  const slugify = slugger();
  const toc = [];
  let title = null;
  const tasks = [];

  // ブロックの間の改行だけの文字は捨てる（描いても見えない。データが小さくなる）
  const BLOCKY = /^(p|div|h[1-6]|ul|ol|li|task|table|thead|tbody|tr|th|td|blockquote|hr|details|summary|pre|tabs|tab|img)$/;
  const trim = (list, parentBlock) => list.filter((n, k) => {
    if (typeof n !== 'string' || n.trim() || !n.includes('\n')) return true;
    const prev = list[k - 1], next = list[k + 1];
    const isBlock = (x) => x == null ? parentBlock : typeof x !== 'string' && BLOCKY.test(x.t);
    return !(isBlock(prev) || isBlock(next));
  });
  const post = (list, parentBlock = true) => trim(list, parentBlock).map((n) => {
    if (typeof n === 'string') return n;
    if (n.t === 'div' && n.a && WIDGETS.has(n.a.id)) return { t: 'widget', a: { name: n.a.id } };
    if (n.t === 'div' && n.a && n.a.id) throw new Error(`${where}: <div id="${n.a.id}"> は部品の置き場所として登録されていません（${[...WIDGETS].join(' / ')}）`);
    if (n.t === 'pre' && n.c && n.c.length === 1 && n.c[0].t === 'code') {
      const code = n.c[0];
      const lang = code.a && code.a.class ? code.a.class.replace(/^language-/, '') : '';
      return { t: 'codeblock', a: lang ? { lang } : undefined, text: textOf(code.c || []) };
    }
    if (/^h[1-6]$/.test(n.t)) {
      const text = textOf(n.c || []).trim();
      n.a = { ...(n.a || {}), id: slugify(text) };
      if (n.t === 'h1' && title == null) title = text;
      if (n.t === 'h2') toc.push({ id: n.a.id, text });
    }
    if (n.t === 'task') { n.a = { i: String(tasks.length) }; tasks.push(textOf(n.c || []).replace(/\s+/g, ' ').trim()); }
    if (n.c) n.c = post(n.c, /^(div|ul|ol|table|thead|tbody|tr|blockquote|details|tabs|tab)$/.test(n.t));
    if (!n.a) delete n.a;
    return n;
  });
  const out = post(nodes);

  // 検索用: 見出し（h1〜h3）ごとに区切った本文
  const sections = [];
  let cur = { id: '', title: title || slug, text: '' };
  for (const n of out) {
    if (typeof n !== 'string' && /^h[1-3]$/.test(n.t)) {
      if (cur.text.trim() || cur.id === '') sections.push(cur);
      cur = { id: n.a.id, title: textOf(n.c || []).trim(), text: '' };
      continue;
    }
    cur.text += ' ' + (typeof n === 'string' ? n : n.text || textOf(n.c || []));
  }
  sections.push(cur);
  for (const s of sections) s.text = s.text.replace(/\s+/g, ' ').trim();

  return { slug, title: title || slug, toc, tasks, nodes: out, sections: sections.filter((s) => s.text || s.id) };
}
