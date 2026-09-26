// ビルド時の変換（HTML → 構造データ、Markdown → HTML、ナビの「うまくいきません」の選び方）
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseHtml, textOf } from '../tools/html.mjs';
import { mdToHtml } from '../tools/md.mjs';
import { buildDoc, slugger } from '../tools/doc.mjs';
import { contextOf, applies } from '../tools/navi.mjs';

test('HTML: 許可したタグだけを木にし、文字参照を解く', () => {
  assert.deepEqual(parseHtml('<b>太字</b> と <code>&lt;/html&gt;</code><br>次'), [
    { t: 'b', c: ['太字'] }, ' と ', { t: 'code', c: ['</html>'] }, { t: 'br' }, '次',
  ]);
  assert.deepEqual(parseHtml('<span class="k">Ctrl</span>'), [{ t: 'span', a: { class: 'k' }, c: ['Ctrl'] }]);
});

test('HTML: 知らないタグ・属性・危ない URL・知らない文字参照はビルドを止める', () => {
  assert.throws(() => parseHtml('<script>alert(1)</script>'), /<script> はこの場所では使えません/);
  assert.throws(() => parseHtml('<b onclick="x()">x</b>'), /属性 onclick は使えません/);
  assert.throws(() => parseHtml('<a href="javascript:alert(1)">x</a>'), /使えない URL/);
  assert.throws(() => parseHtml('&bogus;'), /知らない文字参照/);
  assert.throws(() => parseHtml('<div>x</div>'), /<div> はこの場所では使えません/); // ナビの文章にブロックは置けない
});

test('HTML: 生の HTML に紛れた docsify の書き方（href="x.html \':ignore target=_blank\'"）を正す', () => {
  const [a] = parseHtml(`<a href="loop.html ':ignore target=_blank'">x</a>`, { profile: 'doc' });
  assert.deepEqual(a.a, { href: 'loop.html', target: '_blank', rel: 'noopener' });
});

test('HTML: タグの形をしていない < は文字として残す', () => {
  assert.equal(textOf(parseHtml('1 < 2')), '1 < 2');
});

test('Markdown: docsify のリンク・タブ・チェックリスト・表・裸の URL', () => {
  const html = mdToHtml([
    '[次](why-git.md) と [ナビ](setup.html \':ignore target=_blank\') と https://claude.ai',
    '',
    '<!-- tabs:start -->',
    '#### **Windows**',
    '1. win',
    '#### **Mac**',
    '1. mac',
    '<!-- tabs:end -->',
    '',
    '- [ ] まだ',
    '- [x] できた',
    '',
    '| a | b |',
    '| --- | :-: |',
    '| 1 | 2 |',
  ].join('\n'), { rewrite: (u) => u.replace(/^(\w[\w-]*)\.md$/, '#/$1') });
  assert.match(html, /<a href="#\/why-git">次<\/a>/);
  assert.match(html, /<a href="setup.html" target="_blank" rel="noopener">ナビ<\/a>/);
  assert.match(html, /<a href="https:\/\/claude.ai" target="_blank" rel="noopener">https:\/\/claude.ai<\/a>/);
  assert.match(html, /<tabs><tab label="Windows">[\s\S]*<li>win<\/li>[\s\S]*<tab label="Mac">[\s\S]*<li>mac<\/li>/);
  assert.match(html, /<task>まだ<\/task>\n<task>できた<\/task>/);
  assert.match(html, /<th align="center">b<\/th>/);
});

test('Markdown: HTML ブロックの中は Markdown として読まない（marked と同じ）', () => {
  assert.equal(mdToHtml('<div class="note">\n**そのまま**\n</div>'), '<div class="note">\n**そのまま**\n</div>\n');
  assert.equal(mdToHtml('<div class="note">\n\n**太字**\n\n</div>'), '<div class="note">\n<p><strong>太字</strong></p>\n</div>\n');
});

test('Markdown: marked 1.x で太字にならなかった書き方も太字にする', () => {
  assert.match(mdToHtml('もし**+1日**見てください'), /<strong>\+1日<\/strong>/);
  assert.match(mdToHtml('作りました。**`banana` を作ります。**'), /<strong><code>banana<\/code> を作ります。<\/strong>/);
});

test('読み物: 見出し id は docsify と同じ。部品の置き場所・チェックリスト・コードを拾う', () => {
  const s = slugger();
  assert.equal(s('Git-Flow（ギットフロー）'), 'git-flow（ギットフロー）');
  assert.equal(s('&& が使えない'), 'ampamp-が使えない');
  assert.equal(s('2. 手順'), '_2-手順');
  const d = buildDoc('x', '# 題\n\n## 章\n\n## 章\n\n<div id="map">読み込み中…</div>\n\n- [ ] 一つ目\n\n```js\nconst a = 1;\n```\n');
  assert.equal(d.title, '題');
  assert.deepEqual(d.toc.map((t) => t.id), ['章', '章-1']);
  assert.deepEqual(d.tasks, ['一つ目']);
  assert.ok(d.nodes.some((n) => n.t === 'widget' && n.a.name === 'map'));
  assert.ok(d.nodes.some((n) => n.t === 'codeblock' && n.a.lang === 'js' && n.text === 'const a = 1;\n'));
  assert.throws(() => buildDoc('x', '<div id="nanika"></div>'), /部品の置き場所として登録されていません/);
});

test('ナビ: 手順の中身から「まず疑うこと」を選ぶ', () => {
  const save = contextOf({ todo: { common: ['ファイルを<b>保存</b>します'] } }, 'win');
  assert.equal(save.save, true);
  assert.equal(save.cmd, false);
  const cmd = contextOf({ cmd: 'git status' }, 'win');
  assert.equal(cmd.cmd, true);
  assert.equal(cmd.paste, false);
  const paste = contextOf({ cmdMulti: { common: ['ここに貼る文章'] } }, 'win');
  assert.equal(paste.paste, true);
  // 覚えるだけの画面（readonly）は「何か操作する」にならない
  assert.equal(contextOf({ readonly: true, todo: { common: ['覚える'] } }, 'win').act, false);
  // OS ごとに手順が違えば、OS ごとに判定する
  const os = { todo: { win: ['<code>winget install x</code>'], mac: ['画面のボタンを押します'] } };
  assert.equal(contextOf(os, 'win').cmd, true);
  assert.equal(contextOf(os, 'mac').ui, true);
  assert.equal(applies({ when: ['cmd', 'git'] }, { cmd: true, _text: 'git を使う' }), true);
  assert.equal(applies({ when: ['cmd', 'npm'] }, { cmd: true, _text: 'git を使う' }), false);
});
