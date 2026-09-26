// テスト用の「GitHub の代わり」です。採点ボットが使う REST API だけを、メモリ上で真似します。
// git の中身（コミット・ブランチ）は本物の bare リポジトリを使います。

import http from 'node:http';

export function createFakeGitHub() {
  let counter = 0;
  const issues = new Map();   // Issue と PR は GitHub と同じく番号を共有する
  const pulls = new Map();
  const labels = new Set();
  const now = () => new Date().toISOString();
  const BOT = { login: 'github-actions[bot]', type: 'Bot' };

  function addIssue({ title, body, labels: ls = [], user = BOT }) {
    const number = ++counter;
    const issue = {
      number, title, body: body || '', state: 'open', state_reason: null,
      labels: ls.map((name) => ({ name })), created_at: now(), user,
      comments: [], timeline: [],
    };
    issues.set(number, issue);
    return issue;
  }
  const publicIssue = (i) => {
    const { comments, timeline, ...rest } = i;
    return rest;
  };

  function addPull({ head, headSha, title, body, user }) {
    const issue = addIssue({ title, body, user });
    const pull = {
      number: issue.number, title, body: body || '', state: 'open', merged_at: null,
      created_at: issue.created_at, head: { ref: head, sha: headSha }, base: { ref: 'main' },
      html_url: `https://github.com/test/pull/${issue.number}`,
    };
    pulls.set(issue.number, pull);
    issue.pull_request = {};
    return pull;
  }

  async function readBody(req) {
    let data = '';
    for await (const chunk of req) data += chunk;
    return data ? JSON.parse(data) : null;
  }

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    const parts = url.pathname.split('/').filter(Boolean); // repos, o, r, ...
    const send = (status, obj) => {
      res.writeHead(status, { 'content-type': 'application/json' });
      res.end(obj === undefined ? '' : JSON.stringify(obj));
    };
    try {
      if (parts[0] !== 'repos') return send(404, { message: 'Not Found' });
      const rest = parts.slice(3);
      const body = await readBody(req);
      const m = req.method;

      if (rest[0] === 'labels' && m === 'POST') {
        if (labels.has(body.name)) return send(422, { message: 'already_exists' });
        labels.add(body.name);
        return send(201, body);
      }
      if (rest[0] === 'issues' && rest.length === 1) {
        if (m === 'GET') {
          const label = url.searchParams.get('labels');
          const list = [...issues.values()]
            .filter((i) => !label || i.labels.some((l) => l.name === label))
            .sort((a, b) => b.number - a.number)
            .map(publicIssue);
          return send(200, list);
        }
        if (m === 'POST') return send(201, publicIssue(addIssue(body)));
      }
      if (rest[0] === 'issues' && rest.length >= 2) {
        const issue = issues.get(Number(rest[1]));
        if (!issue) return send(404, { message: 'Not Found' });
        if (rest.length === 2 && m === 'GET') return send(200, publicIssue(issue));
        if (rest.length === 2 && m === 'PATCH') {
          Object.assign(issue, body);
          return send(200, publicIssue(issue));
        }
        if (rest[2] === 'comments' && m === 'GET') return send(200, issue.comments);
        if (rest[2] === 'comments' && m === 'POST') {
          const c = { id: issue.comments.length + 1, body: body.body, user: BOT };
          issue.comments.push(c);
          return send(201, c);
        }
        if (rest[2] === 'timeline' && m === 'GET') return send(200, issue.timeline);
      }
      if (rest[0] === 'pulls' && rest.length === 1 && m === 'GET') {
        return send(200, [...pulls.values()].sort((a, b) => b.number - a.number));
      }
      return send(404, { message: `未対応: ${m} ${url.pathname}` });
    } catch (e) {
      return send(500, { message: String(e) });
    }
  });

  return {
    issues, pulls, addIssue, addPull,
    listen: () => new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(`http://127.0.0.1:${server.address().port}`))),
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}
