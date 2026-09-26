// レッスンごとの「開始時にすること」と「合否の判定」です。
// 本文（受講者が読む説明）は lessons/NN.md にあります。
//
// check(t) の返り値:
//   { pass: true, message }              合格
//   { feedback }                         Issue に書く「まだ足りないこと」（書かないなら省略）
//   { prFeedback: { [PR番号]: 本文 } }   PR に書くコメント（レビュー役）

const BAD_MESSAGES = ['update', 'fix', 'test', 'wip', 'commit', '修正', '変更', '更新', 'あ', 'a', '.'];
const CONVENTIONAL = /^(feat|fix|docs|refactor|test|chore): \S/;
const WORDS = ['みかん', 'ひまわり', 'すいか', 'とんぼ', 'ふうりん', 'かきごおり', 'はなび', 'ゆかた'];
const CLOSES = (n) => new RegExp(`(close[sd]?|fix(e[sd])?|resolve[sd]?)\\s+#${n}\\b`, 'i');

const isPushOrManual = (t) => ['push', 'workflow_dispatch'].includes(t.eventName);
const eventPr = (t) => t.event && t.event.pull_request && t.event.pull_request.number;

export const lessons = [
  // -------------------------------------------------------------------------
  {
    n: 1,
    async check(t) {
      const commits = t.learnerCommits(`${t.mark.start}..origin/main`, 'practice/hello.md');
      const content = t.fileAt('origin/main', 'practice/hello.md');
      if (commits.length && content && content.trim()) {
        return { pass: true, message: `あなたのコミット \`${commits[0].sha.slice(0, 7)}\`（${commits[0].subject}）が GitHub に届きました。\n手元 → GitHub の一往復ができています。` };
      }
      if (!isPushOrManual(t)) return {};
      if (content != null && !content.trim()) {
        return { feedback: '`practice/hello.md` は届いていますが、中身が空です。1行書いて保存し、add → commit → push をもう一度やります。' };
      }
      return { feedback: 'push は届きましたが、`main` に `practice/hello.md` を含むコミットが見当たりません。\n`git status` でファイルが commit 済みか、`git log --oneline` で自分のコミットがあるかを確かめてください。' };
    },
  },

  // -------------------------------------------------------------------------
  {
    n: 2,
    async check(t) {
      const commits = t.learnerCommits(`${t.mark.start}..origin/main`, 'practice/diary.md');
      const diary = t.fileAt('origin/main', 'practice/diary.md') || '';
      const lines = diary.split('\n').filter((l) => l.trim()).length;
      const isBad = (c) => c.subject.trim().length < 5 || BAD_MESSAGES.includes(c.subject.trim().toLowerCase());
      const bad = commits.filter(isBad);
      const good = commits.filter((c) => !isBad(c));
      if (good.length >= 3 && lines >= 3) {
        return { pass: true, message: `\`practice/diary.md\` に ${good.length} 回に分けて記録できました。\n\n${good.slice().reverse().map((c) => `- \`${c.sha.slice(0, 7)}\` ${c.subject}`).join('\n')}` };
      }
      if (!isPushOrManual(t)) return {};
      const todo = [];
      if (good.length < 3) todo.push(`- 数に入るコミットが、いま **${good.length} 個**です（3個以上必要）`);
      if (lines < 3) todo.push(`- \`practice/diary.md\` の中身が、いま **${lines} 行**です（3行以上必要）`);
      for (const c of bad) todo.push(`- \`${c.sha.slice(0, 7)}\` のメッセージ「${c.subject}」では、何をしたのか後から分かりません（数に入れません）`);
      if (bad.length) todo.push('\n一度 push したメッセージの直し方はレッスン8で習います。ここでは、**良いメッセージのコミットを足して**ください。');
      return { feedback: `まだ足りないところがあります。\n\n${todo.join('\n')}` };
    },
  },

  // -------------------------------------------------------------------------
  {
    n: 3,
    async start(t) {
      const word = WORDS[Math.floor(Math.random() * WORDS.length)];
      const sha = t.botCommit('なぞのファイルに合言葉を書いた', {
        'practice/mystery.md': `# なぞのファイル\n\nチームメイトが、ここに合言葉を書きました。\n\n合言葉: ${word}\n`,
      });
      return { sha, word };
    },
    async check(t) {
      const { sha, word } = t.mark.extra;
      const comments = (await t.comments(t.issueNumber)).filter((c) => c.user && c.user.type !== 'Bot' && !String(c.user.login).endsWith('[bot]'));
      for (const c of comments) {
        const hashes = (c.body.match(/\b[0-9a-f]{7,40}\b/g) || []);
        const hashOk = hashes.some((h) => sha.startsWith(h));
        if (hashOk && c.body.includes(word)) {
          return { pass: true, message: `ハッシュも合言葉も正解です。\n\`git pull\` で取り込み、\`git log\` で見つけ、\`git show\` で中身を読めました。` };
        }
      }
      if (t.eventName !== 'issue_comment' || !comments.length) return {};
      const last = comments[comments.length - 1].body;
      const hashes = last.match(/\b[0-9a-f]{7,40}\b/g) || [];
      const tips = [];
      if (!hashes.length) tips.push('- コミットのハッシュ（英数字7文字以上）が見つかりません');
      else if (!hashes.some((h) => sha.startsWith(h))) tips.push('- ハッシュが違います。`git log --oneline` で、メッセージが「なぞのファイルに合言葉を書いた」の行を探します');
      if (!last.includes(word)) tips.push('- 合言葉が違います。`git show <ハッシュ>` で、`+` が付いた行を読みます');
      return { feedback: `惜しいです。\n\n${tips.join('\n')}` };
    },
  },

  // -------------------------------------------------------------------------
  {
    n: 4,
    async start(t) {
      const before = t.fileAt('origin/main', 'practice/config.md') || '# 設定\n\nmode = safe\nretry = 3\n';
      const sha = t.botCommit('設定を変更', {
        'practice/config.md': before.replace('mode = safe', 'mode = broken'),
      });
      return { sha };
    },
    async check(t) {
      const { sha } = t.mark.extra;
      const config = t.fileAt('origin/main', 'practice/config.md') || '';
      const reverts = t.learnerCommits(`${t.mark.start}..origin/main`)
        .filter((c) => t.git('log', '-1', '--format=%B', c.sha).includes(`This reverts commit ${sha}`));
      const fixed = config.includes('mode = safe') && !config.includes('mode = broken');
      if (reverts.length && fixed) {
        return { pass: true, message: `\`${reverts[0].sha.slice(0, 7)}\` で打ち消しました。\n元のコミット \`${sha.slice(0, 7)}\` は履歴に残ったままです。**何が起きて、どう戻したか**が全部記録に残るのが revert の良いところです。` };
      }
      if (!isPushOrManual(t)) return {};
      if (fixed && !reverts.length) {
        return { feedback: '`config.md` は元に戻っていますが、`git revert` で作ったコミットが見当たりません。\n手で書き直すと、「どのコミットを取り消したのか」が記録に残りません。レッスンの手順どおり `git revert <ハッシュ>` を使ってください（手で直したコミットは、そのままで構いません。もう一度 `mode = broken` に戻してから revert すると確実です）。' };
      }
      if (reverts.length && !fixed) {
        return { feedback: 'revert のコミットはありますが、`practice/config.md` がまだ `mode = safe` に戻っていません。`git show HEAD` で中身を確かめてください。' };
      }
      return { feedback: `まだ取り消されていません。\`git pull\` で最新にしてから、\`git revert ${sha.slice(0, 7)}\` → \`git push\` です。` };
    },
  },

  // -------------------------------------------------------------------------
  {
    n: 5,
    async check(t) {
      const prs = (await t.pullsSinceStart()).filter((p) => p.base.ref === 'main' && p.head.ref !== 'main');
      const merged = prs.filter((p) => p.merged_at);
      const good = merged.find((p) => (p.body || '').trim().length >= 10);
      if (good && !t.exists(`refs/remotes/origin/${good.head.ref}`)) {
        return { pass: true, message: `PR #${good.number} をマージし、ブランチ \`${good.head.ref}\` も片付けました。\nこれが、チーム開発で毎日くり返す一周です。` };
      }
      if (good) {
        return { feedback: `PR #${good.number} のマージ、できました。最後に片付けです。PR の画面の **Delete branch** を押して、GitHub 上の \`${good.head.ref}\` を消してください。` };
      }
      if (merged.length) {
        return { feedback: `PR #${merged[0].number} はマージされましたが、説明文（本文）がほとんど空でした。\nPR の本文は「何を・なぜ変えたか」を読む人に伝える場所です。**もう一度、別のブランチで小さな変更を作り**、本文を10文字以上書いた PR を出してマージしてください。` };
      }
      if (prs.length) {
        const p = prs[0];
        if ((p.body || '').trim().length < 10) return { feedback: `PR #${p.number} ができました。マージする前に、本文に「何を・なぜ変えたか」を書いてください（右上の **…** → **Edit** で書けます）。` };
        return {};
      }
      if (t.eventName === 'push' && t.event.ref === 'refs/heads/main') {
        return { feedback: '`main` に直接 push されました。このレッスンでは **ブランチを作ってから** push します。`git switch -c <ブランチ名>` から始めてください。' };
      }
      return {};
    },
  },

  // -------------------------------------------------------------------------
  {
    n: 6,
    async check(t) {
      const prs = (await t.pullsSinceStart()).filter((p) => p.base.ref === 'main' && p.head.ref !== 'main');
      const touching = prs.filter((p) => t.exists(t.prRef(p.number)) && t.changedIn(t.mark.start, t.prRef(p.number)).includes('practice/team.md'));
      const prFeedback = {};

      // 1回目: 受講者が team.md を変える PR を出したら、チームメイト役が同じ行を先に main に入れる
      if (!t.mark.extra.sha && touching.length) {
        const pr = touching[0];
        const team = t.fileAt('origin/main', 'practice/team.md') || '担当: 未定\n締め切り: 金曜日\n';
        const lines = team.split('\n');
        lines[0] = '担当: 佐藤（チームメイトが先に決めました）';
        const sha = t.botCommit('担当者を佐藤さんに決めた', { 'practice/team.md': lines.join('\n') });
        await t.saveExtra({ sha, pr: pr.number });
        prFeedback[pr.number] = [
          '## チームメイトからのお知らせ（ボットです）',
          '',
          `あなたが PR を出している間に、チームメイトが \`practice/team.md\` の **同じ1行目** を書き換えて、先に \`main\` に入れました（コミット \`${sha.slice(0, 7)}\`）。`,
          '',
          '少し待ってこの PR の画面を再読み込みすると、下の方に **This branch has conflicts that must be resolved** と出ます。',
          'Issue の手順に戻って、手元でコンフリクトを解決してください。',
        ].join('\n');
        return { prFeedback };
      }
      if (!t.mark.extra.sha) {
        if (prs.length && t.eventName === 'pull_request') {
          return { feedback: `PR #${prs[0].number} に \`practice/team.md\` の変更が含まれていません。1行目を書き換えるコミットを、このブランチに足して push してください。` };
        }
        return {};
      }

      const { sha } = t.mark.extra;
      const markers = t.gitOk('grep', '-qE', '^(<<<<<<<|>>>>>>>|=======)( |$)', 'origin/main', '--', 'practice/team.md');
      const done = prs.filter((p) => p.merged_at && t.exists(t.prRef(p.number)))
        .find((p) => t.isAncestor(sha, t.prRef(p.number)) && t.learnerCommits(`${t.prRef(p.number)} ^${t.mark.start}`, 'practice/team.md').length);
      if (done && !markers) {
        const line = (t.fileAt('origin/main', 'practice/team.md') || '').split('\n')[0];
        return { pass: true, message: `コンフリクトを解決して PR #${done.number} をマージできました。\nいまの1行目: \`${line}\`\n\nコンフリクトは事故ではなく、**二人が同じ場所を直した、という知らせ**です。どちらを残すかを決めるのは、git ではなく人間です。` };
      }
      if (markers) {
        return { feedback: '`main` の `practice/team.md` に、コンフリクトの印（`<<<<<<<` `=======` `>>>>>>>`）が残っています。印の行を消すコミットを作って、PR でもう一度取り込んでください。' };
      }
      return {};
    },
  },

  // -------------------------------------------------------------------------
  {
    n: 7,
    async check(t) {
      const prs = (await t.pullsSinceStart()).filter((p) => p.base.ref === 'main' && p.head.ref !== 'main' && t.exists(t.prRef(p.number)));
      const problemsOf = (p) => {
        const head = t.prRef(p.number);
        const report = t.fileAt(head, 'practice/report.md');
        const list = [];
        if (report == null) list.push('`practice/report.md` がありません。`practice/report-template.md` をコピーして作ります');
        else {
          if (/TODO/.test(report)) list.push('`practice/report.md` に `TODO` が残っています。自分の言葉で書き換えてください');
          if (!/^## やったこと/m.test(report)) list.push('`## やったこと` の見出しが消えています。テンプレートの見出しは残します');
        }
        if (!(p.body || '').trim()) list.push('PR の本文が空です。何のための変更かを1行書いてください');
        return list;
      };

      const prFeedback = {};
      const target = eventPr(t);
      for (const p of prs.filter((x) => x.state === 'open')) {
        if (target && target !== p.number) continue;
        const list = problemsOf(p);
        prFeedback[p.number] = list.length
          ? `## レビュー（ボットです）\n\n直してほしいところが ${list.length} 点あります。\n\n${list.map((x, i) => `${i + 1}. ${x}`).join('\n')}\n\n同じブランチで直してコミットし、\`git push\` すると、この PR に自動で追加されます。**PR を作り直す必要はありません。**`
          : '## レビュー（ボットです）\n\n指摘はすべて直っています。ありがとうございます。**Merge pull request** で取り込んでください。';
      }

      const merged = prs.filter((p) => p.merged_at);
      const good = merged.find((p) => !problemsOf(p).length && t.learnerCommits(`${t.prRef(p.number)} ^${t.mark.start}`, 'practice/report.md').length >= 2);
      if (good) {
        return { pass: true, prFeedback, message: `PR #${good.number} で、レビューの指摘に同じ PR の上で応えてからマージできました。\n\n「指摘された → 同じブランチで直して push → もう一度見てもらう」。これが実務のレビューの回し方です。` };
      }
      const bad = merged.find((p) => problemsOf(p).length);
      if (bad) return { prFeedback, feedback: `PR #${bad.number} は、指摘が残ったままマージされました。新しいブランチで直して、もう一度 PR を出してください。` };
      const once = merged.find((p) => !problemsOf(p).length);
      if (once) return { prFeedback, feedback: `PR #${once.number} は最初から指摘なしでした。今回は **指摘を受けて直す** 練習なので、手順どおり TODO を残したまま一度 PR を出すところから、もう一度やってください。` };
      return { prFeedback };
    },
  },

  // -------------------------------------------------------------------------
  {
    n: 8,
    async check(t) {
      const prs = (await t.pullsSinceStart()).filter((p) => p.base.ref === 'main' && p.head.ref !== 'main' && t.exists(t.prRef(p.number)));
      const messagesOf = (p) => t.learnerCommits(`${t.prRef(p.number)} ^${t.mark.start}`).map((c) => c.subject);
      const prFeedback = {};
      const target = eventPr(t);
      for (const p of prs.filter((x) => x.state === 'open')) {
        if (target && target !== p.number) continue;
        const wrong = messagesOf(p).filter((m) => !CONVENTIONAL.test(m));
        prFeedback[p.number] = wrong.length
          ? `## レビュー（ボットです）\n\nこのチームでは、コミットメッセージを \`種類: 内容\` の形で書く決まりです（例: \`docs: about に目的を書いた\`）。\n\n決まりに合っていないメッセージ:\n${wrong.map((m) => `- \`${m}\``).join('\n')}\n\nIssue の手順どおり、\`git commit --amend\` で直して \`git push --force-with-lease\` してください。`
          : '## レビュー（ボットです）\n\nメッセージの決まり、守られています。**Merge pull request** で取り込んでください。';
      }
      for (const p of prs.filter((x) => x.merged_at)) {
        const wrong = messagesOf(p).filter((m) => !CONVENTIONAL.test(m));
        const forced = (await t.timeline(p.number)).some((e) => e.event === 'head_ref_force_pushed');
        if (!wrong.length && forced) {
          return { pass: true, prFeedback, message: `PR #${p.number} で、push 済みのコミットを直して上書きできました。\n\n\`--force-with-lease\` は「自分が最後に見た後で、誰も push していなければ上書きする」という安全装置つきの上書きです。**自分だけのブランチでだけ**使います。\`main\` では使いません。` };
        }
        if (wrong.length) return { prFeedback, feedback: `PR #${p.number} は、決まりに合わないメッセージのままマージされました。新しいブランチで、もう一度やってください。` };
        if (!forced) return { prFeedback, feedback: `PR #${p.number} は最初から決まりどおりでした。今回は **push した後で直す** 練習なので、手順どおり、最初は「about を更新」というメッセージで push するところから、新しいブランチでもう一度やってください。` };
      }
      return { prFeedback };
    },
  },

  // -------------------------------------------------------------------------
  {
    n: 9,
    async start(t) {
      const bug = await t.createIssue(
        'average の結果がおかしい',
        [
          '`practice/calc.js` の `average` を使ったら、結果が合いません。',
          '',
          '## 再現手順',
          '```',
          'node -e "console.log(require(\'./practice/calc.js\').average([2, 4]))"',
          '```',
          '',
          '## 期待する結果',
          '`3`',
          '',
          '## 実際の結果',
          '`2`',
        ].join('\n'),
        ['bug'],
      );
      return { bug: bug.number };
    },
    async check(t) {
      const { bug } = t.mark.extra;
      const cases = [[[2, 4], 3], [[1, 2, 3, 4], 2.5], [[5], 5]];
      const results = cases.map(([input, want]) => ({ input, want, got: t.evalAt('origin/main', 'practice/calc.js', `m.average(${JSON.stringify(input)})`) }));
      const correct = results.every((r) => r.got.value === r.want);
      const issue = await t.issue(bug);
      const prs = (await t.pullsSinceStart()).filter((p) => p.merged_at);
      const linked = prs.find((p) => CLOSES(bug).test(`${p.title}\n${p.body || ''}`));
      if (correct && issue && issue.state === 'closed' && linked) {
        return { pass: true, message: `Issue #${bug} を PR #${linked.number} で直し、マージと同時に Issue が自動で閉じました。\n\n報告を読む → 手元で再現する → ブランチで直す → テストで確かめる → PR で説明する → 取り込む。**これで、仕事の一周を自分の手で回せました。**` };
      }
      if (!['push', 'pull_request', 'workflow_dispatch', 'issues'].includes(t.eventName)) return {};
      const todo = [];
      if (!correct) {
        for (const r of results.filter((x) => x.got.value !== x.want)) {
          todo.push(`- \`main\` で \`average(${JSON.stringify(r.input)})\` が \`${r.got.error ? r.got.error : JSON.stringify(r.got.value)}\` です（期待は \`${r.want}\`）`);
        }
      }
      if (prs.length && !linked) todo.push(`- マージされた PR の本文に \`Closes #${bug}\` がありません。これを書くと、マージと同時に Issue が閉じます`);
      if (issue && issue.state !== 'closed') todo.push(`- Issue #${bug} がまだ開いています`);
      if (!todo.length || (!prs.length && t.eventName !== 'pull_request')) return {};
      return { feedback: `もう少しです。\n\n${todo.join('\n')}` };
    },
  },
];
