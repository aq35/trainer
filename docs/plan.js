/* 「案件まで◯週間」から、学習計画をAIに作らせるための道具。
 * 計画そのものはAIが作ります。ここがやるのは、
 *   ① 残り時間を数える  ② 良い頼み方の文章を組み立てる
 * の2つだけです。 */
(function () {
  var FIELDS = {
    front: { label: 'Webのフロント（画面）', add: 'CSS / React などの画面まわりの道具' },
    back:  { label: 'Webのバックエンド（裏側）', add: 'サーバーの言語（Go / Python / TypeScript など）と SQL' },
    data:  { label: 'データ（集計・分析）', add: 'SQL、表計算、可視化、扱う分野の知識' },
    infra: { label: 'インフラ・クラウド', add: 'AWS などのクラウド、Linux の操作' },
    qa:    { label: '品質・テスト', add: 'テストの設計と、自動テストの書き方' },
    unknown: { label: 'まだ決まっていない', add: '（決まっていないので、共通の土台を厚くします）' }
  };

  var LEVELS = {
    mid:   '研修の途中（環境構築やgitのあたり）',
    nine:  '研修の8ステップ目まで終わった（公開まで済んだ）',
    work:  '「仕事の一周」まで終わった（他人のコードを直した）',
    theme: '「自分のテーマで回す」まで終わった'
  };

  var HOURS = { 3: '週3時間（平日30分くらい）', 7: '週7時間（1日1時間）', 14: '週14時間（1日2時間）', 25: '週25時間以上（ほぼ専念）' };

  function css() {
    if (document.getElementById('plancss')) return;
    var s = document.createElement('style');
    s.id = 'plancss';
    s.textContent =
      '.planner{background:#f7f9fc;border:1px solid #e1e6f0;border-radius:12px;padding:18px 20px;margin:1.4em 0}' +
      '.planner .row{display:grid;grid-template-columns:150px 1fr;gap:12px;align-items:center;margin-bottom:12px}' +
      '.planner label{font-size:13.5px;font-weight:700;color:#4b5563}' +
      '.planner select,.planner input,.planner textarea{font:inherit;font-size:14px;padding:9px 11px;' +
      'border:1px solid #c8cfdb;border-radius:8px;background:#fff;color:#1b2330;width:100%}' +
      '.planner textarea{min-height:88px;resize:vertical}' +
      '.planner .weeks{margin:16px 0 0}' +
      '.planner .wk{display:grid;grid-template-columns:78px 1fr;gap:12px;padding:9px 0;border-top:1px dashed #dde4f0;font-size:13.5px}' +
      '.planner .wk b{color:#2f6fed}' +
      '.planner .sum{background:#eef3ff;border:1px solid #c9dbff;border-radius:9px;padding:11px 14px;font-size:14px;margin-top:14px}' +
      '.planner .btns{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}' +
      '.planner button{font:inherit;font-weight:700;font-size:14px;border:0;border-radius:9px;padding:12px 18px;cursor:pointer}' +
      '.planner .main{background:#2f6fed;color:#fff}.planner .main:hover{background:#245ad0}' +
      '.planner .sub{background:#fff;color:#2f6fed;border:2px solid #c9dbff}.planner .sub:hover{border-color:#2f6fed}' +
      '.planner .warn{background:#fff5f7;border:1px solid #f6cdd8;border-radius:9px;padding:11px 14px;font-size:13px;margin-top:14px}' +
      '.plantoast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#1b2330;color:#fff;' +
      'padding:11px 20px;border-radius:9px;font-size:14px;opacity:0;transition:opacity .2s;pointer-events:none;z-index:99}' +
      '.plantoast.on{opacity:1}' +
      '@media (max-width:560px){.planner .row{grid-template-columns:1fr}}' +
      '@media (prefers-color-scheme:dark){' +
      '.planner{background:#1b1f27;border-color:#333a48}' +
      '.planner label{color:#c3c9d4}' +
      '.planner select,.planner input,.planner textarea{background:#232833;color:#e6e9ef;border-color:#3a4351}' +
      '.planner .sum{background:#1b2437;border-color:#31456b}' +
      '.planner .warn{background:#2c1b22;border-color:#5c3040}' +
      '.planner .sub{background:#232833}}';
    document.head.appendChild(s);
  }

  function toast(msg) {
    var t = document.querySelector('.plantoast');
    if (!t) { t = document.createElement('div'); t.className = 'plantoast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('on');
    setTimeout(function () { t.classList.remove('on'); }, 2200);
  }

  function copy(text) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('コピーしました。AIに貼ってください'); }
      catch (e) { toast('コピーできませんでした'); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast('コピーしました。AIに貼ってください'); }, fallback);
    } else fallback();
  }

  function weeksLeft(dateStr) {
    if (!dateStr) return null;
    var start = new Date(dateStr + 'T00:00:00');
    if (isNaN(start.getTime())) return null;
    var now = new Date(); now.setHours(0, 0, 0, 0);
    var days = Math.ceil((start - now) / 86400000);
    return { days: days, weeks: Math.max(0, Math.ceil(days / 7)) };
  }

  // 残り週数から、ざっくりの配分を決める（AIに渡す「たたき台」）
  function shape(weeks, level) {
    if (weeks <= 0) return [];
    var done = level === 'theme' || level === 'work';
    var plan = [];
    var base = done ? 0 : Math.min(weeks - 1, Math.max(1, Math.round(weeks * 0.4)));
    for (var i = 1; i <= weeks; i++) {
      if (i <= base) plan.push({ w: i, t: '土台を終わらせる', d: '研修の残りのステップを進める（ここを飛ばすと後が効かない）' });
      else if (i === weeks) plan.push({ w: i, t: '仕上げ・調整', d: '詰まったところの復習と、初日に聞くことの整理' });
      else if (i === weeks - 1) plan.push({ w: i, t: '案件に寄せる', d: '案件で使う技術で、小さいものを1つ作って動かす' });
      else plan.push({ w: i, t: '上乗せを1つずつ', d: '案件で使う道具を、手を動かしながら1つずつ' });
    }
    return plan;
  }

  function prompt(v) {
    var f = FIELDS[v.field] || FIELDS.unknown;
    var w = v.left ? v.left.weeks : 0;
    var L = [];
    L.push('あなたは、未経験からエンジニアを目指す私の学習コーチです。');
    L.push('現実的で、実行できる学習計画を作ってください。');
    L.push('');
    L.push('# 私の状況');
    L.push('- 参加する案件の開始まで: あと ' + (v.left ? v.left.days + '日（約' + w + '週間）' : '未定'));
    L.push('- 学習にあてられる時間: ' + (HOURS[v.hours] || v.hours));
    L.push('- いまの到達度: ' + (LEVELS[v.level] || v.level));
    L.push('- 目指す方向: ' + f.label);
    L.push('- すでにできること: git（commit / branch / merge / コンフリクト解決）、GitHub（clone / PR / レビューを受ける）、');
    L.push('  HTMLとJavaScriptで小さいものを作って公開、開発者ツールでのエラー調査、AIと組んだ開発（差分を読んで採否を判断する）');
    L.push('');
    if (v.desc && v.desc.trim()) {
      L.push('# 案件の内容（分かっている範囲）');
      L.push(v.desc.trim());
      L.push('');
    }
    L.push('# 作ってほしいもの');
    L.push('1. **週ごとの計画**（' + (w || 'N') + '週間ぶん）。各週について次を書いてください。');
    L.push('   - その週のゴール（1つだけ。欲張らない）');
    L.push('   - 具体的にやること（手を動かす作業。読むだけの項目は入れない）');
    L.push('   - 終わったと判断する方法（何が動けばOKか）');
    L.push('2. **最初の1つ**。明日いちばん最初に着手する作業を、1つだけ具体的に。');
    L.push('3. **捨てるもの**。この期間では手を出さないほうがよいものと、その理由。');
    L.push('4. **初日に聞くこと**。案件の初日に確認すべきことのリスト。');
    L.push('');
    L.push('# 条件');
    L.push('- 私は初心者です。専門用語には短い説明を付けてください。');
    L.push('- **本や動画を「見る」だけの計画にしないでください。** 毎週、手元で動くものが1つ増える形にしてください。');
    L.push('- 使えるのは上に書いた時間だけです。**詰め込みすぎないでください。** 守れない計画は意味がありません。');
    L.push('- 私はAIと一緒に作業します。「AIにこう頼む」という具体例も添えてください。');
    L.push('- 分からない前提があれば、計画を作る前に質問してください。');
    return L.join('\n');
  }

  function weeklyPrompt() {
    return [
      'いまの学習計画について、今週の振り返りをします。',
      '',
      '# 今週やったこと',
      '（ここに書く。できなかったことも正直に書く）',
      '',
      '# 詰まったこと',
      '（ここに書く）',
      '',
      '# お願い',
      '1. 進み具合を見て、来週の計画を調整してください。遅れていれば、**減らす方向で**調整してください。',
      '2. 詰まったところについて、次にとるべき手を1つだけ教えてください。',
      '3. このペースで、案件の開始までに間に合いそうか、正直に評価してください。',
      '   間に合わない場合は、**何を捨てるべきか**を教えてください。'
    ].join('\n');
  }

  function render() {
    var el = document.getElementById('planner');
    if (!el) return;
    if (el.dataset.ready === '1') return;
    el.dataset.ready = '1';
    css();

    var opts = function (o, sel) {
      return Object.keys(o).map(function (k) {
        var label = typeof o[k] === 'string' ? o[k] : o[k].label;
        return '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>' + label + '</option>';
      }).join('');
    };

    el.innerHTML =
      '<div class="planner">' +
      '<div class="row"><label for="p-date">案件が始まる日</label>' +
      '<input type="date" id="p-date"></div>' +
      '<div class="row"><label for="p-hours">週にとれる時間</label>' +
      '<select id="p-hours">' + opts(HOURS, '7') + '</select></div>' +
      '<div class="row"><label for="p-level">いまの到達度</label>' +
      '<select id="p-level">' + opts(LEVELS, 'nine') + '</select></div>' +
      '<div class="row"><label for="p-field">目指す方向</label>' +
      '<select id="p-field">' + opts(FIELDS, 'unknown') + '</select></div>' +
      '<div class="row"><label for="p-desc">案件の内容<br><span style="font-weight:400;font-size:12px;color:#6b7482">分かる範囲で。空でも作れます</span></label>' +
      '<textarea id="p-desc" placeholder="例: 社内で使う勤怠のWebシステムの改修。フロントは React、裏は Java。人数は5人くらい。"></textarea></div>' +
      '<div class="warn">⚠️ <b>案件の資料をそのまま貼らないでください。</b>会社名・顧客名・個人名は消し、' +
      '<b>「貼ってよいか」を担当者に確認</b>してから使ってください。分野と規模だけでも、計画は作れます。</div>' +
      '<div id="p-out"></div>' +
      '<div class="btns">' +
      '<button type="button" class="main" id="p-copy">AIに渡す文章をコピー</button>' +
      '<button type="button" class="sub" id="p-week">毎週の振り返り用をコピー</button>' +
      '</div></div>';

    var get = function (id) { return document.getElementById(id); };
    var state = function () {
      var d = get('p-date').value;
      return {
        date: d, left: weeksLeft(d),
        hours: get('p-hours').value, level: get('p-level').value,
        field: get('p-field').value, desc: get('p-desc').value
      };
    };

    function draw() {
      var v = state(), out = get('p-out');
      if (!v.left) { out.innerHTML = ''; return; }
      if (v.left.days < 0) {
        out.innerHTML = '<div class="sum">その日はもう過ぎています。<b>今日からの計画</b>を作るなら、日付を先の日に変えてください。</div>';
        return;
      }
      var plan = shape(v.left.weeks, v.level);
      var h = '<div class="sum"><b>開始まで ' + v.left.days + '日（約' + v.left.weeks + '週間）。' +
              '使える時間は合計およそ ' + (v.left.weeks * Number(v.hours)) + '時間です。</b><br>' +
              '<span style="font-size:13px;color:#6b7482">下は、ざっくりの配分です。' +
              '<b>細かい中身はAIに作ってもらいます。</b></span></div><div class="weeks">';
      plan.forEach(function (p) {
        h += '<div class="wk"><b>' + p.w + '週目</b><span><b>' + p.t + '</b><br>' +
             '<span style="color:#6b7482;font-size:12.5px">' + p.d + '</span></span></div>';
      });
      h += '</div>';
      out.innerHTML = h;
    }

    ['p-date', 'p-hours', 'p-level', 'p-field'].forEach(function (id) {
      get(id).addEventListener('change', draw);
    });
    get('p-copy').addEventListener('click', function () { copy(prompt(state())); });
    get('p-week').addEventListener('click', function () { copy(weeklyPrompt()); });
    draw();
  }

  function run() { var el = document.getElementById('planner'); if (el && el.dataset.ready !== '1') render(); }
  window.addEventListener('hashchange', function () { setTimeout(run, 300); });
  document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 400); });
  setTimeout(run, 900);
  setTimeout(run, 1800);
})();
