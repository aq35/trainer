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

  // 到達度。key は、その段まで終わっている状態を表す。
  //   need … 案件に入る前に、最低限やっておきたい残り時間の目安
  //   can  … その段までで「できるようになっていること」（AIに渡す前提。積み上げ式）
  var LEVELS = {
    early: {
      label: '1〜8 の途中（環境構築・git のあたり）', need: 34,
      can: ['VS Code とターミナルが使える', 'git で記録を残し、壊しても戻せる']
    },
    base: {
      label: '8 まで終わった（自分のページを公開した）', need: 22,
      can: ['GitHub に上げて、ブランチとコンフリクトを扱える',
            'HTML と JavaScript で小さいものを作って公開できる',
            '差分を読んで、AIの提案を採るか断るか自分で決められる']
    },
    work: {
      label: '9「仕事の一周」まで終わった（他人のコードを直した）', need: 14,
      can: ['他人のリポジトリを clone して、既存コードから直す場所を見つけられる',
            'あいまいな依頼に、着手前に質問できる',
            'プルリクエストを説明付きで出し、自動チェックの指摘を読んで直せる',
            'テストを自分で書き、それに守られてコードを整理できる']
    },
    theme: {
      label: '11「AIと回す開発の一周」まで終わった', need: 9,
      can: ['自分で決めたテーマを、AIと組んで一周させられる',
            'あいまいな依頼から要件を聞き出し、受け入れ条件を先に決められる',
            '作業を30分単位に割って、工数を見積もれる']
    },
    trained: {
      label: '16「修行」まで終わった（レビュー・切り分け・報連相）', need: 5,
      can: ['他人のコードをレビューして、伝わる書き方で指摘できる',
            '曖昧な不具合報告から、自分で再現して原因を切り分けられる',
            '知らない大きさのコードに、読まずに探して入れる',
            '15分で止まって、伝わる形で相談できる']
    },
    full: {
      label: '21 まで終わった（ほぼ全部）', need: 0,
      can: ['「動くけど遅い」を測って直し、改善を数字で説明できる',
            '繰り返す作業を、テスト付きの道具に変えられる',
            'Console と Network で、フロント側かサーバー側かを切り分けられる']
    }
  };
  var LEVEL_ORDER = ['early', 'base', 'work', 'theme', 'trained', 'full'];

  var HOURS = { 3: '週3時間（平日30分くらい）', 7: '週7時間（1日1時間）', 14: '週14時間（1日2時間）', 25: '週25時間以上（ほぼ専念）' };

  var SAVE_KEY = 'trainer-plan-v1';

  function readLS(k) {
    try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch (e) { return {}; }
  }

  // 研修の進捗（各ナビが localStorage に残しているもの）から、到達度を推定する。
  // 手で選び直せるので、あくまで初期値。
  function guessLevel() {
    var done = function (key, total) {
      var v = readLS(key);
      return typeof v.i === 'number' && v.i >= total;
    };
    if (done('trainer-api-v1', 8) && done('trainer-perf-v1', 9)) return 'full';
    if (done('trainer-mcp-v1', 8) || done('trainer-ask-v1', 7)) return 'trained';
    if (done('trainer-aidlc-v1', 12)) return 'theme';
    if (done('trainer-work-v1', 15)) return 'work';
    if (done('trainer-publish-v1', 8)) return 'base';
    return 'early';
  }

  // その到達度までに積み上がっている「できること」を、全部つなげて返す
  function canList(level) {
    var out = [];
    for (var i = 0; i < LEVEL_ORDER.length; i++) {
      out = out.concat(LEVELS[LEVEL_ORDER[i]].can);
      if (LEVEL_ORDER[i] === level) break;
    }
    return out;
  }

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

  // 残り週数と到達度から、ざっくりの配分を決める（AIに渡す「たたき台」）
  function shape(weeks, level) {
    if (weeks <= 0) return [];
    var idx = LEVEL_ORDER.indexOf(level);
    var plan = [];
    // 研修が残っているほど、前半を「土台」に厚く割く
    var baseRatio = [0.6, 0.45, 0.3, 0.2, 0.1, 0][idx < 0 ? 0 : idx];
    var base = Math.min(weeks - 1, Math.round(weeks * baseRatio));
    if (base < 0) base = 0;
    for (var i = 1; i <= weeks; i++) {
      if (i <= base) {
        plan.push({ w: i, t: '土台を終わらせる',
          d: '研修の残りのステップを進める。ここを飛ばすと、あとが全部効かなくなります' });
      } else if (i === weeks) {
        plan.push({ w: i, t: '仕上げ・調整',
          d: '弱いところの復習と、初日に聞くことの整理。新しいことは始めない' });
      } else if (i === weeks - 1 && weeks >= 3) {
        plan.push({ w: i, t: '案件に寄せる',
          d: '案件で使う技術で、小さいものを1つ作って動かす（読むだけにしない）' });
      } else {
        plan.push({ w: i, t: '上乗せを1つずつ',
          d: '案件で使う道具を、手を動かしながら1つずつ。同時に2つ始めない' });
      }
    }
    return plan;
  }

  // 時間が足りているか、正直に見る
  function reality(v) {
    if (!v.left || v.left.days < 0) return null;
    var total = v.left.weeks * Number(v.hours);
    var need = (LEVELS[v.level] || LEVELS.early).need;
    if (need === 0) return { ok: true, total: total, need: need };
    if (total >= need * 1.6) return { ok: true, total: total, need: need };
    if (total >= need) return { ok: true, tight: true, total: total, need: need };
    return { ok: false, total: total, need: need };
  }

  function prompt(v) {
    var f = FIELDS[v.field] || FIELDS.unknown;
    var w = v.left ? v.left.weeks : 0;
    var r = reality(v);
    var L = [];
    L.push('あなたは、未経験からエンジニアを目指す私の学習コーチです。');
    L.push('現実的で、実行できる学習計画を作ってください。');
    L.push('');
    L.push('# 私の状況');
    L.push('- 参加する案件の開始まで: ' + (v.left ? 'あと ' + v.left.days + '日（約' + w + '週間）' : '未定'));
    L.push('- 学習にあてられる時間: ' + (HOURS[v.hours] || v.hours) +
           (v.left ? '（この期間で合計およそ ' + (w * Number(v.hours)) + '時間）' : ''));
    L.push('- いまの到達度: ' + ((LEVELS[v.level] || {}).label || v.level));
    L.push('- 目指す方向: ' + f.label);
    L.push('');
    L.push('# すでにできること');
    canList(v.level).forEach(function (c) { L.push('- ' + c); });
    L.push('');
    L.push('（上に書いていないことは、まだできません。**できる前提で計画を立てないでください。**）');
    L.push('');
    if (v.weak && v.weak.trim()) {
      L.push('# まだ自信が無いところ');
      L.push(v.weak.trim());
      L.push('');
      L.push('（**ここを埋めることを、計画の中心にしてください。**）');
      L.push('');
    }
    if (v.desc && v.desc.trim()) {
      L.push('# 案件の内容（分かっている範囲）');
      L.push(v.desc.trim());
      L.push('');
    }
    if (r && !r.ok) {
      L.push('# 時間が足りていません');
      L.push('使える時間は約' + r.total + '時間ですが、私の到達度からすると' + r.need + '時間ほど欲しい状況です。');
      L.push('**足りない前提で、何を捨てるかを先に決めた計画にしてください。**');
      L.push('全部やろうとする計画は作らないでください。');
      L.push('');
    } else if (r && r.tight) {
      L.push('# 時間に余裕がありません');
      L.push('使える時間は約' + r.total + '時間で、ぎりぎりです。**詰め込まず、優先順位をはっきりさせてください。**');
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
    L.push('5. **危ないサイン**。「この計画が崩れ始めている」と判断できる目印を3つ。');
    L.push('');
    L.push('# 条件');
    L.push('- 私は初心者です。専門用語には短い説明を付けてください。');
    L.push('- **本や動画を「見る」だけの計画にしないでください。** 毎週、手元で動くものが1つ増える形にしてください。');
    L.push('- 使えるのは上に書いた時間だけです。**詰め込みすぎないでください。** 守れない計画は意味がありません。');
    L.push('- **休む日を計画に入れてください。** 毎日やる前提の計画は、必ず折れます。');
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
      '<div class="row"><label for="p-weak">まだ自信が無いところ<br><span style="font-weight:400;font-size:12px;color:#6b7482">' +
      '<a href="#/graduation">最終チェック</a>の「できていない項目をコピー」から貼れます</span></label>' +
      '<textarea id="p-weak" placeholder="例: エラーが出ない不具合を切り分けられる／作業前に git pull する習慣がある"></textarea></div>' +
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

    // 前回の入力を戻す。無ければ、研修の進捗から到達度を推定して入れておく
    var saved = readLS(SAVE_KEY);
    get('p-level').value = saved.level || guessLevel();
    if (saved.date) get('p-date').value = saved.date;
    if (saved.hours) get('p-hours').value = saved.hours;
    if (saved.field) get('p-field').value = saved.field;
    if (saved.desc) get('p-desc').value = saved.desc;
    if (saved.weak) get('p-weak').value = saved.weak;

    var state = function () {
      var d = get('p-date').value;
      return {
        date: d, left: weeksLeft(d),
        hours: get('p-hours').value, level: get('p-level').value,
        field: get('p-field').value, desc: get('p-desc').value,
        weak: get('p-weak').value
      };
    };

    function draw() {
      var v = state(), out = get('p-out');
      if (!v.left) {
        out.innerHTML = '<div class="sum">日付を入れると、<b>残り時間と週ごとの配分</b>が出ます。<br>' +
          '<span style="font-size:13px;color:#6b7482">まだ決まっていない場合は、<b>仮の日付（1か月後など）</b>で構いません。' +
          '入れなくても、下のボタンから文章はコピーできます。</span></div>';
        return;
      }
      if (v.left.days < 0) {
        out.innerHTML = '<div class="sum">その日はもう過ぎています。<b>今日からの計画</b>を作るなら、日付を先の日に変えてください。<br>' +
          '<span style="font-size:13px;color:#6b7482">すでに案件が始まっている人は、<b>次の区切りの日</b>（1か月後の目標日など）を入れてください。</span></div>';
        return;
      }
      var plan = shape(v.left.weeks, v.level);
      var r = reality(v);
      var h = '<div class="sum"><b>開始まで ' + v.left.days + '日（約' + v.left.weeks + '週間）。' +
              '使える時間は合計およそ ' + (v.left.weeks * Number(v.hours)) + '時間です。</b><br>' +
              '<span style="font-size:13px;color:#6b7482">下は、ざっくりの配分です。' +
              '<b>細かい中身はAIに作ってもらいます。</b></span></div>';
      if (r && !r.ok) {
        h += '<div class="warn">⏳ <b>正直に言うと、時間が足りません。</b>いまの到達度だと、' +
             '案件までに <b>' + r.need + '時間ほど</b>欲しいところ、使えるのは <b>約' + r.total + '時間</b>です。<br>' +
             '<b>それでも大丈夫です。</b>やることを増やすのではなく、<b>何を捨てるかを先に決める</b>のが正解です。' +
             'コピーする文章には、その指示が自動で入ります。</div>';
      } else if (r && r.tight) {
        h += '<div class="warn">⚠️ <b>ぎりぎりです。</b>約' + r.total + '時間あり、必要量には届いていますが余裕はありません。' +
             '<b>同時に2つ始めないこと。</b>これだけ守ってください。</div>';
      }
      h += '<div class="weeks">';
      plan.forEach(function (p) {
        h += '<div class="wk"><b>' + p.w + '週目</b><span><b>' + p.t + '</b><br>' +
             '<span style="color:#6b7482;font-size:12.5px">' + p.d + '</span></span></div>';
      });
      h += '</div>';
      out.innerHTML = h;
    }

    function save() {
      var v = state();
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify({
          date: v.date, hours: v.hours, level: v.level,
          field: v.field, desc: v.desc, weak: v.weak
        }));
      } catch (e) {}
    }

    ['p-date', 'p-hours', 'p-level', 'p-field'].forEach(function (id) {
      get(id).addEventListener('change', function () { save(); draw(); });
    });
    ['p-desc', 'p-weak'].forEach(function (id) {
      get(id).addEventListener('input', save);
    });
    get('p-copy').addEventListener('click', function () { save(); copy(prompt(state())); });
    get('p-week').addEventListener('click', function () { copy(weeklyPrompt()); });
    draw();
  }

  function run() { var el = document.getElementById('planner'); if (el && el.dataset.ready !== '1') render(); }
  window.addEventListener('hashchange', function () { setTimeout(run, 300); });
  document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 400); });
  setTimeout(run, 900);
  setTimeout(run, 1800);
})();
