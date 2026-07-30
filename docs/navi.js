/* 1画面1操作のナビゲーション エンジン
   ページ側で window.NAVI = { key, steps, common } を定義してから読み込む。 */
(function () {
  var CFG = window.NAVI;
  var STEPS = CFG.steps, COMMON = CFG.common || [];

  var st = { os: null, i: 0 };
  try {
    var sv = JSON.parse(localStorage.getItem(CFG.key) || '{}');
    if (sv && typeof sv.i === 'number') { st.os = sv.os || null; st.i = sv.i; }
  } catch (e) {}
  if (st.i >= STEPS.length) st.i = 0;

  function save() { try { localStorage.setItem(CFG.key, JSON.stringify(st)); } catch (e) {} }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function pick(o) { if (!o) return null; if (o.common) return o.common; return st.os === 'mac' ? o.mac : o.win; }
  function osName() { return st.os === 'mac' ? 'Mac' : 'Windows'; }
  function needsOs() { for (var i = 0; i < STEPS.length; i++) if (STEPS[i].kind === 'os') return true; return false; }

  function toast(m) {
    var t = document.getElementById('toast');
    t.textContent = m; t.classList.add('on');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('on'); }, 1600);
  }

  function cmdBox(text) {
    return '<div class="cmd"><code>' + esc(text) + '</code>' +
           '<button type="button" data-copy="' + esc(text) + '">コピー</button></div>';
  }

  function render() {
    var s = STEPS[st.i], v = document.getElementById('view');
    var total = STEPS.length - 1;
    document.getElementById('bar').style.width = Math.round(st.i / total * 100) + '%';
    // OS選択がある構成では step1 が index 1。無い構成では index 0 が1ステップ目。
    var shown = needsOs() ? st.i : st.i + 1;
    var last  = needsOs() ? total - 1 : total;
    document.getElementById('counter').textContent =
      (s.kind === 'fin') ? '完了' : (s.kind === 'os' ? '' : shown + ' / ' + last);
    window.scrollTo(0, 0);

    if (s.kind === 'os') {
      v.innerHTML = '<div class="card"><span class="phase">' + s.phase + '</span>' +
        '<h2>' + s.title + '</h2><p class="why">' + s.why + '</p>' +
        '<div class="oschoice">' +
        '<button type="button" data-os="win">Windows</button>' +
        '<button type="button" data-os="mac">Mac</button></div>' +
        '<div class="note" style="margin-top:18px">どちらか分からないときは、サポート役に「これはWindowsですか？Macですか？」と聞いてください。恥ずかしいことではありません。</div>' +
        '</div>';
      return;
    }

    if (s.kind === 'fin') {
      v.innerHTML = '<div class="card"><div class="done"><div class="big">' + (s.emoji || '🎉') + '</div>' +
        '<h2 style="margin-top:10px">' + s.title + '</h2>' +
        '<p class="why">' + s.lead + '</p></div>' +
        (s.gained ? '<div class="expect"><div class="t">できるようになったこと</div><div class="m">' + s.gained + '</div></div>' : '') +
        (s.note ? '<div class="note">' + s.note + '</div>' : '') +
        '<div class="ask"><p>次にやること</p><div class="btns">' +
        '<a class="act ok" style="text-decoration:none;text-align:center" href="' + s.nextHref + '">' + s.nextLabel + '</a>' +
        '</div></div>' +
        '<div class="foot"><button class="link" data-go="-1">前に戻る</button>' +
        '<button class="link" data-reset="1">最初からやり直す</button></div></div>';
      return;
    }

    var h = '<div class="card"><span class="phase">' + s.phase + '</span><h2>' + s.title + '</h2>' +
            '<p class="why">' + s.why + '</p>';

    var list = pick(s.todo);
    if (list) { h += '<ol class="todo">'; for (var i = 0; i < list.length; i++) h += '<li>' + list[i] + '</li>'; h += '</ol>'; }

    if (s.visual)  h += '<img class="shot" src="' + s.visual + '" alt="">';
    if (s.visual2) h += '<img class="shot" src="' + s.visual2 + '" alt="">';

    if (s.cmd) h += '<p style="font-size:14px;margin:16px 0 0"><b>' + (s.cmdlabel || '') + '</b></p>' + cmdBox(s.cmd);
    var multi = pick(s.cmdMulti);
    if (multi) for (var j = 0; j < multi.length; j++) h += cmdBox(multi[j]);

    if (s.expect) h += '<div class="expect"><div class="t">こうなれば成功です</div><div class="m">' + s.expect + '</div></div>';
    if (s.note)   h += '<div class="note">' + s.note + '</div>';

    h += '<div class="ask"><p>' + s.ask + '</p><div class="btns">' +
         '<button type="button" class="act ok" data-go="1">できました → 次へ</button>' +
         '<button type="button" class="act ng" data-help="1">うまくいきません</button>' +
         '</div><div id="help"></div></div>';

    h += '<div class="foot"><button class="link" data-go="-1">前に戻る</button>' +
         '<button class="link" data-reset="1">最初からやり直す</button></div></div>';

    v.innerHTML = h;
  }

  function showHelp() {
    var s = STEPS[st.i], box = document.getElementById('help');
    if (!box || box.innerHTML) { if (box) box.innerHTML = ''; return; }
    var own = s.tb || [], seen = {}, all = own.slice();
    for (var k = 0; k < own.length; k++) seen[own[k].q] = 1;
    for (var c = 0; c < COMMON.length; c++) if (!seen[COMMON[c].q]) all.push(COMMON[c]);

    var h = '<div class="help"><h3>大丈夫です。よくあることです。</h3>' +
            '<p class="lead">近いものを開いてみてください。当てはまらなければ、いちばん下の方法で聞いてください。</p>';
    for (var i = 0; i < all.length; i++) {
      h += '<details class="tb"><summary>' + all[i].q + '</summary><div class="a">' + all[i].a + '</div></details>';
    }
    h += '<div class="esc"><b>それでも解決しないとき</b><br>' +
         '15分たっても進まなければ、そこで止めてサポート役に連絡してください。' +
         '下のボタンを押すと、今の状況の文章がコピーされます。そのまま貼り付けて送ってください。' +
         '<div style="margin-top:10px"><button type="button" class="act ng" data-report="1">今の状況をコピーする</button></div></div></div>';
    box.innerHTML = h;
  }

  function report() {
    var s = STEPS[st.i];
    var t = '【' + (document.title.split('|')[0].trim()) + 'でつまずきました】\n' +
            (needsOs() ? '・パソコン: ' + osName() + '\n' : '') +
            '・止まった場所: ' + st.i + 'ステップ目「' + s.title + '」\n' +
            '・できなかったこと: ' + s.ask + '\n' +
            '・画面に出ているメッセージ:（ここに貼ってください）';
    copy(t, '状況をコピーしました。サポート役に貼り付けて送ってください。');
  }

  function copy(text, msg) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast(msg || 'コピーしました'); }
      catch (e) { toast('コピーできませんでした'); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast(msg || 'コピーしました'); }, fallback);
    } else fallback();
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    if (t.dataset.os) { st.os = t.dataset.os; st.i = 1; save(); render(); return; }
    if (t.dataset.go) {
      var n = st.i + parseInt(t.dataset.go, 10);
      if (n < 0) n = 0;
      if (n > STEPS.length - 1) n = STEPS.length - 1;
      st.i = n; save(); render(); return;
    }
    if (t.dataset.help) { showHelp(); return; }
    if (t.dataset.report) { report(); return; }
    if (t.dataset.copy !== undefined) { copy(t.dataset.copy); return; }
    if (t.dataset.reset) {
      if (confirm('最初からやり直しますか？')) { st = { os: null, i: 0 }; save(); render(); }
      return;
    }
  });

  if (st.i > 0 && needsOs() && !st.os) st.i = 0;
  render();
})();
