// 教材の画面に載せる「ターミナルの出力」を、本物の Git で実行して作る。
//
//   node tools/record.mjs          … content/runs/*.mjs を順に実行し、content/runs/recorded.json に保存する
//   node tools/record.mjs --check  … 実行し直して、保存したものと違えば知らせる（CI 用）
//
// なぜ要るのか:
//   手で書き写した出力は、写し間違えるし、Git のバージョンが上がると古くなる。
//   教材に載せる出力は、ここで実際に打って得たものだけにする（design/curriculum.md 3.2）。
//
// 実行の仕方:
//   受講者と同じ順番（第1回 → 第2回 → …）で、1つの使い捨てのフォルダの中で続けて打つ。
//   前の回でした操作が、次の回の出発点になる（受講者のフォークと同じ）。
//   日付・名前・メールは固定するので、コミットの番号（ハッシュ）も毎回同じになる。
//
// 台本（content/runs/NN.mjs）の書き方:
//   { id, run }        … run を打ち、出力を id で保存する（教材の out: 'id' で画面に出る）
//   { run }            … 打つだけ（出力は保存しない）
//   { write: { パス: 中身 } } … ファイルを書く（受講者がエディタで書く操作の代わり）
//   { areas: 'id', paths: [...] } … 作業ディレクトリ・ステージングエリア・リポジトリの中身を比べて保存する（図にする）
//   { cd: 'パス' }      … 移動する
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RUNS = join(ROOT, 'content/runs');
const SNAPSHOT = join(RUNS, 'recorded.json');

// 受講者のフォークの代わりに使う、この教材のリポジトリの時点（本物の履歴を見せるため）
export const FORK_BASE = 'c68c135';
// 画面に出すときに置き換える文字（手元で再現した部分を、受講者の画面と同じ形に戻す）
export const FORK_URL = 'https://github.com/あなたのユーザー名/trainer.git';

export async function record() {
  const box = mkdtempSync(join(tmpdir(), 'trainer-record-'));
  const home = join(box, 'home');
  mkdirSync(join(home, 'Desktop'), { recursive: true });
  const origin = join(box, 'remote', 'trainer.git');
  let clock = Date.parse('2026-10-01T10:00:00+09:00') / 1000;
  const env = {
    PATH: process.env.PATH, HOME: home, LANG: 'C', LC_ALL: 'C', TERM: 'dumb',
    GIT_CONFIG_NOSYSTEM: '1', GIT_TERMINAL_PROMPT: '0', GIT_PAGER: 'cat', PAGER: 'cat',
    // 受講者のターミナルでは、git log に (HEAD -> main, origin/main) のような印が付く
    // （log.decorate の既定 auto は、画面に出すときだけ付ける）。記録でも同じ形にする
    GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'log.decorate', GIT_CONFIG_VALUE_0: 'short',
  };
  // 教材のリポジトリを「あなたのフォーク」に見立てる（ブランチは main だけ、時点は FORK_BASE）
  execFileSync('git', ['clone', '-q', '--bare', '--single-branch', '--branch', 'main', ROOT, origin], { env });
  execFileSync('git', ['--git-dir', origin, 'update-ref', 'refs/heads/main', FORK_BASE], { env });
  const hide = (s) => s.split(origin).join('{{FORK}}').split(home).join('~').split(box).join('');
  const fill = (s) => s.split('{{FORK}}').join(origin);

  const outputs = {};
  const areas = {};
  let cwd = home;
  const files = readdirSync(RUNS).filter((f) => /^\d\d-.*\.mjs$/.test(f)).sort();
  for (const f of files) {
    const script = (await import(pathToFileURL(join(RUNS, f)).href + '?t=' + Date.now())).default;
    for (const s of script) {
      if (s.cd) { cwd = resolve(cwd, s.cd.replace(/^~/, home)); continue; }
      if (s.write) {
        for (const [p, body] of Object.entries(s.write)) {
          mkdirSync(dirname(join(cwd, p)), { recursive: true });
          writeFileSync(join(cwd, p), body);
        }
        continue;
      }
      if (s.areas) { areas[s.areas] = snapAreas(cwd, env, s.paths); continue; }
      clock += 60;
      const date = `${clock} +0900`;
      let out;
      try {
        out = execFileSync('bash', ['-c', fill(s.run) + ' 2>&1'], { cwd, env: { ...env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } }).toString();
      } catch (e) {
        if (!s.fails) throw new Error(`${f}: ${s.run} が失敗しました\n${e.stdout}`);
        out = e.stdout.toString();
      }
      if (s.id) {
        if (outputs[s.id]) throw new Error(`${f}: id「${s.id}」が重複しています`);
        outputs[s.id] = { cmd: s.run, out: hide(out).replace(/\s+$/, ''), lesson: f.slice(0, 2) };
      }
    }
  }
  const version = execFileSync('git', ['--version'], { env }).toString().trim().replace(/^git version /, '');
  rmSync(box, { recursive: true, force: true });
  return { git: version, forkBase: FORK_BASE, outputs, areas };
}

// 3つの場所それぞれに、そのファイルのどの中身があるか。同じ中身には同じ番号を振る。
function snapAreas(cwd, env, paths) {
  const git = (...a) => { try { return execFileSync('git', a, { cwd, env, stdio: ['ignore', 'pipe', 'ignore'] }).toString(); } catch { return ''; } };
  const rows = [];
  for (const p of paths) {
    const head = git('rev-parse', `HEAD:${p}`).trim() || null;
    const index = (git('ls-files', '-s', '--', p).split(/\s+/)[1] || '').trim() || null;
    const work = existsSync(join(cwd, p)) ? git('hash-object', '--', p).trim() : null;
    const seen = [];
    const num = (h) => (h ? (seen.indexOf(h) < 0 ? seen.push(h) : seen.indexOf(h) + 1) : 0);
    // リポジトリ → ステージングエリア → 作業ディレクトリ の順に番号を振る（古いものほど小さい番号）
    const r = num(head), i = num(index), w = num(work);
    rows.push({ path: p, repo: r, stage: i, work: w });
  }
  return { rows, status: git('status', '--short', '--', ...paths).replace(/\s+$/, '') };
}

// ---- 直接実行したとき ----
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const fresh = await record();
  const text = JSON.stringify(fresh, null, 2) + '\n';
  if (process.argv.includes('--check')) {
    const old = existsSync(SNAPSHOT) ? readFileSync(SNAPSHOT, 'utf8') : '';
    if (old === text) { console.log(`✓ 保存してある出力と同じです（Git ${fresh.git}）`); process.exit(0); }
    const before = old ? JSON.parse(old) : { outputs: {} };
    const changed = Object.keys(fresh.outputs).filter((k) => JSON.stringify(before.outputs[k]) !== JSON.stringify(fresh.outputs[k]));
    // Git のバージョンが違えば、案内の文言が変わるのは自然なこと。知らせるだけにする
    const msg = `Git ${fresh.git} で実行した出力が、保存してあるもの（Git ${before.git}）と ${changed.length} か所違います: ${changed.join(', ')}`;
    if (process.env.GITHUB_ACTIONS) console.log(`::warning::${msg}`);
    else console.log('⚠ ' + msg);
    process.exit(fresh.git === before.git ? 1 : 0);
  }
  writeFileSync(SNAPSHOT, text);
  console.log(`✓ ${Object.keys(fresh.outputs).length} 個の出力を content/runs/recorded.json に保存しました（Git ${fresh.git}）`);
}
