/* コマンド練習ドリル。出題 → 回答 → 解説 を繰り返す。
   成績は localStorage に保存し、間違えた問題だけをもう一度出せる。 */
(function () {
  var KEY = 'trainer-drill-v1';

  var Q = [
    // --- 場所を動く ---
    { cat:'move', type:'choice', scene:'今どこにいるか分からなくなりました。',
      ask:'現在地を表示するには？',
      choices:['pwd（Macの場合）／cd（Windowsの場合）', 'ls', 'cd ..', 'mkdir'],
      answer:0, why:'Mac は pwd、Windows は cd だけを打つと現在地が出ます。迷ったらまずこれです。' },

    { cat:'move', type:'choice', scene:'今いるフォルダに何が入っているか見たい。',
      ask:'中身を一覧表示するには？',
      choices:['ls（Mac）／dir（Windows）', 'cd', 'git status', 'open'],
      answer:0, why:'フォルダをダブルクリックして中を見るのと同じ操作です。' },

    { cat:'move', type:'input', scene:'Desktop フォルダの中に入りたい。',
      ask:'打つコマンドは？（フォルダ名は Desktop）',
      expect:['cd desktop'], why:'cd は change directory の略。「そのフォルダに入る」という意味です。' },

    { cat:'move', type:'input', scene:'1つ上のフォルダに戻りたい。',
      ask:'打つコマンドは？',
      expect:['cd ..'], why:'点を2つで「1つ上」。Windows も Mac も同じです。' },

    { cat:'move', type:'input', scene:'practice という名前のフォルダを新しく作りたい。',
      ask:'打つコマンドは？',
      expect:['mkdir practice'], why:'mkdir は make directory の略。「作って」＋「何を」の形です。' },

    // --- git の基本 ---
    { cat:'git', type:'input', scene:'今どのファイルを変更したか確認したい。',
      ask:'打つコマンドは？',
      expect:['git status'], why:'迷ったら git status。今の状況を教えてくれる、いちばん使うコマンドです。' },

    { cat:'git', type:'choice', scene:'index.html を直しました。これを記録に残したい。',
      ask:'正しい順番はどれ？',
      choices:['git add → git commit', 'git commit → git add', 'git log → git commit', 'git restore → git add'],
      answer:0, why:'add で「記録するものを台に載せ」、commit で「シャッターを切る」。この順番です。' },

    { cat:'git', type:'input', scene:'index.html を、記録する対象に加えたい。',
      ask:'打つコマンドは？（ファイル名を指定して）',
      expect:['git add index.html'], why:'ステージ（台）に載せる操作です。まだ記録はされていません。' },

    { cat:'git', type:'input', scene:'「文章を直した」という説明を付けて記録したい。',
      ask:'打つコマンドは？（-m を使って）',
      expect:['git commit -m "文章を直した"', "git commit -m '文章を直した'"],
      why:'-m の後ろに説明を書きます。引用符で囲むのを忘れがちです。' },

    { cat:'git', type:'input', scene:'これまでの記録を一覧で見たい。',
      ask:'1行ずつ短く表示するコマンドは？',
      expect:['git log --oneline'], why:'--oneline を付けると1件1行になり、ぐっと読みやすくなります。' },

    { cat:'git', type:'input', scene:'変更したところだけを文字で確認したい。',
      ask:'打つコマンドは？',
      expect:['git diff'], why:'緑の + が増えた行、赤の − が消えた行です。' },

    { cat:'git', type:'choice', scene:'ファイルをぐちゃぐちゃにしてしまいました。最後の commit の状態に戻したい。',
      ask:'すべてのファイルを戻すには？',
      choices:['git restore .', 'git delete', 'git reset --hard origin', 'git log'],
      answer:0, why:'「.」は「全部」の意味。1つだけなら git restore ファイル名 です。' },

    { cat:'git', type:'choice', scene:'commit していない変更があります。',
      ask:'git restore . を打つとどうなる？',
      choices:['その変更は失われる', 'GitHubに保存される', '自動で commit される', '何も起きない'],
      answer:0, why:'だから「区切りがついたら commit」。commit してあるものは、いつでも戻せます。' },

    // --- ブランチ ---
    { cat:'branch', type:'input', scene:'add-color という名前で、新しいブランチを作って移動したい。',
      ask:'打つコマンドは？（-c を使って）',
      expect:['git switch -c add-color'], why:'-c は create。作ると同時に、そこへ移動します。' },

    { cat:'branch', type:'input', scene:'本線（main）に戻りたい。',
      ask:'打つコマンドは？',
      expect:['git switch main'], why:'-c を付けないと「すでにあるブランチへ移動」になります。' },

    { cat:'branch', type:'choice', scene:'ブランチを切り替えたら、書いたはずのコードが消えていました。',
      ask:'どういう状態？',
      choices:['別のブランチに残っているので、戻れば見られる', '完全に消えた', 'GitHubに移動した', 'commitが壊れた'],
      answer:0, why:'ブランチを移ると中身も切り替わります。消えたのではなく、元のブランチに残っています。' },

    { cat:'branch', type:'choice', scene:'main にいます。add-color の作業を取り込みたい。',
      ask:'打つコマンドは？',
      choices:['git merge add-color', 'git switch add-color', 'git push add-color', 'git add add-color'],
      answer:0, why:'「今いるブランチに、指定したブランチを合流させる」のが merge です。' },

    // --- 事故防止 ---
    { cat:'safe', type:'choice', scene:'パスワードの書かれたファイルを、うっかり commit して GitHub に上げてしまいました。',
      ask:'まずやるべきことは？',
      choices:['すぐに担当者へ連絡する', '黙ってファイルを消す', '履歴を書き換えて隠す', '様子を見る'],
      answer:0, why:'消しても履歴に残ります。鍵の無効化が必要になることも。隠さず、すぐ相談するのが正解です。' },

    { cat:'safe', type:'choice', scene:'AIが「このファイルをまとめて書き換えます」と提案してきました。',
      ask:'どうする？',
      choices:['差分を読んで、納得できなければ断る', 'とりあえず全部OKを押す', '読まずに拒否する', 'VS Codeを閉じる'],
      answer:0, why:'決めるのは常に人です。分からなければ断ってよく、断ってもやり直しがききます。' },

    { cat:'safe', type:'choice', scene:'ブラウザで確認しても、直したはずの表示が変わりません。',
      ask:'最初に疑うことは？',
      choices:['保存したか／再読み込みしたか', 'パソコンの故障', 'ネットワークの不調', 'gitの設定ミス'],
      answer:0, why:'この2つで大半が解決します。VS Code はタブに「●」があれば未保存です。' }
  ];

  var CATS = [
    { id:'all',    label:'全部' },
    { id:'move',   label:'場所を動く' },
    { id:'git',    label:'git の基本' },
    { id:'branch', label:'ブランチ' },
    { id:'safe',   label:'事故を防ぐ' }
  ];

  var st = { cat:'all', list:[], i:0, ok:0, wrong:[], answered:false };

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }

  function norm(s) {
    return String(s).trim().toLowerCase()
      .replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
      .replace(/\s+/g, ' ');
  }

  function el(id) { return document.getElementById(id); }

  function start(cat) {
    st.cat = cat;
    st.list = Q.filter(function (q) { return cat === 'all' || q.cat === cat; });
    st.i = 0; st.ok = 0; st.wrong = []; st.answered = false;
    render();
  }

  function retryWrong() {
    if (!st.wrong.length) return;
    st.list = st.wrong.slice(); st.i = 0; st.ok = 0; st.wrong = []; st.answered = false;
    render();
  }

  function render() {
    var v = el('view');
    if (st.i >= st.list.length) return finish();

    var q = st.list[st.i];
    var h = '<div class="card">' +
      '<div class="drillhead"><span class="phase">' + catLabel(q.cat) + '</span>' +
      '<span class="qn">' + (st.i + 1) + ' / ' + st.list.length + '</span></div>' +
      '<p class="scene">' + q.scene + '</p>' +
      '<h2>' + q.ask + '</h2>';

    if (q.type === 'choice') {
      h += '<div class="choices">';
      q.choices.forEach(function (c, i) {
        h += '<button type="button" class="ch" data-pick="' + i + '">' + c + '</button>';
      });
      h += '</div>';
    } else {
      h += '<div class="inputrow">' +
           '<input id="ans" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="ここに打つ">' +
           '<button type="button" class="act ok" data-submit="1">答える</button></div>' +
           '<p class="hintline">大文字・小文字や、前後の空白は気にしなくて大丈夫です。</p>';
    }

    h += '<div id="fb"></div></div>';
    v.innerHTML = h;
    var inp = el('ans');
    if (inp) { inp.focus(); inp.onkeydown = function (e) { if (e.key === 'Enter') check(inp.value); }; }
  }

  function catLabel(id) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i].label;
    return id;
  }

  function check(val) {
    if (st.answered) return;
    var q = st.list[st.i], correct;

    if (q.type === 'choice') {
      correct = (val === q.answer);
      var btns = document.querySelectorAll('.ch');
      btns.forEach(function (b, i) {
        if (i === q.answer) b.classList.add('right');
        else if (i === val) b.classList.add('bad');
        b.disabled = true;
      });
    } else {
      correct = q.expect.some(function (e) { return norm(e) === norm(val); });
      var inp = el('ans'); if (inp) inp.disabled = true;
    }

    st.answered = true;
    if (correct) st.ok++; else st.wrong.push(q);

    el('fb').innerHTML =
      '<div class="fb ' + (correct ? 'y' : 'n') + '">' +
      '<b>' + (correct ? '正解です' : 'おしい') + '</b>' +
      (correct ? '' : '<div class="ansline">正解: <code>' +
        (q.type === 'choice' ? q.choices[q.answer] : q.expect[0]) + '</code></div>') +
      '<div class="whyline">' + q.why + '</div></div>' +
      '<div class="btns" style="margin-top:14px">' +
      '<button type="button" class="act ok" data-next="1">次へ</button></div>';
  }

  function finish() {
    var total = st.list.length, pct = Math.round(st.ok / total * 100);
    var rec = load();
    var best = Math.max(rec[st.cat] || 0, pct);
    rec[st.cat] = best; save(rec);

    var msg = pct === 100 ? '全問正解です。よく覚えています。'
            : pct >= 70 ? 'いい調子です。間違えたところだけ、もう一度やってみましょう。'
            : '大丈夫です。ここは覚えるより「何回も見る」ほうが効きます。もう一度やってみてください。';

    // 点が低いときに祝われると、追い打ちになる。表情を変える。
    var face = pct >= 70
      ? { src: 'media/navi-party.svg', alt: '喜んでいる案内役', cls: 'win' }
      : { src: 'media/navi-calm.svg',  alt: '励ましている案内役', cls: 'win warm' };

    el('view').innerHTML = '<div class="card">' +
      '<div class="mascot ' + face.cls + '"><img src="' + face.src + '" alt="' + face.alt + '">' +
      '<div class="say"><h2 style="margin:6px 0">' + st.ok + ' / ' + total + ' 問 正解</h2>' +
      '<p class="why" style="margin:0">' + msg + '</p></div></div>' +
      '<div class="expect"><div class="t">この分野のベスト</div><div class="m">' + best + '%</div></div>' +
      '<div class="btns" style="margin-top:8px">' +
      (st.wrong.length ? '<button type="button" class="act ok" data-retry="1">間違えた ' + st.wrong.length + ' 問をやり直す</button>' : '') +
      '<button type="button" class="act ng" data-home="1">分野を選びなおす</button></div>' +
      '</div>';
  }

  function menu() {
    var rec = load();
    var h = '<div class="card">' +
      '<div class="mascot"><img src="media/navi-hello.svg" alt="案内役のキャラクター">' +
      '<div class="say">覚えるためのページです。<b>間違えて大丈夫</b>なので、気楽にどうぞ。<br>' +
      '何回もやるうちに、手が勝手に動くようになります。</div></div>' +
      '<h2>どれを練習しますか？</h2><div class="catlist">';
    CATS.forEach(function (c) {
      var n = Q.filter(function (q) { return c.id === 'all' || q.cat === c.id; }).length;
      var b = rec[c.id];
      h += '<button type="button" class="cat" data-cat="' + c.id + '">' +
           '<span class="cl">' + c.label + '</span>' +
           '<span class="cn">' + n + '問</span>' +
           '<span class="cb">' + (b ? 'ベスト ' + b + '%' : 'まだ') + '</span></button>';
    });
    h += '</div><div class="note" style="margin-top:18px">' +
         'コマンドは覚えなくても、<b>調べれば出てきます</b>。ここは「見たことがある」状態を作るための場所です。' +
         '完璧を目指さないでください。</div></div>';
    el('view').innerHTML = h;
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    if (t.dataset.cat)    { start(t.dataset.cat); return; }
    if (t.dataset.pick !== undefined) { check(parseInt(t.dataset.pick, 10)); return; }
    if (t.dataset.submit) { check(el('ans') ? el('ans').value : ''); return; }
    if (t.dataset.next)   { st.i++; st.answered = false; render(); return; }
    if (t.dataset.retry)  { retryWrong(); return; }
    if (t.dataset.home)   { menu(); return; }
  });

  menu();
})();
