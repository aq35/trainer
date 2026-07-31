/* 目次ページの「全体地図」と、「git の基本」のチェックリストを担当する。
   進捗は各ナビと同じ localStorage を読むだけで、書き換えはしない。
   読み物だけは「開いたかどうか」をここで記録する。 */
(function () {
  // read: そのステップの直後に挟む読み物（任意。読まなくても先に進める）
  var STEPS = [
    { key: 'trainer-setup-v1',  total: 9, label: '環境構築',      href: 'setup.html',  icon: 'icon-vscode.svg',
      read: { md: 'why-vscode', label: 'なぜ VS Code なのか？ 拡張機能って何？', icon: 'icon-vscode.svg' } },
    { key: null,                          label: 'git の基本',    href: '#/step2-git', icon: 'icon-git.svg', check: 'step2',
      read: { md: 'why-git', label: 'なぜ git が生まれたのか', icon: 'icon-git.svg' } },
    { key: 'trainer-github-v1', total: 9, label: 'GitHubに上げる', href: 'github.html', icon: 'icon-github.svg' },
    { key: 'trainer-diff-v1',   total: 6, label: '差分を読む',     href: 'diff.html',   icon: 'icon-terminal.svg' },
    { key: 'trainer-ai-v1',     total: 7, label: 'AIと一緒に',     href: 'ai.html',     icon: 'icon-ai.svg',
      read: { md: 'why-ai-mistakes', label: 'AIはなぜ間違えるのか', icon: 'icon-ai.svg' } },
    { key: 'trainer-code-v1',   total: 11, label: 'はじめてのプログラム', href: 'code.html',   icon: 'icon-vscode.svg' },
    { key: 'trainer-branch-v1', total: 7, label: 'ブランチと安全な進め方', href: 'branch.html', icon: 'icon-git.svg',
      read: { md: 'what-is-service', label: 'サービスって何？ GitHubを分解してみる', icon: 'icon-github.svg' } },
    { key: 'trainer-publish-v1', total: 8, label: '世界に公開する', href: 'publish.html', icon: 'icon-github.svg' }
  ];

  var READ_KEY = 'trainer-read-v1';

  function read(k) {
    try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch (e) { return {}; }
  }

  function readings() {
    return STEPS.filter(function (s) { return s.read; }).map(function (s) { return s.read; });
  }

  // 読み物のページを開いたら「読んだ」として記録する
  function markRead() {
    var m = /^#\/([a-z0-9-]+)/.exec(location.hash || '');
    if (!m) return;
    var hit = readings().some(function (r) { return r.md === m[1]; });
    if (!hit) return;
    var done = read(READ_KEY);
    if (done[m[1]]) return;
    done[m[1]] = true;
    try { localStorage.setItem(READ_KEY, JSON.stringify(done)); } catch (e) {}
  }

  function state(s) {
    if (s.check) {
      var m = read('trainer-step2-check');
      var done = Object.keys(m).filter(function (k) { return m[k]; }).length;
      if (!done) return { pct: 0, txt: 'これから' };
      return { pct: Math.min(100, Math.round(done / 5 * 100)), txt: done >= 5 ? '完了' : '途中' };
    }
    var v = read(s.key);
    if (typeof v.i !== 'number' || v.i === 0) return { pct: 0, txt: 'これから' };
    if (v.i >= s.total) return { pct: 100, txt: '完了' };
    return { pct: Math.round(v.i / s.total * 100), txt: v.i + ' / ' + s.total };
  }

  // 進捗をGitHubのIssueとして報告する
  function repoName() {
    var c = window.TRAINER_SUPPORT || {};
    if (c.repo) return c.repo;
    var m = /github\.com\/([^\/]+\/[^\/]+)/.exec(c.url || '');
    return m ? m[1] : '';
  }
  function stamp() {
    var d = new Date(), z = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()) + ' ' + z(d.getHours()) + ':' + z(d.getMinutes());
  }
  function reportUrl() {
    var r = repoName();
    if (!r) return '';
    var lines = ['## いまの進捗', ''];
    var done = 0;
    STEPS.forEach(function (s, i) {
      var st = state(s);
      if (st.pct >= 100) done++;
      lines.push('- [' + (st.pct >= 100 ? 'x' : ' ') + '] ' + (i + 1) + '. ' + s.label + ' — ' + st.txt);
    });
    var rs = readings(), rdone = read(READ_KEY);
    var rn = rs.filter(function (r) { return rdone[r.md]; }).length;
    lines.push('');
    lines.push('読み物（任意）: ' + rn + ' / ' + rs.length + ' 読了');
    lines.push('');
    lines.push('報告日時: ' + stamp());
    lines.push('');
    lines.push('困っていること・聞きたいことがあれば、ここに書いてください（空のままでも大丈夫です）。');
    return 'https://github.com/' + r + '/issues/new?labels=' + encodeURIComponent('進捗') +
           '&title=' + encodeURIComponent('[進捗] ' + done + ' / ' + STEPS.length + ' まで進みました') +
           '&body=' + encodeURIComponent(lines.join('\n'));
  }

  function drawMap() {
    var el = document.getElementById('map');
    if (!el) return;
    var rdone = read(READ_KEY);
    var h = '<div class="map">';
    STEPS.forEach(function (s, i) {
      var st = state(s);
      var cls = st.pct >= 100 ? ' done' : (st.pct > 0 ? ' now' : '');
      h += '<a class="mapitem' + cls + '" href="' + s.href + '">' +
           '<span class="n">' + (st.pct >= 100 ? '✓' : (i + 1)) + '</span>' +
           '<img src="media/' + s.icon + '" width="24" height="24" alt="">' +
           '<span class="l">' + s.label + '</span>' +
           '<span class="s">' + st.txt + '</span>' +
           '<span class="pb"><i style="width:' + st.pct + '%"></i></span></a>';
      // 手を動かしたあとに、その道具の話を読む。飛ばしても先に進める。
      if (s.read) {
        var done = !!rdone[s.read.md];
        h += '<a class="mapitem reading' + (done ? ' done' : '') + '" href="#/' + s.read.md + '">' +
             '<span class="n">☕</span>' +
             '<img src="media/' + s.read.icon + '" width="24" height="24" alt="">' +
             '<span class="l">' + s.read.label + '</span>' +
             '<span class="s">' + (done ? '読んだ' : '読み物・任意') + '</span></a>';
      }
    });
    h += '</div>';
    var all = STEPS.every(function (s) { return state(s).pct >= 100; });
    if (all) h += '<div class="mapall">全部おつかれさまでした。ここまでできれば、案件に入る準備はできています。</div>';

    var u = reportUrl();
    if (u) {
      h += '<div class="mapreport"><b>いまの進み具合を、担当者に知らせられます</b><br>' +
           '<span class="mrsub">GitHub にログインしていれば、上の内容が入った状態で開きます。' +
           '<b>あとは送信ボタンを押すだけ</b>です。困っていることを書き足しても構いません。<br>' +
           '「404」と出るときは、まだ研修グループに招待されていません。招待が届いてから押してください。</span>' +
           '<a class="mrbtn" href="' + u + '" target="_blank" rel="noopener">進捗を報告する</a></div>';
    }
    el.innerHTML = h;
  }

  // Step 2 のチェックリストを保存できるようにする
  function wireChecks() {
    var boxes = document.querySelectorAll('.markdown-section .task-list-item input[type=checkbox]');
    if (!boxes.length) return;
    var saved = read('trainer-step2-check');
    boxes.forEach(function (b, i) {
      b.disabled = false;
      b.checked = !!saved[i];
      b.onchange = function () {
        var m = read('trainer-step2-check');
        m[i] = b.checked;
        try { localStorage.setItem('trainer-step2-check', JSON.stringify(m)); } catch (e) {}
      };
    });
  }

  function run() { markRead(); drawMap(); wireChecks(); }
  window.addEventListener('hashchange', function () { setTimeout(run, 300); });
  document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 400); });
  setTimeout(run, 900);
  setTimeout(run, 1800);
})();
