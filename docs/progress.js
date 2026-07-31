/* 目次ページの「全体地図」と、「git の基本」のチェックリストを担当する。
   進捗は各ナビと同じ localStorage を読むだけで、書き換えはしない。
   読み物だけは「開いたかどうか」をここで記録する。 */
(function () {
  // read:       そのステップの直後に挟む読み物（任意。読まなくても先に進める）
  // readBefore: そのステップの手前に挟む読み物（道具の正体を先に知りたい人向け）
  var STEPS = [
    { key: 'trainer-setup-v1',  total: 11, label: '環境構築',      href: 'setup.html',  icon: 'icon-vscode.svg',
      readBefore: { md: 'what-is-claude', label: 'そもそも Claude って何？ Claude Code とは違うの？', icon: 'icon-ai.svg' },
      read: { md: 'why-vscode', label: 'なぜ VS Code なのか？ 拡張機能って何？', icon: 'icon-vscode.svg' } },
    { key: 'trainer-git-v1', total: 11, label: 'git の基本', href: 'git.html', icon: 'icon-git.svg',
      read: { md: 'why-git', label: 'なぜ git が生まれたのか', icon: 'icon-git.svg' } },
    { key: 'trainer-github-v1', total: 8, label: 'GitHubに上げる', href: 'github.html', icon: 'icon-github.svg' },
    { key: 'trainer-diff-v1',   total: 6, label: '差分を読む',     href: 'diff.html',   icon: 'icon-terminal.svg' },
    { key: 'trainer-ai-v1',     total: 8, label: 'AIと一緒に',     href: 'ai.html',     icon: 'icon-ai.svg',
      read: { md: 'why-ai-mistakes', label: 'AIはなぜ間違えるのか', icon: 'icon-ai.svg' } },
    { key: 'trainer-code-v1',   total: 12, label: 'はじめてのプログラム', href: 'code.html',   icon: 'icon-vscode.svg' },
    { key: 'trainer-branch-v1', total: 9, label: 'ブランチと安全な進め方', href: 'branch.html', icon: 'icon-git.svg',
      read: { md: 'what-is-service', label: 'サービスって何？ GitHubを分解してみる', icon: 'icon-github.svg' } },
    { key: 'trainer-publish-v1', total: 8, label: '世界に公開する', href: 'publish.html', icon: 'icon-github.svg' },
    { key: 'trainer-work-v1', total: 15, label: '仕事の一周（他人のコードを直す）', href: 'work.html', icon: 'icon-github.svg',
      read: { md: 'what-to-build', label: 'AIに何を作ってもらうか — 使い捨ての仕事と、残る道具', icon: 'icon-ai.svg' } },
    { key: 'trainer-theme-v1', total: 12, label: '自分のテーマで回す', href: 'theme.html', icon: 'icon-ai.svg',
      read: { md: 'what-is-ai-dlc', label: 'AI-DLCって何？ 一人でチームになる方法', icon: 'icon-ai.svg' } },
    { key: 'trainer-aidlc-v1', total: 12, label: 'AIと回す開発の一周', href: 'ai-dlc.html', icon: 'icon-ai.svg',
      read: { md: 'estimate', label: 'どれくらいで終わる？ 工数の見積もり方', icon: 'icon-terminal.svg' } },
    // ここから「案件に入る前の修行」。立場が変わるものばかり
    { key: 'trainer-review-v1',  total: 8, label: 'レビューする側になる',       href: 'review.html',  icon: 'icon-github.svg' },
    { key: 'trainer-bug-v1',     total: 7, label: '曖昧な報告から不具合を追う', href: 'bug.html',     icon: 'icon-terminal.svg' },
    { key: 'trainer-onboard-v1', total: 7, label: '大きなコードに初日で入る',   href: 'onboard.html', icon: 'icon-vscode.svg' },
    { key: 'trainer-ask-v1',     total: 7, label: '詰まったときに、人を頼る',   href: 'ask.html',     icon: 'icon-key.svg',
      read: { md: 'graduation', label: '案件に入る前の最終チェック', icon: 'icon-key.svg',
              badge: '🎓', undone: '仕上げ', done: '確認した' } }
  ];

  var READ_KEY = 'trainer-read-v1';

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function read(k) {
    try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch (e) { return {}; }
  }

  function readings() {
    var out = [];
    STEPS.forEach(function (s) {
      if (s.readBefore) out.push(s.readBefore);
      if (s.read) out.push(s.read);
    });
    return out;
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
  function reportText() {
    var lines = ['いまの進捗', ''];
    var done = 0;
    STEPS.forEach(function (s, i) {
      var st = state(s);
      if (st.pct >= 100) done++;
      lines.push('- [' + (st.pct >= 100 ? 'x' : ' ') + '] ' + (i + 1) + '. ' + s.label + ' — ' + st.txt);
    });
    var rdone = read(READ_KEY);
    var rs = readings().filter(function (r) { return !r.badge; });
    var rn = rs.filter(function (r) { return rdone[r.md]; }).length;
    lines.push('');
    lines.push('読み物（任意）: ' + rn + ' / ' + rs.length + ' 読了');
    if (rdone['graduation']) lines.push('最終チェック: 確認済み');
    lines.push('');
    lines.push('報告日時: ' + stamp());
    lines.push('');
    lines.push('困っていること・聞きたいことがあれば、ここに書いてください（空のままでも大丈夫です）。');
    return { text: lines.join('\n'), done: done };
  }
  function reportUrl() {
    var r = repoName();
    if (!r) return '';
    var t = reportText();
    return 'https://github.com/' + r + '/issues/new?labels=' + encodeURIComponent('進捗') +
           '&title=' + encodeURIComponent('[進捗] ' + t.done + ' / ' + STEPS.length + ' まで進みました') +
           '&body=' + encodeURIComponent(t.text);
  }

  // 文章をコピーする（連絡先が GitHub でないときは、これで送ってもらう）
  function toast(msg) {
    var t = document.querySelector('.plantoast');
    if (!t) { t = document.createElement('div'); t.className = 'plantoast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('on');
    setTimeout(function () { t.classList.remove('on'); }, 2400);
  }
  function copy(text) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('コピーしました。担当者に送ってください'); }
      catch (e) { toast('コピーできませんでした'); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast('コピーしました。担当者に送ってください'); }, fallback);
    } else fallback();
  }
  // 連絡先の1行（config.js の設定から作る）
  function contactLine() {
    var c = window.TRAINER_SUPPORT || {};
    if (!c.name && !c.channel) return '連絡先は、この研修を案内してくれた人に聞いてください。';
    var who = c.name || 'サポート窓口';
    return '送り先: ' + (c.channel ? who + '（' + c.channel + '）' : who);
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-copytext]') : null;
    if (t) copy(t.getAttribute('data-copytext'));
  });

  function drawMap() {
    var el = document.getElementById('map');
    if (!el) return;
    var rdone = read(READ_KEY);
    function readingRow(r) {
      var d = !!rdone[r.md];
      return '<a class="mapitem reading' + (d ? ' done' : '') + '" href="#/' + r.md + '">' +
             '<span class="n">' + (r.badge || '☕') + '</span>' +
             '<img src="media/' + r.icon + '" width="24" height="24" alt="">' +
             '<span class="l">' + r.label + '</span>' +
             '<span class="s">' + (d ? (r.done || '読んだ') : (r.undone || '読み物・任意')) + '</span></a>';
    }
    var h = '<div class="map">';
    STEPS.forEach(function (s, i) {
      var st = state(s);
      // 手を動かす前に、正体だけ知っておきたい人向け
      if (s.readBefore) h += readingRow(s.readBefore);
      var cls = st.pct >= 100 ? ' done' : (st.pct > 0 ? ' now' : '');
      h += '<a class="mapitem' + cls + '" href="' + s.href + '">' +
           '<span class="n">' + (st.pct >= 100 ? '✓' : (i + 1)) + '</span>' +
           '<img src="media/' + s.icon + '" width="24" height="24" alt="">' +
           '<span class="l">' + s.label + '</span>' +
           '<span class="s">' + st.txt + '</span>' +
           '<span class="pb"><i style="width:' + st.pct + '%"></i></span></a>';
      // 手を動かしたあとに、その道具の話を読む。飛ばしても先に進める。
      if (s.read) h += readingRow(s.read);
    });
    h += '</div>';
    var all = STEPS.every(function (s) { return state(s).pct >= 100; });
    if (all) h += '<div class="mapall">全部おつかれさまでした。ここまでできれば、案件に入る準備はできています。</div>';

    var u = reportUrl();
    h += '<div class="mapreport"><b>いまの進み具合を、担当者に知らせられます</b><br>';
    if (u) {
      h += '<span class="mrsub">GitHub にログインしていれば、上の内容が入った状態で開きます。' +
           '<b>あとは送信ボタンを押すだけ</b>です。</span>' +
           '<a class="mrbtn" href="' + u + '" target="_blank" rel="noopener">進捗を報告する</a>';
    } else {
      h += '<span class="mrsub">押すと、いまの進み具合が文章になってコピーされます。' +
           '<b>LINEでもチャットでも、いつもの方法で送ってください。</b><br>' + contactLine() + '</span>' +
           '<button type="button" class="mrbtn" data-copytext="' + esc(reportText().text) + '">進捗をコピーする</button>';
    }
    h += '</div>';
    el.innerHTML = h;
  }

  // チェックリストを保存できるようにする。
  // ページごとに保存先を分ける（同じ鍵だと、別ページのチェックが混ざる）
  function checkKey() {
    var m = /^#\/([a-z0-9-]+)/.exec(location.hash || '');
    var page = m ? m[1] : '';
    return (page === 'step2-git' || page === '') ? 'trainer-step2-check' : 'trainer-check-' + page;
  }
  function wireChecks() {
    var boxes = document.querySelectorAll('.markdown-section .task-list-item input[type=checkbox]');
    if (!boxes.length) return;
    var key = checkKey();
    var saved = read(key);
    boxes.forEach(function (b, i) {
      b.disabled = false;
      b.checked = !!saved[i];
      b.onchange = function () {
        var m = read(key);
        m[i] = b.checked;
        try { localStorage.setItem(key, JSON.stringify(m)); } catch (e) {}
      };
    });
  }

  // 「参画の準備ができました」の申請ボタン。到達状況を入れた状態でIssueを開く。
  function joinText() {
    var lines = ['参画の準備ができました', '',
      '研修を終えたので、案件への参画を相談させてください。', '',
      '### 到達状況（自動）', ''];
    var done = 0;
    STEPS.forEach(function (s, i) {
      var st = state(s);
      if (st.pct >= 100) done++;
      lines.push('- [' + (st.pct >= 100 ? 'x' : ' ') + '] ' + (i + 1) + '. ' + s.label + ' — ' + st.txt);
    });
    var rdone = read(READ_KEY);
    if (rdone['graduation']) lines.push('', '最終チェック: 確認済み');
    lines.push('', '報告日時: ' + stamp(), '',
      '### 見てもらえる成果物', '',
      '- 公開ページ: ',
      '- 練習リポジトリのPR一覧: ',
      '- 自分のテーマのリポジトリ: ',
      '',
      '### いま自信が無いところ（正直に）', '',
      '- ',
      '',
      '### 希望・相談したいこと', '',
      '- 働ける時間帯や開始時期など、あれば書いてください');
    return { text: lines.join('\n'), done: done };
  }
  function joinUrl() {
    var r = repoName();
    if (!r) return '';
    var t = joinText();
    return 'https://github.com/' + r + '/issues/new?labels=' + encodeURIComponent('参画') +
           '&title=' + encodeURIComponent('[参画] 準備ができました（' + t.done + ' / ' + STEPS.length + ' 完了）') +
           '&body=' + encodeURIComponent(t.text);
  }

  function drawJoin() {
    var el = document.getElementById('joinbtn');
    if (!el) return;
    var u = joinUrl();
    var h = '<div class="mapreport"><b>準備ができたことを、担当者に知らせます</b><br>';
    if (u) {
      h += '<span class="mrsub">押すと、<b>いまの到達状況が入力済み</b>の状態で申請の画面が開きます。' +
        '成果物のURLと、自信が無いところを書き足して送ってください。<br>' +
        '<b>全部のステップが終わっていなくても構いません。</b>相談の入口です。</span>' +
        '<a class="mrbtn" href="' + u + '" target="_blank" rel="noopener">参画の相談をする</a>';
    } else {
      h += '<span class="mrsub">押すと、<b>いまの到達状況が文章になってコピー</b>されます。' +
        '成果物のURLと、自信が無いところを書き足して、いつもの方法で送ってください。<br>' +
        '<b>全部のステップが終わっていなくても構いません。</b>相談の入口です。<br>' + contactLine() + '</span>' +
        '<button type="button" class="mrbtn" data-copytext="' + esc(joinText().text) + '">参画の相談をコピー</button>';
    }
    el.innerHTML = h + '</div>';
  }

  // 寄付の案内。config.js に url が書かれていないときは、何も出さない。
  function drawCoffee() {
    var el = document.getElementById('coffee');
    if (!el) return;
    var c = window.TRAINER_COFFEE || {};
    if (!c.url) { el.innerHTML = ''; el.style.display = 'none'; return; }
    el.style.display = '';
    el.innerHTML = '<div class="coffee">' +
      '<img src="media/icon-coffee.svg" width="40" height="40" alt="">' +
      '<div class="ct"><b>この教材は無料です。これからも無料のままです。</b>' +
      '<span class="cs">気に入って、余裕があるときだけで構いません。' +
      '<b>払わなくても、内容は1文字も変わりません。</b></span></div>' +
      '<a class="cbtn" href="' + c.url + '" target="_blank" rel="noopener">' +
      (c.label || '☕ コーヒーを1杯おごる') + '</a>' +
      (c.note ? '<span class="cn">' + c.note + '</span>' : '') +
      '</div>';
  }

  function run() { markRead(); drawMap(); wireChecks(); drawJoin(); drawCoffee(); }
  window.addEventListener('hashchange', function () { setTimeout(run, 300); });
  document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 400); });
  setTimeout(run, 900);
  setTimeout(run, 1800);
})();
