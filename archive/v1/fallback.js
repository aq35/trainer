/* 読み物ページ（docsify）の受け皿。
 *
 * なぜ要るのか:
 *   index.html の読み物ページは、外部のCDN（cdn.jsdelivr.net）から docsify を
 *   読み込んで初めて中身が出る。CDNが落ちる・社内ネットワークで塞がれる・
 *   国や回線によっては届かない——そのとき、25本の読み物が **すべて真っ白** になる。
 *   用語集は全22回の「言葉の意味が分からない」からリンクされているので、
 *   詰まった人の行き先が丸ごと消えることになる。
 *
 *   ここでは docsify を代わりに動かすのではなく、
 *   **md をそのまま取ってきて、読める形にして出す** ことだけをする。
 *   完璧な再現はしない。読めれば目的は果たせる。
 */
(function () {
  var TIMEOUT = 2500;   // docsify が描き終わるのを待つ時間

  function route() {
    var h = (location.hash || '').replace(/^#\/?/, '').split('?')[0];
    if (!h || h === '/') return 'README';
    return h.replace(/\.md$/, '').replace(/[^A-Za-z0-9._/-]/g, '');
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // 行の中身（太字・コード・リンク）。生のHTMLはそのまま通す。
  function inline(s) {
    return String(s)
      .replace(/`([^`]+)`/g, function (_, c) { return '<code>' + esc(c) + '</code>'; })
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, t, u) {
        // 読み物どうしのリンクは docsify の書き方（#/名前）に直す
        if (/^[A-Za-z0-9._-]+\.md$/.test(u)) u = '#/' + u.replace(/\.md$/, '');
        var ext = /^https?:/.test(u) ? ' target="_blank" rel="noopener"' : '';
        return '<a href="' + u + '"' + ext + '>' + t + '</a>';
      });
  }

  function toHtml(md) {
    var out = [], code = null, tbl = null, list = null;

    function closeList() { if (list) { out.push('</' + list + '>'); list = null; } }
    function closeTable() {
      if (tbl) { out.push('</tbody></table>'); tbl = null; }
    }

    var lines = String(md).replace(/\r/g, '').split('\n');
    for (var i = 0; i < lines.length; i++) {
      var L = lines[i];

      // ``` で囲まれたコード
      if (/^\s*```/.test(L)) {
        if (code === null) { closeList(); closeTable(); code = []; }
        else { out.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>'); code = null; }
        continue;
      }
      if (code !== null) { code.push(L); continue; }

      // 表
      var isRow = /^\s*\|.*\|\s*$/.test(L);
      if (isRow) {
        var cells = L.trim().replace(/^\||\|$/g, '').split('|').map(function (c) { return c.trim(); });
        if (/^[\s|:-]+$/.test(L)) continue;                 // 区切り行は捨てる
        if (!tbl) {
          closeList();
          out.push('<table><thead><tr>' + cells.map(function (c) { return '<th>' + inline(c) + '</th>'; }).join('') + '</tr></thead><tbody>');
          tbl = 1;
        } else {
          out.push('<tr>' + cells.map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>');
        }
        continue;
      }
      closeTable();

      if (/^\s*$/.test(L)) { closeList(); continue; }
      if (/^---+\s*$/.test(L)) { closeList(); out.push('<hr>'); continue; }

      var h = L.match(/^(#{1,4})\s+(.*)$/);
      if (h) { closeList(); out.push('<h' + h[1].length + '>' + inline(h[2]) + '</h' + h[1].length + '>'); continue; }

      var ul = L.match(/^\s*[-*]\s+(.*)$/);
      if (ul) {
        if (list !== 'ul') { closeList(); out.push('<ul>'); list = 'ul'; }
        out.push('<li>' + inline(ul[1]) + '</li>'); continue;
      }
      var ol = L.match(/^\s*\d+\.\s+(.*)$/);
      if (ol) {
        if (list !== 'ol') { closeList(); out.push('<ol>'); list = 'ol'; }
        out.push('<li>' + inline(ol[1]) + '</li>'); continue;
      }
      closeList();

      var bq = L.match(/^>\s?(.*)$/);
      if (bq) { out.push('<blockquote>' + inline(bq[1]) + '</blockquote>'); continue; }

      // もともとHTMLで書かれている行は、そのまま
      if (/^\s*<\/?[a-zA-Z]/.test(L)) { out.push(L); continue; }

      out.push('<p>' + inline(L) + '</p>');
    }
    closeList(); closeTable();
    if (code !== null) out.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>');
    return out.join('\n');
  }

  function show(name, body, nav) {
    document.body.innerHTML =
      '<div class="fb-wrap">' +
      '<div class="fb-warn"><b>読み込みに使っている外部のサーバー（CDN）に、いま届いていません。</b><br>' +
      'このページは<b>簡易表示</b>にしています。見た目は崩れますが、<b>中身はすべて読めます</b>。<br>' +
      '<b>研修そのものは、この障害の影響を受けません。</b>各回のナビは<a href="README.md">目次</a>ではなく、' +
      '下の一覧から直接開けます（<a href="setup.html">環境構築</a>から始まります）。</div>' +
      '<div class="fb-body">' + body + '</div>' +
      (nav ? '<hr><div class="fb-nav"><b>ほかの読み物</b>' + nav + '</div>' : '') +
      '</div>';
    document.title = name + ' | エンジニア育成トレーナー';
  }

  var tries = 0;
  function run() {
    // docsify が描けていれば何もしない
    if (document.querySelector('.markdown-section')) return;
    // 本体は届いているのに、まだ描き終わっていないだけ（回線が遅い）なら待ち直す。
    // 待たずに差し替えると、本来は正しく開ける人の画面を壊してしまう。
    if (window.Docsify && tries < 4) { tries++; setTimeout(run, TIMEOUT); return; }

    var css = document.createElement('style');
    css.textContent =
      '.fb-wrap{max-width:820px;margin:0 auto;padding:18px 16px 60px;' +
      'font-family:system-ui,-apple-system,"Hiragino Sans","Noto Sans JP",sans-serif;' +
      'line-height:1.85;color:#1c2431;font-feature-settings:"palt"}' +
      '.fb-warn{background:#fff6e5;border:1px solid #f0cf95;border-radius:10px;padding:13px 15px;' +
      'font-size:14px;margin-bottom:26px}' +
      '.fb-body h1{font-size:26px;margin:1.1em 0 .5em}.fb-body h2{font-size:21px;margin:1.6em 0 .5em;' +
      'border-bottom:1px solid #e3e7ef;padding-bottom:.3em}.fb-body h3{font-size:17px;margin:1.4em 0 .4em}' +
      '.fb-body h4{font-size:15px;margin:1.2em 0 .3em}' +
      '.fb-body p,.fb-body li{font-size:15px}.fb-body img{max-width:100%;height:auto}' +
      '.fb-body pre{background:#22262f;color:#e6eaf2;border-radius:8px;padding:11px 13px;overflow-x:auto}' +
      '.fb-body pre code{font-size:13px;background:none;color:inherit;padding:0}' +
      '.fb-body code{background:#eef1f6;border-radius:4px;padding:1px 5px;font-size:13.5px}' +
      '.fb-body table{border-collapse:collapse;width:100%;display:block;overflow-x:auto;margin:1em 0}' +
      '.fb-body th,.fb-body td{border:1px solid #dfe4ee;padding:7px 10px;font-size:14px;text-align:left}' +
      '.fb-body th{background:#f4f6fa}.fb-body blockquote{border-left:3px solid #c9d3e6;margin:1em 0;' +
      'padding:.2em 0 .2em 14px;color:#4a5468}' +
      '.fb-body hr{border:0;border-top:1px solid #e3e7ef;margin:2em 0}' +
      '.fb-nav a{display:inline-block;margin:6px 10px 0 0;font-size:14px}' +
      'a{color:#2f6fed}';
    document.head.appendChild(css);

    var name = route();
    Promise.all([
      fetch(name + '.md').then(function (r) { return r.ok ? r.text() : Promise.reject(); }),
      fetch('_sidebar.md').then(function (r) { return r.ok ? r.text() : ''; }).catch(function () { return ''; })
    ]).then(function (a) {
      show(name, toHtml(a[0]), a[1] ? toHtml(a[1]) : '');
    }).catch(function () {
      show(name,
        '<h1>ページを開けませんでした</h1>' +
        '<p>ネットワークが不安定なようです。時間をおいて開き直してください。</p>' +
        '<p><b>各回のナビは、この問題の影響を受けません。</b>' +
        '<a href="setup.html">環境構築から始める</a></p>', '');
    });
  }

  if (document.readyState === 'complete') setTimeout(run, TIMEOUT);
  else window.addEventListener('load', function () { setTimeout(run, TIMEOUT); });
})();
