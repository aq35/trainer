// 受講者の操作を、レッスン1から9まで実際の git でなぞるテストです。
//
//   node selftest/run.mjs
//
// - GitHub の代わりに selftest/fake-github.mjs を立て、push 先には本物の bare リポジトリを使います
// - 「GitHub がイベントを送って Actions が動く」部分は、毎回まっさらな clone で grade.mjs を実行して真似します
// - 受講者がやりがちな間違いも途中で入れて、ボットが正しく指摘するかを確かめます

import { execFile, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import assert from 'node:assert/strict';
import { createFakeGitHub } from './fake-github.mjs';

const execFileP = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'trainer-selftest-'));
const ORIGIN = path.join(TMP, 'origin.git');
const ME = path.join(TMP, 'me');

// 受講者の PC の設定（レッスン0の手順と同じ）
const HOME = path.join(TMP, 'home');
fs.mkdirSync(HOME);
const baseEnv = {
  ...process.env, HOME, GIT_CONFIG_NOSYSTEM: '1',
  GIT_EDITOR: 'true', GIT_MERGE_AUTOEDIT: 'no', GIT_TERMINAL_PROMPT: '0',
};
delete baseEnv.GIT_DIR;

function sh(cwd, cmd) {
  return execFileSync('bash', ['-c', cmd], { cwd, env: baseEnv, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}
function shFails(cwd, cmd) {
  try { sh(cwd, cmd); return false; } catch { return true; }
}
const log = (s) => console.log(`\n=== ${s}`);

const gh = createFakeGitHub();
const API = await gh.listen();
let runs = 0;

/** GitHub Actions の代わり: まっさらな clone で grade.mjs を動かす */
async function actions(eventName, payload = {}) {
  const dir = path.join(TMP, `runner-${++runs}`);
  execFileSync('git', ['clone', '-q', '--branch', 'main', ORIGIN, dir], { env: baseEnv });
  const eventPath = path.join(dir, '..', `event-${runs}.json`);
  fs.writeFileSync(eventPath, JSON.stringify(payload));
  try {
    await execFileP(process.execPath, ['.github/trainer/grade.mjs'], {
      cwd: dir,
      env: {
        ...baseEnv, HOME: path.join(TMP, 'runner-home'),
        GITHUB_REPOSITORY: 'learner/git-trainer', GITHUB_TOKEN: 'dummy',
        GITHUB_API_URL: API, GITHUB_EVENT_NAME: eventName, GITHUB_EVENT_PATH: eventPath,
      },
    });
  } catch (e) {
    console.error(e.stdout, e.stderr);
    throw e;
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// --- GitHub の画面で受講者がする操作の代わり ---------------------------------

const refSha = (ref) => execFileSync('git', ['--git-dir', ORIGIN, 'rev-parse', ref], { encoding: 'utf8' }).trim();
const hasRef = (ref) => { try { refSha(ref); return true; } catch { return false; } };

/** 受講者が git push した */
async function pushed(branch) {
  await actions('push', { ref: `refs/heads/${branch}` });
  for (const p of gh.pulls.values()) {
    if (p.state !== 'open' || p.head.ref !== branch || !hasRef(`refs/heads/${branch}`)) continue;
    const now = refSha(`refs/heads/${branch}`);
    if (now === p.head.sha) continue;
    const forced = shFails(TMP, `git --git-dir '${ORIGIN}' merge-base --is-ancestor ${p.head.sha} ${now}`);
    if (forced) gh.issues.get(p.number).timeline.push({ event: 'head_ref_force_pushed' });
    p.head.sha = now;
    execFileSync('git', ['--git-dir', ORIGIN, 'update-ref', `refs/pull/${p.number}/head`, now]);
    await actions('pull_request', { action: 'synchronize', pull_request: { number: p.number } });
  }
}
async function openPR(branch, title, body) {
  const sha = refSha(`refs/heads/${branch}`);
  const p = gh.addPull({ head: branch, headSha: sha, title, body, user: { login: 'learner', type: 'User' } });
  execFileSync('git', ['--git-dir', ORIGIN, 'update-ref', `refs/pull/${p.number}/head`, sha]);
  await actions('pull_request', { action: 'opened', pull_request: { number: p.number } });
  return p.number;
}
async function editPR(n, body) {
  gh.pulls.get(n).body = body;
  gh.issues.get(n).body = body;
  await actions('pull_request', { action: 'edited', pull_request: { number: n } });
}
/** 「Merge pull request」ボタン。コンフリクトがあれば押せない（false を返す） */
async function mergePR(n) {
  const p = gh.pulls.get(n);
  const dir = path.join(TMP, `merge-${n}-${Date.now()}`);
  execFileSync('git', ['clone', '-q', '--branch', 'main', ORIGIN, dir], { env: baseEnv });
  const ok = !shFails(dir, `git -c user.name=GitHub -c user.email=noreply@github.com merge --no-ff -q origin/${p.head.ref} -m "Merge pull request #${n} from learner/${p.head.ref}"`);
  if (ok) sh(dir, 'git push -q origin main');
  fs.rmSync(dir, { recursive: true, force: true });
  if (!ok) return false;
  p.state = 'closed';
  p.merged_at = new Date().toISOString();
  gh.issues.get(n).state = 'closed';
  const m = `${p.title}\n${p.body}`.match(/(close[sd]?|fix(e[sd])?|resolve[sd]?)\s+#(\d+)/i);
  if (m) gh.issues.get(Number(m[3])).state = 'closed';
  await actions('push', { ref: 'refs/heads/main' });
  await actions('pull_request', { action: 'closed', pull_request: { number: n } });
  return true;
}
async function deleteBranch(branch) {
  execFileSync('git', ['--git-dir', ORIGIN, 'update-ref', '-d', `refs/heads/${branch}`]);
  await actions('delete', { ref: branch, ref_type: 'branch' });
}
async function commentOnIssue(n, body) {
  gh.issues.get(n).comments.push({ id: Date.now(), body, user: { login: 'learner', type: 'User' } });
  await actions('issue_comment', { issue: { number: n } });
}

// --- 確かめるための道具 -------------------------------------------------------

function lessonIssues() {
  return [...gh.issues.values()].filter((i) => i.labels.some((l) => l.name === 'trainer'));
}
function openLesson() {
  const open = lessonIssues().filter((i) => i.state === 'open');
  assert.equal(open.length, 1, `開いているレッスンは1つのはず: ${open.map((i) => i.title)}`);
  return open[0];
}
function expectLesson(n) {
  const i = openLesson();
  assert.match(i.body, new RegExp(`"lesson":${n}[,}]`), `レッスン ${n} が開いているはず（実際: ${i.title}）`);
  return i;
}
function lastBotComment(n) {
  const c = gh.issues.get(n).comments.filter((x) => x.user.type === 'Bot');
  return c.length ? c[c.length - 1].body : '';
}
function markOf(issue) {
  return JSON.parse(issue.body.match(/<!-- trainer (\{.*?\}) -->/s)[1]);
}

// ===========================================================================

try {
  log('準備: テンプレートから自分のリポジトリを作る（Use this template の代わり）');
  const TEMPLATE = path.join(TMP, 'template');
  fs.mkdirSync(TEMPLATE);
  const files = execFileSync('git', ['ls-files', '-co', '--exclude-standard'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
  for (const f of files) {
    if (!fs.existsSync(path.join(ROOT, f))) continue;
    fs.mkdirSync(path.dirname(path.join(TEMPLATE, f)), { recursive: true });
    fs.copyFileSync(path.join(ROOT, f), path.join(TEMPLATE, f));
  }
  sh(TEMPLATE, 'git init -q -b main && git add -A && git -c user.name=GitHub -c user.email=noreply@github.com commit -q -m "Initial commit"');
  sh(TMP, `git clone -q --bare '${TEMPLATE}' '${ORIGIN}'`);

  // 最初の push で Actions が動き、レッスン1が開く
  await actions('push', { ref: 'refs/heads/main' });
  let lesson = expectLesson(1);
  assert.match(lesson.title, /^1\./);

  log('レッスン0 の設定（README の手順どおり）');
  sh(TMP, 'git config --global user.name "練習 花子" && git config --global user.email "hanako@example.com" && git config --global init.defaultBranch main && git config --global pull.rebase false');

  // ---------------------------------------------------------------- 1
  log('レッスン1: clone → add → commit → push');
  sh(TMP, `git clone -q '${ORIGIN}' '${ME}'`);
  sh(ME, 'touch practice/hello.md && git add practice/hello.md && git commit -q -m "hello.md を作った" && git push -q');
  await pushed('main');
  assert.match(lastBotComment(lesson.number), /中身が空/, '空のファイルを指摘するはず');
  sh(ME, 'echo "はじめまして。練習 花子です。" > practice/hello.md && git add practice/hello.md && git commit -q -m "hello.md に自己紹介を書いた" && git push -q');
  await pushed('main');
  assert.match(lastBotComment(lesson.number), /合格/);
  lesson = expectLesson(2);

  // ---------------------------------------------------------------- 2
  log('レッスン2: 小さく何度も記録する');
  sh(ME, 'echo "1日目: git を入れた" > practice/diary.md && git add practice/diary.md && git commit -q -m "update" && git push -q');
  await pushed('main');
  assert.match(lastBotComment(lesson.number), /「update」/, '悪いメッセージを指摘するはず');
  sh(ME, 'echo "2日目: clone した" >> practice/diary.md && git commit -qam "日記に2日目を書いた"');
  sh(ME, 'echo "3日目: push した" >> practice/diary.md && git commit -qam "日記に3日目を書いた"');
  sh(ME, 'git push -q');
  await pushed('main');
  assert.match(lastBotComment(lesson.number), /2 個/);
  sh(ME, 'echo "4日目: 3回に分けて記録した" >> practice/diary.md && git commit -qam "日記に4日目を書いた" && git push -q');
  await pushed('main');
  lesson = expectLesson(3);

  // ---------------------------------------------------------------- 3
  log('レッスン3: pull して、log と show で調べる');
  const l3 = markOf(lesson).extra;
  sh(ME, 'git pull -q');
  const logLine = sh(ME, 'git log --oneline').split('\n').find((l) => l.includes('なぞのファイルに合言葉を書いた'));
  assert.ok(logLine, 'git log にボットのコミットが見えるはず');
  const hash = logLine.split(' ')[0];
  const shown = sh(ME, `git show ${hash}`);
  const word = shown.split('\n').find((l) => l.startsWith('+合言葉: ')).replace('+合言葉: ', '');
  assert.equal(word, l3.word);
  await commentOnIssue(lesson.number, `${hash} ちがうことば`);
  assert.match(lastBotComment(lesson.number), /合言葉が違います/);
  await commentOnIssue(lesson.number, `${hash} ${word}`);
  lesson = expectLesson(4);

  // ---------------------------------------------------------------- 4
  log('レッスン4: 取り消す（restore / revert）');
  const l4 = markOf(lesson).extra;
  sh(ME, 'git pull -q');
  assert.match(sh(ME, 'cat practice/config.md'), /mode = broken/);
  // 作業中の変更を捨てる練習（採点はしないが、手順どおり動くことを確かめる）
  sh(ME, 'echo "まちがい" >> practice/config.md && git restore practice/config.md');
  sh(ME, 'echo "まちがい" >> practice/config.md && git add practice/config.md && git restore --staged practice/config.md && git restore practice/config.md');
  assert.equal(sh(ME, 'git status --porcelain'), '');
  const badHash = sh(ME, 'git log --oneline').split('\n').find((l) => l.includes('設定を変更')).split(' ')[0];
  sh(ME, `git revert --no-edit ${badHash} && git push -q`);
  assert.ok(l4.sha.startsWith(badHash));
  await pushed('main');
  lesson = expectLesson(5);

  // ---------------------------------------------------------------- 5
  log('レッスン5: ブランチ → PR → マージ → 片付け');
  sh(ME, 'git switch -q -c add-hobby && echo "趣味: 散歩" >> practice/hello.md && git commit -qam "hello.md に趣味を書いた" && git push -q -u origin add-hobby');
  await pushed('add-hobby');
  const pr5 = await openPR('add-hobby', 'hello.md に趣味を追加', '');
  assert.match(lastBotComment(lesson.number), /本文/);
  await editPR(pr5, '自己紹介に趣味を足しました。');
  assert.ok(await mergePR(pr5));
  assert.match(lastBotComment(lesson.number), /Delete branch/);
  await deleteBranch('add-hobby');
  lesson = expectLesson(6);
  sh(ME, 'git switch -q main && git pull -q && git branch -d add-hobby && git fetch -q --prune');
  assert.match(sh(ME, 'cat practice/hello.md'), /趣味: 散歩/);

  // ---------------------------------------------------------------- 6
  log('レッスン6: コンフリクトを起こして、解決する');
  sh(ME, 'git switch -q -c team-owner && sed -i "1s/.*/担当: 練習 花子/" practice/team.md && git commit -qam "担当者を自分にした" && git push -q -u origin team-owner');
  await pushed('team-owner');
  const pr6 = await openPR('team-owner', '担当者を決めた', 'team.md の担当者を自分にしました。');
  assert.match(lastBotComment(pr6), /チームメイトからのお知らせ/, 'ボットが PR にお知らせを書くはず');
  assert.equal(await mergePR(pr6), false, 'コンフリクトがあるのでマージできないはず');
  // pull.rebase を設定していないと、最近の git は pull を拒否する（レッスン0で設定する理由）
  const noConfigHome = path.join(TMP, 'no-config-home');
  fs.mkdirSync(noConfigHome, { recursive: true });
  const refused = sh(ME, `HOME='${noConfigHome}' git -c user.name=x -c user.email=x@x pull origin main 2>&1 || true`);
  assert.match(refused, /Need to specify how to reconcile divergent branches/, '設定なしでは pull が止まるはず');
  assert.ok(shFails(ME, 'git rev-parse -q --verify MERGE_HEAD'), '止まったので、何も変わっていないはず');
  assert.ok(shFails(ME, 'git pull origin main'), 'コンフリクトで pull が止まるはず');
  const conflicted = sh(ME, 'cat practice/team.md');
  assert.match(conflicted, /^<<<<<<< HEAD$/m);
  assert.match(conflicted, /^=======$/m);
  assert.match(conflicted, /^>>>>>>> [0-9a-f]+$/m);
  assert.match(sh(ME, 'git status'), /both modified:\s+practice\/team.md/);
  fs.writeFileSync(path.join(ME, 'practice/team.md'), '担当: 練習 花子（佐藤さんと相談して決めた）\n締め切り: 金曜日\n');
  sh(ME, 'git add practice/team.md && git commit -q --no-edit && git push -q');
  await pushed('team-owner');
  assert.ok(await mergePR(pr6));
  await deleteBranch('team-owner');
  lesson = expectLesson(7);
  sh(ME, 'git switch -q main && git pull -q && git branch -d team-owner');

  // ---------------------------------------------------------------- 7
  log('レッスン7: レビューの指摘に、同じ PR の上で応える');
  sh(ME, 'git switch -q -c report && cp practice/report-template.md practice/report.md && git add practice/report.md && git commit -q -m "作業報告を追加" && git push -q -u origin report');
  await pushed('report');
  const pr7 = await openPR('report', '作業報告を追加', '今週の作業報告です。');
  assert.match(lastBotComment(pr7), /TODO/);
  assert.equal(expectLesson(7).number, lesson.number);
  fs.writeFileSync(path.join(ME, 'practice/report.md'), '# 作業報告\n\n## やったこと\n\nコンフリクトを解決した。\n\n## 困ったこと\n\n特になし。\n');
  sh(ME, 'git commit -qam "作業報告の TODO を埋めた" && git push -q');
  await pushed('report');
  assert.match(lastBotComment(pr7), /指摘はすべて直っています/);
  assert.ok(await mergePR(pr7));
  lesson = expectLesson(8);
  await deleteBranch('report');
  sh(ME, 'git switch -q main && git pull -q && git branch -d report');

  // ---------------------------------------------------------------- 8
  log('レッスン8: push 済みのコミットを直す（amend と --force-with-lease）');
  sh(ME, 'git switch -q -c about && echo "" >> practice/about.md && echo "目的: git を仕事で使えるようにする。" >> practice/about.md && git commit -qam "about を更新" && git push -q -u origin about');
  await pushed('about');
  const pr8 = await openPR('about', 'about に目的を書いた', 'このリポジトリの目的を書きました。');
  assert.match(lastBotComment(pr8), /about を更新/);
  // 普通の push は断られる
  sh(ME, 'git commit -q --amend -m "docs: about に目的を書いた"');
  assert.ok(shFails(ME, 'git push -q'), 'amend 後の普通の push は拒否されるはず');
  sh(ME, 'git push -q --force-with-lease');
  await pushed('about');
  assert.match(lastBotComment(pr8), /守られています/);
  assert.ok(await mergePR(pr8));
  lesson = expectLesson(9);
  await deleteBranch('about');
  sh(ME, 'git switch -q main && git pull -q && git branch -d about');

  // ---------------------------------------------------------------- 9
  log('レッスン9: Issue を読んで、直して、閉じる');
  const bug = markOf(lesson).extra.bug;
  assert.equal(sh(ME, `node -e "console.log(require('./practice/calc.js').average([2, 4]))"`).trim(), '2', 'Issue の再現手順どおりに 2 が出るはず');
  sh(ME, 'git switch -q -c fix-average');
  sh(ME, "sed -i 's/(numbers.length + 1)/numbers.length/' practice/calc.js");
  fs.appendFileSync(path.join(ME, 'practice/calc.test.js'), "\ntest('average は平均を返す', () => {\n  const { average } = require('./calc.js');\n  assert.strictEqual(average([2, 4]), 3);\n});\n");
  assert.match(sh(ME, 'node --test practice/*.test.js 2>&1'), /# fail 0/);
  sh(ME, 'git commit -qam "fix: average を要素の数で割るようにした" && git push -q -u origin fix-average');
  await pushed('fix-average');
  // Closes を書き忘れてマージしてしまう → レッスンの「うまくいかないとき」の手順で取り返せるか
  const pr9 = await openPR('fix-average', 'average の計算を直す', '要素の数 + 1 で割っていたのを、要素の数で割るようにしました。テストも足しました。');
  assert.ok(await mergePR(pr9));
  assert.equal(gh.issues.get(bug).state, 'open', 'Closes が無いので Issue は開いたまま');
  assert.match(lastBotComment(lesson.number), new RegExp(`Closes #${bug}`));
  await editPR(pr9, `Closes #${bug}\n\n要素の数 + 1 で割っていたのを、要素の数で割るようにしました。テストも足しました。`);
  gh.issues.get(bug).state = 'closed';
  await actions('issues', { action: 'closed', issue: { number: bug } });
  const done = openLesson();
  assert.match(done.body, /"lesson":"done"/);
  assert.match(done.body, new RegExp(`#${pr9}`));

  // ---------------------------------------------------------------- まとめ
  const closed = lessonIssues().filter((i) => i.state === 'closed');
  assert.equal(closed.length, 9);
  for (const i of closed) assert.match(lastBotComment(i.number), /合格/);
  for (const i of gh.issues.values()) assert.doesNotMatch(i.body, /\{\{\w+\}\}/, `置き換え忘れ: #${i.number} ${i.title}`);
  console.log(`\n全9レッスンを、手順どおりの操作で修了できました（Actions の実行 ${runs} 回）。`);
} finally {
  await gh.close();
  if (!process.env.KEEP) fs.rmSync(TMP, { recursive: true, force: true });
  else console.log(`作業フォルダ: ${TMP}`);
}
