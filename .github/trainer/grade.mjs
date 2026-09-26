// 採点ボット本体です。GitHub Actions から呼ばれます（.github/workflows/trainer.yml）。
//
// 何をするか:
//   1. いま開いているレッスンの Issue を探す（無ければレッスン1を開く）
//   2. リポジトリの「実際の状態」（コミット・ブランチ・PR・コメント）を調べて合否を出す
//   3. 合格なら Issue を閉じて次のレッスンを開く。まだなら、何が足りないかをコメントする
//
// 合否は「いま届いたイベント」ではなく「リポジトリの状態」で決めます。
// どの順番で何回動いても、同じ状態なら同じ結果になります。

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lessons } from './lessons.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = process.env.GITHUB_REPOSITORY;
const API = process.env.GITHUB_API_URL || 'https://api.github.com';
const SERVER = process.env.GITHUB_SERVER_URL || 'https://github.com';
const TOKEN = process.env.GITHUB_TOKEN;
const EVENT_NAME = process.env.GITHUB_EVENT_NAME || 'workflow_dispatch';
const EVENT = process.env.GITHUB_EVENT_PATH && fs.existsSync(process.env.GITHUB_EVENT_PATH)
  ? JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'))
  : {};

export const BOT = {
  name: 'trainer-bot',
  email: '41898282+github-actions[bot]@users.noreply.github.com',
};
const LABEL = 'trainer';
const FEEDBACK_MARK = '<!-- trainer-feedback -->';

// ---------------------------------------------------------------------------
// git と GitHub API

export function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).replace(/\n$/, '');
}
export function gitOk(...args) {
  try { git(...args); return true; } catch { return false; }
}

