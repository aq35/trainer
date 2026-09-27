// コマンドを打たせる画面に、打つ前の説明（pre）と打った後の説明（after）が
// あるかを数える。pre はコマンドの行数と一致していないといけない
// （1行でも「意味の分からないものを貼らせる」箇所を残さないため）。
//
//   node tools/check-cmd-explain.mjs        … 足りていない画面の一覧
//   node tools/check-cmd-explain.mjs --sum  … ナビごとの件数だけ
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const dir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'content', 'navi');
const sum = process.argv.includes('--sum');

async function load(file) {
  return (await import(pathToFileURL(path.join(dir, file)).href)).default;
}

let cmdScreens = 0, done = 0;
const rows = [];

for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort()) {
  const nav = await load(file);
  if (!nav || !nav.steps) continue;
  let n = 0, ok = 0;
  nav.steps.forEach((s, i) => {
    if (!(s.cmd || s.cmdMulti) || s.textBox) return; // textBox は貼り付ける文章（コマンドではない）
    n++;
    const lines = ((s.cmdMulti && (s.cmdMulti.common || s.cmdMulti.win || s.cmdMulti.mac)) || []).length
      + (s.cmd ? 1 : 0);
    const pre = (Array.isArray(s.pre) ? s.pre : (s.pre && (s.pre.common || s.pre.win || s.pre.mac)) || []).length;
    const missing = [];
    if (!s.pre) missing.push('打つ前の説明が無い');
    else if (pre !== lines) missing.push(`説明が ${pre} 行 / コマンドは ${lines} 行`);
    if (!s.after) missing.push('打った後の説明が無い');
    if (missing.length) {
      if (!sum) rows.push(`${file}  ${i + 1}画面目「${s.title}」 … ${missing.join(' / ')}`);
    } else ok++;
  });
  if (n) { cmdScreens += n; done += ok; if (sum) rows.push(`${file.padEnd(16)} ${ok} / ${n}`); }
}

rows.forEach(r => console.log(r));
console.log(`\nコマンド画面 ${cmdScreens} 件中、説明がそろっているのは ${done} 件（残り ${cmdScreens - done} 件）`);
process.exit(0);
