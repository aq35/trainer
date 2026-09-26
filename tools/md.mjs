// 読み物（content/read/*.md）を HTML にする、この教材専用の小さな Markdown 変換（ビルド時だけ使う）。
//
// 目標は「これまで docsify（中身は marked 1.x）で見えていたとおりに出す」こと。
// 教材で使っている書き方だけを実装し、tests/md.test.mjs で marked 1.2.9 と出力を比べている
// （marked が入っていれば。無ければその比較だけ飛ばす）。
//
// docsify 独自の書き方:
//   [文字](x.html ':ignore target=_blank')  … 読み物の外へのリンク。新しいタブで開く
//   [文字](foo.md)                           … 読み物どうし。#/foo に直す（読み物の中で直す）
//   <!-- tabs:start --> #### **名前** … <!-- tabs:end -->   … タブ（docsify-tabs）
//   - [ ] / - [x]                            … チェックリスト（ブラウザに保存される）

export function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
// 本文中の & は、実体参照（&gt; など）のときだけ残す
function escText(s) {
  return String(s).replace(/&(?!#?\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// CommonMark の HTML ブロック（6 番）。段落の途中でも始まれる
const BLOCK_TAGS = 'address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul';
const RE_HTML6 = new RegExp(`^ {0,3}</?(?:${BLOCK_TAGS})(?:\\s|/?>|$)`, 'i');
// 7 番: 行が「開きタグ1つ（か閉じタグ1つ）」だけ。段落の途中では始まれない
const RE_HTML7 = /^ {0,3}(?:<[a-zA-Z][\w-]*(?:\s+[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*\s*\/?>|<\/[a-zA-Z][\w-]*\s*>)\s*$/;
const RE_FENCE = /^ {0,3}(`{3,}|~{3,})\s*([\w-]*)[^`]*$/;
const RE_HEADING = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?(?:[ \t]+#+)?[ \t]*$/;
const RE_HR = /^ {0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/;
const RE_BULLET = /^( {0,3})([-*+])([ \t]+|$)(.*)$/;
const RE_ORDERED = /^( {0,3})(\d{1,9})([.)])([ \t]+|$)(.*)$/;
const RE_TABLE_DELIM = /^ {0,3}\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;

function isBlank(l) { return /^\s*$/.test(l); }

// 段落を途中で打ち切る行か
function interrupts(line) {
  return RE_FENCE.test(line) || RE_HEADING.test(line) || RE_HR.test(line) || /^ {0,3}>/.test(line) ||
    RE_HTML6.test(line) || /^ {0,3}<!--/.test(line) ||
    /^ {0,3}[-*+][ \t]+\S/.test(line) || /^ {0,3}1[.)][ \t]+\S/.test(line);
}

function splitRow(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
  const cells = [];
  let cur = '', code = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '\\' && s[i + 1] === '|') { cur += '|'; i++; continue; }
    if (ch === '`') code = !code;
    if (ch === '|' && !code) { cells.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  cells.push(cur.trim());
  return cells;
}

/** Markdown → HTML 文字列 */
export function mdToHtml(md, opts = {}) {
  const lines = String(md).replace(/\r\n?/g, '\n').replace(/\t/g, '    ').split('\n');
  return blocks(lines, opts);
}

function blocks(lines, opts) {
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (isBlank(line)) { i++; continue; }

    // タブ（docsify-tabs）
    if (/^\s*<!--\s*tabs:start\s*-->\s*$/.test(line)) {
      const body = [];
      i++;
      while (i < lines.length && !/^\s*<!--\s*tabs:end\s*-->\s*$/.test(lines[i])) body.push(lines[i++]);
      i++;
      out.push(tabs(body, opts));
      continue;
    }

    // コード
    const fm = RE_FENCE.exec(line);
    if (fm) {
      const fence = fm[1], lang = fm[2];
      const indent = /^ */.exec(line)[0].length;
      const body = [];
      i++;
      while (i < lines.length && !new RegExp(`^ {0,3}${fence[0] === '`' ? '`' : '~'}{${fence.length},}\\s*$`).test(lines[i])) {
        body.push(lines[i].replace(new RegExp(`^ {0,${indent}}`), ''));
        i++;
      }
      i++;
      out.push(`<pre><code${lang ? ` class="language-${escHtml(lang)}"` : ''}>${escHtml(body.join('\n') + (body.length ? '\n' : ''))}</code></pre>`);
      continue;
    }

    // HTML コメント（タブ以外）
    if (/^ {0,3}<!--/.test(line)) {
      const body = [];
      while (i < lines.length) { body.push(lines[i]); if (/-->/.test(lines[i++])) break; }
      out.push(body.join('\n'));
      continue;
    }

    // HTML ブロック: 空行まで、そのまま（中の Markdown は解釈しない。marked と同じ）
    if (RE_HTML6.test(line) || RE_HTML7.test(line)) {
      const body = [];
      while (i < lines.length && !isBlank(lines[i])) body.push(lines[i++]);
      out.push(body.join('\n'));
      continue;
    }

    const hm = RE_HEADING.exec(line);
    if (hm) {
      const n = hm[1].length;
      out.push(`<h${n}>${inline(hm[2] || '', opts)}</h${n}>`);
      i++;
      continue;
    }

    if (RE_HR.test(line)) { out.push('<hr>'); i++; continue; }

    // 引用
    if (/^ {0,3}>/.test(line)) {
      const body = [];
      while (i < lines.length && !isBlank(lines[i])) {
        const l = lines[i];
        if (/^ {0,3}>/.test(l)) body.push(l.replace(/^ {0,3}> ?/, ''));
        else if (body.length && !interrupts(l)) body.push(l); // 怠惰な続き行
        else break;
        i++;
      }
      out.push(`<blockquote>\n${blocks(body, opts)}</blockquote>`);
      continue;
    }

    // 表
    if (line.includes('|') && i + 1 < lines.length && RE_TABLE_DELIM.test(lines[i + 1]) && lines[i + 1].includes('-')) {
      const head = splitRow(line);
      const align = splitRow(lines[i + 1]).map((c) => (/^:-+:$/.test(c) ? 'center' : /^-+:$/.test(c) ? 'right' : /^:-+$/.test(c) ? 'left' : null));
      if (align.length === head.length) {
        i += 2;
        const rows = [];
        while (i < lines.length && !isBlank(lines[i]) && lines[i].includes('|') && !interrupts(lines[i])) rows.push(splitRow(lines[i++]));
        const cell = (tag, c, k) => `<${tag}${align[k] ? ` align="${align[k]}"` : ''}>${inline(c, opts)}</${tag}>`;
        out.push('<table>\n<thead>\n<tr>\n' + head.map((c, k) => cell('th', c, k)).join('\n') + '\n</tr>\n</thead>\n' +
          (rows.length ? '<tbody>' + rows.map((r) => '<tr>\n' + head.map((_, k) => cell('td', r[k] ?? '', k)).join('\n') + '\n</tr>').join('\n') + '</tbody>' : '') +
          '</table>');
        continue;
      }
    }

    // リスト
    if (RE_BULLET.test(line) || RE_ORDERED.test(line)) {
      const r = list(lines, i, opts);
      out.push(r.html);
      i = r.next;
      continue;
    }

    // 段落（見出し下線 --- / === なら見出し）
    const para = [line];
    i++;
    let setext = 0;
    while (i < lines.length && !isBlank(lines[i])) {
      const l = lines[i];
      if (/^ {0,3}=+\s*$/.test(l)) { setext = 1; i++; break; }
      if (/^ {0,3}-+\s*$/.test(l)) { setext = 2; i++; break; }
      if (interrupts(l)) break;
      if (line.includes('|') && RE_TABLE_DELIM.test(l)) break;
      para.push(l);
      i++;
    }
    const text = para.map((l) => l.replace(/^ +/, '')).join('\n').replace(/\s+$/, '');
    out.push(setext ? `<h${setext}>${inline(text, opts)}</h${setext}>` : `<p>${inline(text, opts)}</p>`);
  }
  return out.join('\n') + (out.length ? '\n' : '');
}

function tabs(body, opts) {
  const parts = [];
  let cur = null;
  for (const l of body) {
    const m = /^ {0,3}#{1,6}\s+(?:\*\*(.+?)\*\*|(.+?))\s*$/.exec(l);
    if (m) { cur = { label: (m[1] || m[2]).trim(), lines: [] }; parts.push(cur); continue; }
    if (cur) cur.lines.push(l);
  }
  if (!parts.length) throw new Error('タブ（tabs:start）の中に「#### **名前**」の見出しがありません');
  return '<tabs>' + parts.map((p) => `<tab label="${escHtml(p.label)}">\n${blocks(p.lines, opts)}</tab>`).join('') + '</tabs>';
}

function list(lines, start, opts) {
  const first = lines[start];
  const ordered = !RE_BULLET.test(first);
  const m0 = ordered ? RE_ORDERED.exec(first) : RE_BULLET.exec(first);
  const marker = ordered ? m0[3] : m0[2];
  const items = [];
  let i = start, loose = false, sawBlankBetween = false;
  while (i < lines.length) {
    const l = lines[i];
    const m = ordered ? RE_ORDERED.exec(l) : RE_BULLET.exec(l);
    if (!m || (ordered ? m[3] : m[2]) !== marker) break;
    if (sawBlankBetween) loose = true;
    const pad = m[1].length + (ordered ? m[2].length + 1 : 1);
    const gap = (ordered ? m[4] : m[3]).length;
    const contentIndent = pad + (gap >= 1 && gap <= 4 ? gap : 1);
    const body = [ordered ? m[5] : m[4]];
    i++;
    let blankInside = false;
    while (i < lines.length) {
      const l2 = lines[i];
      if (isBlank(l2)) {
        // 空行のあと、字下げが続けばこの項目の続き
        let j = i;
        while (j < lines.length && isBlank(lines[j])) j++;
        if (j < lines.length && /^ */.exec(lines[j])[0].length >= contentIndent) {
          for (; i < j; i++) body.push('');
          blankInside = true;
          continue;
        }
        break;
      }
      const ind = /^ */.exec(l2)[0].length;
      if (ind >= contentIndent) { body.push(l2.slice(contentIndent)); i++; continue; }
      if ((RE_BULLET.test(l2) || RE_ORDERED.test(l2)) || interrupts(l2)) break;
      body.push(l2); // 怠惰な続き行
      i++;
    }
    if (blankInside && body.slice(0, -1).some(isBlank)) loose = true;
    items.push({ body, num: ordered ? Number(m[2]) : null });
    // 項目の間の空行
    sawBlankBetween = false;
    let j = i;
    while (j < lines.length && isBlank(lines[j])) j++;
    if (j > i && j < lines.length) {
      const nm = ordered ? RE_ORDERED.exec(lines[j]) : RE_BULLET.exec(lines[j]);
      if (nm && (ordered ? nm[3] : nm[2]) === marker) { sawBlankBetween = true; i = j; }
    }
  }
  const html = items.map((it) => {
    let body = it.body;
    let task = null;
    const tm = /^\[([ xX])\][ \t]+/.exec(body[0]);
    if (tm) { task = tm[1] !== ' '; body = [body[0].slice(tm[0].length), ...body.slice(1)]; }
    let inner = blocks(body, opts);
    if (!loose) inner = inner.replace(/^<p>([\s\S]*?)<\/p>\n?/, '$1').replace(/<p>([\s\S]*?)<\/p>/g, '$1');
    inner = inner.replace(/\n$/, '');
    return task !== null ? `<task>${inner}</task>` : `<li>${inner}</li>`;
  }).join('\n');
  const startAttr = ordered && items[0].num !== 1 ? ` start="${items[0].num}"` : '';
  return { html: `<${ordered ? 'ol' : 'ul'}${startAttr}>\n${html}\n</${ordered ? 'ol' : 'ul'}>`, next: i };
}

// ---- 行の中 ----
const RE_TAG = /^(?:<[a-zA-Z][\w-]*(?:\s+[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*\s*\/?>|<\/[a-zA-Z][\w-]*\s*>|<!--[\s\S]*?-->)/;

function linkTarget(raw) {
  // (url "title") / (url 'title')。docsify は title に ':ignore target=_blank' などを書く
  const m = /^\s*<?([^\s>]*)>?(?:\s+(?:"([^"]*)"|'([^']*)'))?\s*$/.exec(raw);
  if (!m) return null;
  return { href: m[1], title: m[2] ?? m[3] ?? null };
}

function inline(src, opts) {
  // 1) コード・タグ・リンクを先に取り出して退避し、残りで強調を処理する
  const slots = [];
  const keep = (html) => `\u0000${slots.push(html) - 1}\u0000`;
  let s = '';
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === '\\' && i + 1 < src.length && /[!-\/:-@\[-`{-~]/.test(src[i + 1])) { s += keep(escText(src[i + 1])); i += 2; continue; }
    if (ch === '`') {
      const run = /^`+/.exec(src.slice(i))[0];
      const end = src.indexOf(run, i + run.length);
      if (end !== -1 && src[end + run.length] !== '`') {
        let code = src.slice(i + run.length, end).replace(/\n/g, ' ');
        if (/^ .* $/.test(code) && code.trim()) code = code.slice(1, -1);
        s += keep(`<code>${escHtml(code)}</code>`);
        i = end + run.length;
        continue;
      }
      s += run; i += run.length; continue;
    }
    if (ch === '<') {
      const am = /^<(https?:\/\/[^\s<>]+)>/.exec(src.slice(i));
      if (am) { s += keep(`<a href="${escHtml(am[1])}">${escText(am[1])}</a>`); i += am[0].length; continue; }
      const tm = RE_TAG.exec(src.slice(i));
      if (tm) { s += keep(tm[0]); i += tm[0].length; continue; }
      s += keep('&lt;'); i++; continue;
    }
    if (ch === '!' && src[i + 1] === '[' || ch === '[') {
      const img = ch === '!';
      const open = img ? i + 1 : i;
      // 対応する ] を探す（入れ子の [] を数える）
      let depth = 0, j = open;
      for (; j < src.length; j++) {
        if (src[j] === '\\') { j++; continue; }
        if (src[j] === '`') { const e = src.indexOf('`', j + 1); if (e !== -1) { j = e; continue; } }
        if (src[j] === '[') depth++;
        else if (src[j] === ']' && --depth === 0) break;
      }
      if (j < src.length && src[j + 1] === '(') {
        let k = j + 2, pd = 1, q = null;
        for (; k < src.length; k++) {
          const c = src[k];
          if (q) { if (c === q) q = null; continue; }
          if ((c === '"' || c === "'") && /\s/.test(src[k - 1])) { q = c; continue; }
          if (c === '(') pd++;
          else if (c === ')' && --pd === 0) break;
        }
        const tgt = k < src.length ? linkTarget(src.slice(j + 2, k)) : null;
        if (tgt) {
          const text = src.slice(open + 1, j);
          if (img) s += keep(`<img src="${escHtml(tgt.href)}" alt="${escHtml(text)}">`);
          else s += keep(link(tgt, inline(text, opts), opts));
          i = k + 1;
          continue;
        }
      }
      s += ch; i++; continue;
    }
    // GFM: 裸の URL もリンクにする
    if (ch === 'h' && (i === 0 || /[\s(（「]/.test(src[i - 1]))) {
      const um = /^https?:\/\/[^\s<]*[^\s<?!.,:*_~)'"）」。、]/.exec(src.slice(i));
      if (um) { s += keep(link({ href: um[0], title: null }, escText(um[0]), {})); i += um[0].length; continue; }
    }
    if (ch === '&') { const em = /^&(#x[0-9a-f]+|#\d+|\w+);/i.exec(src.slice(i)); if (em) { s += keep(em[0]); i += em[0].length; continue; } }
    s += ch;
    i++;
  }

  // 2) 強調。marked 1.x と同じく、** の内側が空白で始まる／終わるものは強調にしない
  s = escText(s);
  s = s.replace(/\*\*(?=[^\s*])([\s\S]*?[^\s\\])\*\*(?!\*)/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^\w])__(?=\S)([\s\S]*?\S)__(?![\w])/g, '$1<strong>$2</strong>');
  s = s.replace(/(^|[^*])\*(?=[^\s*])([^*\n]*?[^\s*\\])\*(?!\*)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^\w])_(?=\S)([^_\n]*?\S)_(?![\w])/g, '$1<em>$2</em>');
  // 行末の2スペース → 改行
  s = s.replace(/ {2,}\n/g, '<br>\n');

  // 3) 退避したものを戻す（入れ子の退避もあるので、無くなるまで）
  while (/\u0000\d+\u0000/.test(s)) s = s.replace(/\u0000(\d+)\u0000/g, (_, n) => slots[Number(n)]);
  return s;
}

function link({ href, title }, textHtml, opts) {
  let target = '';
  let url = href;
  if (title && /:ignore/.test(title)) {
    if (/target=_blank/.test(title)) target = ' target="_blank" rel="noopener"';
  } else if (opts.rewrite) {
    url = opts.rewrite(url);
  }
  if (!target && /^https?:/.test(url)) target = ' target="_blank" rel="noopener"';
  return `<a href="${escHtml(url)}"${target}>${textHtml}</a>`;
}