async function api(method, p, body) {
  const res = await fetch(API + p, {
    method,
    headers: {
      authorization: `Bearer ${TOKEN}`,
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${method} ${p} -> ${res.status}: ${await res.text()}`);
  if (res.status === 204) return null;
  return res.json();
}

const gh = {
  issues: () => api('GET', `/repos/${REPO}/issues?state=all&labels=${LABEL}&per_page=100`),
  issue: (n) => api('GET', `/repos/${REPO}/issues/${n}`),
  createIssue: (title, body, labels = [LABEL]) => api('POST', `/repos/${REPO}/issues`, { title, body, labels }),
  updateIssue: (n, fields) => api('PATCH', `/repos/${REPO}/issues/${n}`, fields),
  comments: (n) => api('GET', `/repos/${REPO}/issues/${n}/comments?per_page=100`),
  comment: (n, body) => api('POST', `/repos/${REPO}/issues/${n}/comments`, { body }),
  pulls: () => api('GET', `/repos/${REPO}/pulls?state=all&per_page=100`),
  timeline: (n) => api('GET', `/repos/${REPO}/issues/${n}/timeline?per_page=100`),
  ensureLabel: async (name, color, description) => {
    try { await api('POST', `/repos/${REPO}/labels`, { name, color, description }); } catch { /* 既にある */ }
  },
};

// ---------------------------------------------------------------------------
// Issue 本文に埋め込む「レッスンの状態」

const MARK_RE = /<!-- trainer (\{.*?\}) -->/s;
function readMark(issue) {
  const m = issue.body && issue.body.match(MARK_RE);
  return m ? JSON.parse(m[1]) : null;
}
function writeMark(body, mark) {
  return body.replace(MARK_RE, `<!-- trainer ${JSON.stringify(mark)} -->`);
}

// ---------------------------------------------------------------------------
// レッスンの中から使う道具

function fetchAll() {
  git('fetch', '--prune', '--quiet', 'origin',
    '+refs/heads/*:refs/remotes/origin/*',
    '+refs/pull/*/head:refs/remotes/origin/pr/*');
}

function makeTools(mark) {
  const tools = {
    git, gitOk, BOT,
    repo: REPO,
    repoUrl: `${SERVER}/${REPO}`,
    eventName: EVENT_NAME,
    event: EVENT,
    mark,

    /** range の中で、受講者が作ったコミット（ボット以外・マージ以外） */
    learnerCommits(range, ...paths) {
      const out = git('log', '--no-merges', '--format=%H%x1f%ae%x1f%s', ...range.split(' '), '--', ...paths);
      return out.split('\n').filter(Boolean)
        .map((l) => { const [sha, email, subject] = l.split('\x1f'); return { sha, email, subject }; })
        .filter((c) => c.email !== BOT.email);
    },
    fileAt(ref, file) {
      try { return git('show', `${ref}:${file}`); } catch { return null; }
    },
    exists(ref) { return gitOk('rev-parse', '--verify', '-q', ref); },
    isAncestor(a, b) { return gitOk('merge-base', '--is-ancestor', a, b); },
    prRef(n) { return `refs/remotes/origin/pr/${n}`; },
    changedIn(base, head) {
      return git('diff', '--name-only', `${base}...${head}`).split('\n').filter(Boolean);
    },

    /** このレッスンが始まった後に作られた PR */
    async pullsSinceStart() {
      const all = (await gh.pulls()) || [];
      return all.filter((p) => p.number > mark.prFloor).sort((a, b) => a.number - b.number);
    },
    async comments(n) { return (await gh.comments(n)) || []; },
    async timeline(n) { return (await gh.timeline(n)) || []; },
    async issue(n) { return gh.issue(n); },
    async createIssue(title, body, labels) { return gh.createIssue(title, body, labels); },

    /** ボット（チームメイト役）が main にコミットして push する */
    botCommit(message, edits) {
      git('checkout', '-q', '-B', 'trainer-bot-work', 'origin/main');
      for (const [file, content] of Object.entries(edits)) {
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, content);
        git('add', file);
      }
      git('-c', `user.name=${BOT.name}`, '-c', `user.email=${BOT.email}`, 'commit', '-q', '-m', message);
      git('push', '-q', 'origin', 'HEAD:main');
      fetchAll();
      return git('rev-parse', 'HEAD');
    },

    /**
     * ref にある JS ファイルを別プロセスで読み込み、expr を評価した結果を返す。
     * 例: evalAt('origin/main', 'practice/calc.js', 'm.average([2, 4])')
     * 読み込めない・例外が出たときは { error } を返す。
     */
    evalAt(ref, file, expr) {
      const src = tools.fileAt(ref, file);
      if (src == null) return { error: `${file} がありません` };
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'trainer-'));
      const p = path.join(dir, 'mod.cjs');
      fs.writeFileSync(p, src);
      try {
        const out = execFileSync(process.execPath, ['-e',
          `const m = require(${JSON.stringify(p)}); process.stdout.write(JSON.stringify(${expr}));`],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 10000 });
        return { value: JSON.parse(out) };
      } catch (e) {
        return { error: String(e.stderr || e.message).split('\n').find((l) => /Error/.test(l)) || 'エラー' };
      } finally {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    },
  };
  return tools;
}

// ---------------------------------------------------------------------------
// レッスンの開始・合格

function lessonBody(n, vars) {
  const file = path.join(HERE, 'lessons', `${String(n).padStart(2, '0')}.md`);
  let text = fs.readFileSync(file, 'utf8');
  const all = { repo: REPO, repoUrl: `${SERVER}/${REPO}`, ...vars };
  text = text.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in all ? String(all[k]) : `{{${k}}}`));
  const title = text.match(/^# (.+)$/m)[1];
  return { title, text };
}

async function startLesson(n) {
  fetchAll();
  const lesson = lessons.find((l) => l.n === n);
  const all = (await gh.pulls()) || [];
  const prFloor = all.reduce((m, p) => Math.max(m, p.number), 0);
  const mark = { lesson: n, start: git('rev-parse', 'origin/main'), prFloor, extra: {} };
  if (lesson.start) mark.extra = (await lesson.start(makeTools(mark))) || {};
  const { title, text } = lessonBody(n, mark.extra);
  const issue = await gh.createIssue(title, `${text}\n\n<!-- trainer ${JSON.stringify(mark)} -->\n`);
  console.log(`レッスン ${n} を開始しました: #${issue.number}`);
  return issue;
}

async function finishCourse() {
  const all = ((await gh.pulls()) || []).filter((p) => p.merged_at).sort((a, b) => a.number - b.number);
  const list = all.map((p) => `- [#${p.number} ${p.title}](${p.html_url || `${SERVER}/${REPO}/pull/${p.number}`})`).join('\n');
  const { title, text } = lessonBody('done', { pulls: list || '（なし）' });
  await gh.createIssue(title, `${text}\n\n<!-- trainer ${JSON.stringify({ lesson: 'done' })} -->\n`);
}

/** 同じ内容のコメントを何度も書かないように、直前のボットのコメントと比べる */
async function postFeedback(n, body) {
  const full = `${FEEDBACK_MARK}\n${body}`;
  const comments = (await gh.comments(n)) || [];
  const last = [...comments].reverse().find((c) => c.body && c.body.startsWith(FEEDBACK_MARK));
  if (last && last.body.trim() === full.trim()) return;
  await gh.comment(n, full);
}

// ---------------------------------------------------------------------------

async function main() {
  if (!REPO || !TOKEN) throw new Error('GITHUB_REPOSITORY と GITHUB_TOKEN が必要です');
  await gh.ensureLabel(LABEL, '2f6fed', 'git トレーナーのレッスン');
  await gh.ensureLabel('bug', 'd73a4a', "Something isn't working");

  const issues = ((await gh.issues()) || [])
    .map((i) => ({ issue: i, mark: readMark(i) }))
    .filter((x) => x.mark);

  if (issues.length === 0) {
    await startLesson(1);
    return;
  }
  const current = issues
    .filter((x) => x.issue.state === 'open' && typeof x.mark.lesson === 'number')
    .sort((a, b) => a.mark.lesson - b.mark.lesson)[0];
  if (!current) {
    console.log('開いているレッスンはありません（修了済み、または Issue を手で閉じた）');
    return;
  }

  fetchAll();
  const { issue, mark } = current;
  const lesson = lessons.find((l) => l.n === mark.lesson);
  const tools = makeTools(mark);
  tools.issueNumber = issue.number;
  tools.saveExtra = async (extra) => {
    mark.extra = { ...mark.extra, ...extra };
    await gh.updateIssue(issue.number, { body: writeMark(issue.body, mark) });
    issue.body = writeMark(issue.body, mark);
  };

  const result = await lesson.check(tools);

  for (const [n, body] of Object.entries(result.prFeedback || {})) {
    await postFeedback(Number(n), body);
  }

  if (result.pass) {
    await gh.comment(issue.number, `${FEEDBACK_MARK}\n## ✅ 合格です\n\n${result.message || ''}\n\n次のレッスンの Issue を開きました。`);
    await gh.updateIssue(issue.number, { state: 'closed', state_reason: 'completed' });
    const next = lessons.find((l) => l.n === mark.lesson + 1);
    if (next) await startLesson(next.n); else await finishCourse();
    return;
  }
  if (result.feedback) await postFeedback(issue.number, result.feedback);
  console.log(`レッスン ${mark.lesson}: まだ合格ではありません`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
