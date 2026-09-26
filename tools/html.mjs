// 教材の中の HTML 文字列を、sunao で描ける「構造データ」に変える（ビルド時だけ使う）。
//
// なぜ要るのか:
//   sunao には v-html が無い（文字列を HTML としてはめ込む口が無い＝XSS が起きない）。
//   そこで HTML はビルド時に読み、許可したタグ・属性だけを木にして JSON で渡す。
//   知らないタグや危ない URL が出てきたら、黙って消さずにビルドを止める（fail-closed）。
//
// 出力の形:
//   文字列               … テキスト（実体参照は解いてある。描画時に DOM がエスケープする）
//   { t, a?, c? }        … 要素。t = タグ名、a = 属性、c = 子の配列

const VOID = new Set(['br', 'img', 'hr', 'input']);

// タグごとに許す属性。ここに無いタグ・属性は、ビルドエラーにする。
const INLINE = {
  b: [], strong: [], i: [], em: [], u: [], s: [], small: [], sup: [], sub: [], kbd: [],
  code: ['class'], br: [], span: ['class'],
  a: ['href', 'target', 'rel', 'class'],
  img: ['src', 'alt', 'class', 'width', 'height'],
  pre: [],
};
const BLOCK = {
  p: [], div: ['class', 'id'], blockquote: [], hr: [],
  h1: ['id'], h2: ['id'], h3: ['id'], h4: ['id'], h5: ['id'], h6: ['id'],
  ul: [], ol: ['start'], li: [],
  table: [], thead: [], tbody: [], tr: [], th: ['align'], td: ['align'],
  details: ['open'], summary: [],
  // Markdown 変換だけが出す、この教材専用のタグ
  tabs: [], tab: ['label'], task: [],
};

export const PROFILES = {
  inline: INLINE,
  doc: { ...INLINE, ...BLOCK },
};

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', copy: '©', times: '×', hellip: '…', mdash: '—', ndash: '–', larr: '←', rarr: '→', uarr: '↑', darr: '↓' };

export function decodeEntities(s, where) {
  return String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    if (e in NAMED) return NAMED[e];
    throw new Error(`${where}: 知らない文字参照 ${m}。tools/html.mjs の NAMED に足してください。`);
  });
}

function parseAttrs(str, tag, where) {
  const out = {};
  const re = /([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m;
  while ((m = re.exec(str))) out[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? '', where);
  return out;
}

// href / src に通してよいもの。javascript: などはビルドを止める。
function safeUrl(u, where) {
  const v = String(u).trim();
  if (/^(https?:|mailto:|#|\.{0,2}\/|[\w.-]+(\/|\.|#|\?|$))/i.test(v) && !/^\s*(javascript|data|vbscript):/i.test(v)) return v;
  if (v === '') return v;
  throw new Error(`${where}: 使えない URL です: ${v}`);
}

/**
 * HTML 文字列 → ノード配列。
 *   profile   … 'inline'（ナビ・ドリル）か 'doc'（読み物）
 *   rewriteHref(href, attrs) … リンク先の書き換え（読み物の *.md → #/名前 など）
 */
export function parseHtml(html, { profile = 'inline', where = '?', rewriteHref = null } = {}) {
  const allow = PROFILES[profile];
  const root = { t: '#root', c: [] };
  const stack = [root];
  const top = () => stack[stack.length - 1];
  const pushText = (raw) => {
    if (!raw) return;
    const text = decodeEntities(raw, where);
    const c = top().c;
    if (typeof c[c.length - 1] === 'string') c[c.length - 1] += text;
    else c.push(text);
  };

  let i = 0;
  const s = String(html);
  while (i < s.length) {
    const lt = s.indexOf('<', i);
    if (lt === -1) { pushText(s.slice(i)); break; }
    pushText(s.slice(i, lt));
    if (s.startsWith('<!--', lt)) {
      const end = s.indexOf('-->', lt);
      if (end === -1) throw new Error(`${where}: コメントが閉じていません`);
      i = end + 3;
      continue;
    }
    const m = /^<(\/?)([a-zA-Z][\w-]*)((?:\s+[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?)*)\s*(\/?)>/.exec(s.slice(lt));
    if (!m) {
      // タグの形をしていない「<」は、ただの文字（例: 1 < 2）
      pushText('<');
      i = lt + 1;
      continue;
    }
    const [whole, close, rawTag, attrStr] = m;
    const tag = rawTag.toLowerCase();
    i = lt + whole.length;
    if (!(tag in allow)) {
      throw new Error(`${where}: <${tag}> はこの場所では使えません（使えるのは ${Object.keys(allow).join(' / ')}）。文字として見せたいなら &lt;${tag}&gt; と書いてください。`);
    }
    if (close) {
      const at = stack.map((n) => n.t).lastIndexOf(tag);
      if (at <= 0) throw new Error(`${where}: </${tag}> に対応する開きタグがありません`);
      // <p> の閉じ忘れなど、間に残った要素はここで閉じる（HTML と同じ扱い）
      stack.length = at;
      continue;
    }
    const a = {};
    const given = parseAttrs(attrStr, tag, where);
    for (const [k, v] of Object.entries(given)) {
      if (!allow[tag].includes(k)) throw new Error(`${where}: <${tag}> の属性 ${k} は使えません（使えるのは ${allow[tag].join(' / ') || 'なし'}）`);
      a[k] = v;
    }
    if (tag === 'a' && 'href' in a) {
      // docsify の書き方が生の HTML に紛れ込んだもの（href="x.html ':ignore target=_blank'"）を正す
      const dm = /^(\S+)\s+'([^']*)'$/.exec(a.href);
      if (dm) { a.href = dm[1]; if (/target=_blank/.test(dm[2])) { a.target = '_blank'; a.rel = 'noopener'; } }
      a.href = safeUrl(a.href, where);
      if (rewriteHref) rewriteHref(a);
    }
    if (tag === 'img') a.src = safeUrl(a.src || '', where);
    const node = { t: tag };
    if (Object.keys(a).length) node.a = a;
    top().c.push(node);
    if (!VOID.has(tag)) { node.c = []; stack.push(node); }
  }
  if (stack.length > 1) {
    const open = stack.slice(1).map((n) => n.t);
    // 読み物では <p> や <li> を閉じずに書く書き方も通す。それ以外の閉じ忘れは止める。
    if (open.some((t) => !['p', 'li', 'td', 'th', 'tr'].includes(t))) throw new Error(`${where}: 閉じていない要素があります: <${open.join('> <')}>`);
  }
  return prune(root.c);
}

// 空の子配列は消す（JSON を小さく）
function prune(nodes) {
  for (const n of nodes) {
    if (typeof n === 'string' || !n.c) continue;
    prune(n.c);
    if (!n.c.length) delete n.c;
  }
  return nodes;
}

// ノード → 文字だけ（検索・コピー用の文章・見出しの id に使う）
export function textOf(nodes) {
  if (typeof nodes === 'string') return nodes;
  if (!Array.isArray(nodes)) nodes = [nodes];
  return nodes.map((n) => (typeof n === 'string' ? n : n.t === 'br' ? '\n' : n.c ? textOf(n.c) : '')).join('');
}
