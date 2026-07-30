/* 目次ページの「全体地図」と、Step 2 のチェックリストを担当する。
   進捗は各ナビと同じ localStorage を読むだけで、書き換えはしない。 */
(function () {
  var STEPS = [
    { key: 'trainer-setup-v1',  total: 9, label: '環境構築',      href: 'setup.html',  icon: 'icon-vscode.svg' },
    { key: null,                          label: 'git の基本',    href: '#/step2-git', icon: 'icon-git.svg', check: 'step2' },
    { key: 'trainer-github-v1', total: 8, label: 'GitHubに上げる', href: 'github.html', icon: 'icon-github.svg' },
    { key: 'trainer-diff-v1',   total: 6, label: '差分を読む',     href: 'diff.html',   icon: 'icon-terminal.svg' },
    { key: 'trainer-ai-v1',     total: 7, label: 'AIと一緒に',     href: 'ai.html',     icon: 'icon-ai.svg' },
    { key: 'trainer-code-v1',   total: 9, label: 'はじめてのプログラム', href: 'code.html',   icon: 'icon-vscode.svg' },
    { key: 'trainer-branch-v1', total: 7, label: 'ブランチと安全な進め方', href: 'branch.html', icon: 'icon-git.svg' }
  ];

  function read(k) {
    try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch (e) { return {}; }
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

  function drawMap() {
    var el = document.getElementById('map');
    if (!el) return;
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
    });
    h += '</div>';
    var all = STEPS.every(function (s) { return state(s).pct >= 100; });
    if (all) h += '<div class="mapall">全部おつかれさまでした。ここまでできれば、案件に入る準備はできています。</div>';
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

  function run() { drawMap(); wireChecks(); }
  window.addEventListener('hashchange', function () { setTimeout(run, 300); });
  document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 400); });
  setTimeout(run, 900);
  setTimeout(run, 1800);
})();
