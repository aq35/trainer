// サイト全体をビルドして、これまでの URL がすべて出来ているかを見る
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSite } from '../tools/build.mjs';

// 並行して走る他のテストとぶつからないよう、書き出し先は一時フォルダにする
const OUT = mkdtempSync(join(tmpdir(), 'trainer-site-'));
process.on('exit', () => rmSync(OUT, { recursive: true, force: true }));
const at = (f) => join(OUT, f);

test('ビルド: ナビ・読み物・コマンド練習が、これまでと同じ URL で書き出される', async () => {
  const r = await buildSite({ quiet: true, out: OUT });
  assert.equal(r.navis, readdirSync('content/navi').length);
  for (const f of readdirSync('content/navi')) {
    const html = readFileSync(at(f.replace(/\.js$/, '.html')), 'utf8');
    const json = /window\.TRAINER_PAGE = (.*);<\/script>/.exec(html);
    assert.ok(json, `${f}: データが埋め込まれていない`);
    // 教材の中の </script> や <!-- で、埋め込んだデータが途中で切れないこと
    assert.doesNotMatch(json[1], /</);
    assert.equal(JSON.parse(json[1]).steps.length > 1, true);
  }
  for (const f of ['index.html', 'drill.html', '.nojekyll', 'media/navi-hello.svg', 'assets/navi.js', 'assets/doc.js', 'assets/drill.js', 'assets/site.css', 'assets/search.js']) {
    assert.ok(existsSync(at(f)), `${f} が無い`);
  }
  for (const f of readdirSync('content/read').filter((x) => x.endsWith('.md') && x !== '_sidebar.md')) {
    assert.ok(existsSync(at(`assets/read/${f.replace(/\.md$/, '.js')}`)), `${f} の読み物データが無い`);
  }
});

test('ビルド: 同じ入力なら同じ出力（キャッシュを無駄に捨てない）', async () => {
  await buildSite({ quiet: true, out: OUT });
  const a = readFileSync(at('index.html'), 'utf8') + readFileSync(at('03-first-commit.html'), 'utf8');
  await buildSite({ quiet: true, out: OUT });
  const b = readFileSync(at('index.html'), 'utf8') + readFileSync(at('03-first-commit.html'), 'utf8');
  assert.equal(a, b);
});
