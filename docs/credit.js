/* 全ページ共通の出典表示。
 *
 * この教材は CC BY 4.0（文章・図）で公開しています。条件は「出典を示すこと」だけです。
 * この1行がそのまま、その条件を満たす表示になっています。
 *
 * フォークして自分の研修に使う場合も、<b>この表示は残してください</b>。
 * それが、自由に使ってよい唯一の条件です。
 */
(function () {
  var HOME = 'https://aq35.github.io/trainer/';
  var SRC  = 'https://github.com/aq35/trainer';

  // GitHub Pages が返す Last-Modified（＝最後に公開した日時）を使う。
  // 取れないときは日付を出さない。古いコピーとの区別のために表示している。
  function updated() {
    var d = new Date(document.lastModified);
    if (isNaN(d.getTime())) return '';
    var z = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  }

  function style() {
    var css =
      '.sitecredit{max-width:860px;margin:56px auto 0;padding:16px 20px 30px;' +
      'border-top:1px solid #e1e6f0;font-size:12.5px;line-height:1.9;color:#6b7482;' +
      'text-align:center;font-family:inherit}' +
      '.sitecredit a{color:#2f6fed;text-decoration:none}' +
      '.sitecredit a:hover{text-decoration:underline}' +
      '.sitecredit b{color:#4b5563}' +
      '.sitecredit .cl2{display:block;margin-top:2px;font-size:12px;opacity:.85}' +
      '@media (prefers-color-scheme:dark){' +
      '.sitecredit{border-top-color:#333a48;color:#9aa3b2}' +
      '.sitecredit b{color:#c3c9d4}}';
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  function render() {
    // docsify のページは本文が差し替わるので、本文の中に入れて毎回付け直す。
    // ナビ（単体のHTML）は body の末尾に1回だけ。
    var host = document.querySelector('.markdown-section') || document.body;
    if (host.querySelector(':scope > .sitecredit')) return;
    var old = document.querySelector('.sitecredit');
    if (old && old.parentNode !== host) old.parentNode.removeChild(old);
    var u = updated();
    var f = document.createElement('footer');
    f.className = 'sitecredit';
    f.innerHTML =
      'この教材は<b>無料</b>で公開されています — <a href="' + HOME + '">aq35.github.io/trainer</a>' +
      '<span class="cl2">' +
      (u ? '最終更新 ' + u + '　・　' : '') +
      '<a href="' + SRC + '">ソース</a>　・　' +
      '<a href="' + SRC + '/blob/main/LICENSE-docs.md">MIT / CC BY 4.0</a>' +
      '</span>';
    host.appendChild(f);
  }

  style();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
  window.addEventListener('hashchange', function () { setTimeout(render, 300); });
  setTimeout(render, 900);
  setTimeout(render, 1800);
})();
