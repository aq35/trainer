// 実際のブラウザ（Chromium）で、ビルドしたサイトを操作してみる。
// Playwright とブラウザが無い環境では飛ばす（npm i --no-save playwright で入れると動く）。
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';
import { buildSite } from '../tools/build.mjs';

const EXE = process.env.PW_CHROMIUM ?? '/opt/pw-browsers/chromium';
let chromium = null;
try { ({ chromium } = await import('playwright')); } catch { /* 無ければ飛ばす */ }
const skip = !chromium ? 'playwright が無い' : !existsSync(EXE) ? 'Chromium が無い' : false;

let server, browser, base;
before(async () => {
  if (skip) return;
  const root = mkdtempSync(join(tmpdir(), 'trainer-browser-'));
  process.on('exit', () => rmSync(root, { recursive: true, force: true }));
  await buildSite({ quiet: true, out: root });
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };
  server = createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const f = join(root, p);
    if (!f.startsWith(root) || !existsSync(f)) { res.statusCode = 404; res.end(); return; }
    res.setHeader('content-type', (types[extname(f)] || 'application/octet-stream') + '; charset=utf-8');
    res.end(readFileSync(f));
  });
  await new Promise((ok) => server.listen(0, ok));
  base = `http://127.0.0.1:${server.address().port}/`;
  browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] });
});
after(async () => { await browser?.close(); server?.close(); });

async function open(path) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + path);
  return { page, errors };
}

test('ナビ: 次へ・戻る・「うまくいきません」の検索と、位置の保存', { skip }, async () => {
  const { page, errors } = await open('03-first-commit.html');
  await page.waitForSelector('.card');
  assert.equal(await page.textContent('.counter'), '1 / 8');
  await page.click('.ask button.act.ok');
  await page.click('.ask button.act.ok');
  assert.equal(await page.textContent('.counter'), '3 / 8');
  await page.click('.ask button.act.ng');
  assert.ok((await page.locator('.fa').count()) <= 3, '「まず疑う」は最大3つ');
  // 実際に打った出力と、実行記録から描いた図が出ている
  assert.ok((await page.locator('.term').count()) >= 1);
  assert.match(await page.textContent('.refs'), /根拠/);
  await page.fill('.hsearch', 'not a git repository');
  assert.ok((await page.locator('details.tb:visible').count()) >= 1);
  await page.fill('.hsearch', 'ぜったいに無い言葉');
  assert.equal(await page.locator('.nohit').count(), 1);
  // 再読み込みしても、同じ画面から始まる
  await page.reload();
  await page.waitForSelector('.card');
  assert.equal(await page.textContent('.counter'), '3 / 8');
  await page.click('.foot .link >> nth=0');
  assert.equal(await page.textContent('.counter'), '2 / 8');
  // #restart で最初から
  await page.goto(base + '03-first-commit.html#restart');
  await page.reload();
  await page.waitForSelector('.card');
  assert.equal(await page.textContent('.counter'), '1 / 8');
  assert.deepEqual(errors, []);
  await page.close();
});

test('ナビ: OS を選ぶ回は、選んだ OS の手順になる', { skip }, async () => {
  const { page, errors } = await open('01-tools.html');
  await page.waitForSelector('.oschoice');
  await page.click('.oschoice button:has-text("Mac")');
  assert.equal(await page.textContent('.counter'), '1 / 7');
  assert.equal(JSON.parse(await page.evaluate(() => localStorage.getItem('trainer-v2-01'))).os, 'mac');
  assert.deepEqual(errors, []);
  await page.close();
});

test('コマンド練習: 答え合わせと、間違えた問題のやり直し', { skip }, async () => {
  const { page, errors } = await open('drill.html');
  await page.click('.cat:has-text("ターミナル")');
  for (let k = 0; k < 3; k++) {
    if (await page.locator('.ch').count()) await page.click('.ch >> nth=1');
    else { await page.fill('.ans', 'cd ..'); await page.keyboard.press('Enter'); }
    await page.click('.next');
  }
  assert.match(await page.textContent('.card h2'), /正解/);
  await page.click('text=やり直す');
  assert.match(await page.textContent('.qn'), /^1 \/ /);
  assert.deepEqual(errors, []);
  await page.close();
});

test('読み物: 目次・見出しへのリンク・タブ・チェックリスト・検索・404', { skip }, async () => {
  const { page, errors } = await open('');
  await page.waitForSelector('.mapitem');
  assert.equal(await page.locator('.mapitem').count(), 12, '全10回と、読み物2本');
  assert.equal(await page.locator('.mapitem.soon').count(), 7, 'まだ書いていない7回は「準備中」');
  // 見出しへのリンク（id が多少違っても、記号を除いて一致すれば移動する）
  await page.goto(base + '#/git-research?id=コツ3-止まるべき言葉を覚えておく');
  await page.waitForFunction(() => scrollY > 500, null, { timeout: 5000 }); // 読み物を読み込んでから移動するので、待つ
  await page.goto(base + '#/step0-terminal');
  await page.waitForSelector('.tabs');
  await page.click('.tab:has-text("Mac") >> nth=0');
  assert.match(await page.locator('.panel:visible').first().textContent(), /Cmd \+ Space/);
  await page.fill('.search input', 'ステージングエリア');
  await page.waitForSelector('.hit');
  await page.goto(base + '#/nope');
  await page.waitForSelector('.state h1');
  assert.equal(await page.textContent('.state h1'), 'ページが見つかりません');
  // docsify のハッシュに入ってしまったナビは、実ファイルへ戻す
  await page.goto(base + '#/01-tools.html');
  await page.waitForURL(/01-tools\.html$/);
  // 以前の URL は、新しい回へ案内する
    await page.goto(base + 'setup.html', { waitUntil: 'commit' }); // すぐに移動するので、読み込みの完了は待たない
  await page.waitForURL(/01-tools\.html$/);
  await page.waitForSelector('.card');
  assert.deepEqual(errors, []);
  await page.close();
});
