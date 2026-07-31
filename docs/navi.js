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

  // 図には必ず説明文を付ける（読み上げ環境と、画像が出ないときのため）
  function fig(src, alt) {
    var a = alt || '説明図';
    return '<figure class="fig"><img class="shot" src="' + src + '" alt="' + esc(a) + '">' +
           '<figcaption>図: ' + esc(a) + '</figcaption></figure>';
  }

  // 案内役キャラクター。ひとことを添えて、独りで作業している感じを薄める。
  function mascot(kind, say) {
    var src = { hello: 'media/navi-hello.svg', calm: 'media/navi-calm.svg', party: 'media/navi-party.svg' }[kind];
    var cls = { hello: '', calm: ' warm', party: ' win' }[kind];
    var alt = { hello: '案内役のキャラクター', calm: '落ち着いてと声をかける案内役', party: '喜んでいる案内役' }[kind];
    return '<div class="mascot' + cls + '"><img src="' + src + '" alt="' + alt + '">' +
           '<div class="say">' + say + '</div></div>';
  }

  // 連絡先（docs/config.js で運営側が設定する）
  var warned = false;
  function support() {
    var s = window.TRAINER_SUPPORT || {};
    if (!s.name && !s.channel) {
      // 受講者に開発者向けの指示を見せない。運営には開発者ツールで知らせる。
      if (!warned) {
        warned = true;
        if (window.console && console.warn) {
          console.warn('[trainer] サポート窓口が未設定です。docs/config.js の TRAINER_SUPPORT に、担当者名・チャンネル・URL を記入してください。');
        }
      }
      return '<b>研修の担当者（サポート窓口）に連絡してください。</b><br>' +
             '連絡先が分からないときは、この研修を案内してくれた人に聞けば大丈夫です。';
    }
    var who = s.name || 'サポート窓口';
    var where = s.channel ? '（' + esc(s.channel) + '）' : '';
    var head = s.url
      ? '連絡先: <a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(who) + '</a>' + where
      : '連絡先: ' + esc(who) + where;
    return head + (s.note ? '<br><span class="fd">' + esc(s.note) + '</span>' : '');
  }

  // 進捗をGitHubのIssueとして報告する。ログイン済みなら、開いて送信するだけで済む。
  function repoName() {
    var s = window.TRAINER_SUPPORT || {};
    if (s.repo) return s.repo;
    var m = /github\.com\/([^\/]+\/[^\/]+)/.exec(s.url || '');
    return m ? m[1] : '';
  }
  function issueUrl(title, body) {
    var r = repoName();
    if (!r) return '';
    return 'https://github.com/' + r + '/issues/new?labels=' + encodeURIComponent('進捗') +
           '&title=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(body);
  }
  function stamp() {
    var d = new Date(), z = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()) + ' ' + z(d.getHours()) + ':' + z(d.getMinutes());
  }
  function naviName() { return document.title.split('|')[0].trim(); }

  function finReport(s) {
    var name = naviName();
    var u = issueUrl('[進捗] ' + name + ' を終えました', [
      '## ' + name + ' を終えました',
      '',
      '- 日時: ' + stamp(),
      '- できるようになったこと: ' + strip(s.gained || ''),
      '',
      'つまずいたところ・感想があれば、ここに書き足してください（空のままでも大丈夫です）。'
    ].join('\n'));
    if (!u) return '';
    return '<div class="report"><b>担当者に、終わったことを知らせましょう</b><br>' +
           '<span class="fd">GitHub にログインしていれば、内容が入った状態で開きます。<b>あとは送信ボタンを押すだけ</b>です。<br>' +
           '「404」と出る場合は、まだ研修グループに招待されていません。招待が届いてから、もう一度押してください。</span>' +
           '<div style="margin-top:10px"><a class="act ok" target="_blank" rel="noopener" href="' + u + '">' +
           '完了を報告する</a></div></div>';
  }

  // 参加申請。受講者のGitHubユーザー名を運営に送ってもらう。
  // ログイン中のユーザー名はこちらからは読めないので、本人に入力してもらう。
  function inviteBlock() {
    var c = window.TRAINER_SUPPORT || {};
    if (!c.inviteEmail) {
      return '<div class="note"><b>申請先がまだ決まっていません。</b>' +
             'この研修を案内してくれた人に、自分の GitHub ユーザー名を直接伝えてください。</div>';
    }
    return '<div class="invite">' +
      '<label for="ghuser"><b>あなたの GitHub ユーザー名</b></label>' +
      '<div class="fd">GitHub の右上のアイコンを押すと、いちばん上に表示されています。</div>' +
      '<input id="ghuser" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="例: taro-yamada">' +
      '<div class="btns" style="margin-top:12px">' +
      '<button type="button" class="act ok" data-invite="1">メールで申請する</button>' +
      '<button type="button" class="act ng" data-invitecopy="1">文章をコピーする</button>' +
      '</div>' +
      '<div class="fd" style="margin-top:8px">メールが開かないときは「文章をコピーする」を押して、' +
      'いつもお使いの方法（チャットなど）で送ってください。</div></div>';
  }

  function inviteText(user) {
    return {
      subject: '[研修] 参加申請',
      body: [
        '研修に参加します。相談用リポジトリへの招待をお願いします。',
        '',
        '・GitHub ユーザー名: ' + user,
        '・申請日時: ' + stamp(),
        ''
      ].join('\n')
    };
  }

  function doInvite(copyOnly) {
    var el = document.getElementById('ghuser');
    var user = el ? el.value.trim() : '';
    if (!user) {
      toast('GitHub のユーザー名を入れてください');
      if (el) el.focus();
      return;
    }
    var c = window.TRAINER_SUPPORT || {}, t = inviteText(user);
    if (copyOnly) { copy('宛先: ' + (c.inviteEmail || '（担当者）') + '\n件名: ' + t.subject + '\n\n' + t.body,
                         'コピーしました。チャットなどで送ってください。'); return; }
    window.location.href = 'mailto:' + encodeURIComponent(c.inviteEmail) +
      '?subject=' + encodeURIComponent(t.subject) + '&body=' + encodeURIComponent(t.body);
  }

  // 枠の中身が「ターミナルに打つ命令」かどうか。同じ枠を、貼り付ける文章にも使っている。
  var TERM = /^\s*(git|gh|code|npm|npx|node|python3?|pip3?|brew|winget|mkdir|touch|cd|ls|dir|echo|curl|New-Item|xcode-select)\b/;
  function isTerm(t) { return TERM.test(String(t).split('\n')[0]); }

  // そのステップで実際にやったことを見て、関係のあるものだけ出す
  function ctxOf(s) {
    // 判定は「受講者が実際にやること」＝手順を中心に見る。
    // 説明文まで見ると「保存は不要です」のような文まで拾ってしまう。
    var raw  = (pick(s.todo) || []).join(' ');
    var todo = strip(raw);                    // タグを外さないと「<b>保存</b>します」を取り逃がす
    var boxes = (s.cmd ? [s.cmd] : []).concat(pick(s.cmdMulti) || []);
    var inline = [];                          // 手順文中の <code> も、打つ命令であることが多い
    raw.replace(/<code>([\s\S]*?)<\/code>/g, function (_, c) { inline.push(strip(c)); return ''; });

    var ctx = {
      cmd:   boxes.some(isTerm) || inline.some(isTerm),   // ターミナルに打つステップか
      paste: boxes.some(function (t) { return !isTerm(t); }), // 枠の中身を貼り付けるステップか
      save:  /保存/.test(todo),                            // ファイルを保存するステップか
      reload:/再読み込み/.test(todo),                       // ブラウザを読み直すステップか
      // 何か操作するステップか。手順が「覚えること」の箇条書きの回は readonly:true を付ける。
      act:   !s.readonly && !!(raw || boxes.length),
      _text: strip([s.title, s.why, s.expect, s.note, s.ask, raw].join(' '))
    };
    // 待ちが発生するステップか（インストール・公開の反映など）
    ctx.wait = ctx.act && /インストール|Install|ダウンロード|Download|反映|同期|公開されます/.test(ctx._text);
    // 画面のボタンやメニューを探すステップか。ファイルを編集する回は対象外にする。
    ctx.ui = ctx.act && !ctx.cmd && !ctx.paste && !ctx.save &&
             /押し|クリック|選び|選択|ボタン|メニュー|タブ|チェック|入力|開きます/.test(todo);
    return ctx;
  }
  // when は ctx のフラグ名（cmd / paste / save / reload / wait / ui / gui / act）か、ステップ本文に含まれる語。
  // 配列を渡すと「すべて満たすとき」だけ表示する。
  function applies(item, ctx) {
    if (!item.when) return true;
    var ws = [].concat(item.when);
    return ws.every(function (w) {
      if (w.charAt(0) !== '_' && w in ctx) return !!ctx[w];
      return ctx._text.indexOf(w) >= 0;
    });
  }

  // 上から優先度順。そのステップに関係するものだけを、最大3つ表示する。
  var AID = [
    { when:'save', t:'保存しましたか？',
      d:'<span class="k">Ctrl</span>+<span class="k">S</span> / <span class="k">Cmd</span>+<span class="k">S</span>。タブに「●」が付いていたら未保存です。' },
    { when:'reload', t:'ブラウザを再読み込みしましたか？',
      d:'保存しただけでは、開いている画面は古いままです。<span class="k">F5</span> / <span class="k">Cmd</span>+<span class="k">R</span> で読み直してください。' },
    { when:'paste', t:'枠の「コピー」ボタンを使いましたか？',
      d:'手で範囲を選ぶと、はじめか終わりが欠けることがあります。枠の<b>コピー</b>を押してから貼り付けてください。' },
    { when:'cmd', t:'Enter を押しましたか？',
      d:'打ち終わっただけでは実行されません。最後に Enter を押します。' },
    { when:'cmd', t:'打ち間違いはありませんか？',
      d:'大文字と小文字、単語の間の半角スペース。<b>I</b>（アイ）と <b>l</b>（エル）は特に紛らわしいです。<span class="k">↑</span>キーで打ち直せます。' },
    { when:'wait', t:'少し待ってみましたか？',
      d:'インストールや読み込み、公開の反映は、終わるまで時間がかかることがあります。1分ほど置いてから、もう一度見てください。' },
    { when:'ui', t:'画面の文字が説明と少し違いますか？',
      d:'見た目はときどき変わります。<b>言葉</b>を手がかりに探してください（「Install」「設定」「公開」など）。' },
    { when:'act', t:'開き直しましたか？',
      d:'ブラウザは再読み込み（<span class="k">F5</span> / <span class="k">Cmd</span>+<span class="k">R</span>）。VS Code は閉じて開き直すと直ることがよくあります。' }
  ];

  // 受講者が「開いて確認した項目」を覚えておき、相談文に添える
  var tried = [];

  // 同じステップに長くとどまっている人に、こちらから声をかける
  var STUCK_MIN = 15;
  function stampStep() {
    try {
      var m = JSON.parse(localStorage.getItem(CFG.key + ':t') || '{}');
      if (!m[st.i]) { m[st.i] = Date.now(); localStorage.setItem(CFG.key + ':t', JSON.stringify(m)); }
      return m[st.i];
    } catch (e) { return Date.now(); }
  }
  function stuckBanner() {
    var since = stampStep();
    var min = Math.floor((Date.now() - since) / 60000);
    if (min < STUCK_MIN) return '';
    return '<div class="stuck"><b>このステップで' + min + '分ほど経っています。</b><br>' +
           'ここで止まるのは珍しくありません。一人で粘らず、下の「うまくいきません」から状況をコピーして相談してください。<br>' +
           support() + '</div>';
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
        mascot('hello', CFG.greeting || 'ここから一緒に進めます。<b>1画面に1つのことしかやりません。</b>分からなくなっても大丈夫なので、気楽にどうぞ。') +
        '<h2>' + s.title + '</h2><p class="why">' + s.why + '</p>' +
        '<div class="oschoice">' +
        '<button type="button" data-os="win">Windows</button>' +
        '<button type="button" data-os="mac">Mac</button></div>' +
        '<div class="note" style="margin-top:18px">どちらか分からないときは、研修の担当者に「これはWindowsですか？Macですか？」と聞いてください。恥ずかしいことではありません。</div>' +
        '</div>';
      return;
    }

    if (s.kind === 'fin') {
      v.innerHTML = '<div class="card">' +
        mascot('party', '<h2 style="margin:6px 0">' + s.title + '</h2><p class="why" style="margin:0">' + s.lead + '</p>') +
        (s.gained ? '<div class="expect"><div class="t">できるようになったこと</div><div class="m">' + s.gained + '</div></div>' : '') +
        (s.note ? '<div class="note">' + s.note + '</div>' : '') +
        finReport(s) +
        '<div class="ask"><p>次にやること</p><div class="btns">' +
        '<a class="act ok" style="text-decoration:none;text-align:center" href="' + s.nextHref + '">' + s.nextLabel + '</a>' +
        '</div></div>' +
        '<div class="foot"><button class="link" data-go="-1">前に戻る</button>' +
        '<button class="link" data-reset="1">最初からやり直す</button></div></div>';
      return;
    }

    var h = '<div class="card"><span class="phase">' + s.phase + '</span>' +
            '<div class="head">' +
            (s.icon ? '<img class="ico" src="media/' + s.icon + '" alt="">' : '') +
            '<div><h2>' + s.title + '</h2><p class="why" style="margin-bottom:0">' + s.why + '</p></div></div>';

    var list = pick(s.todo);
    if (list) { h += '<ol class="todo">'; for (var i = 0; i < list.length; i++) h += '<li>' + list[i] + '</li>'; h += '</ol>'; }

    if (s.invite)  h += inviteBlock();
    if (s.visual)  h += fig(s.visual, s.visualAlt);
    if (s.visual2) h += fig(s.visual2, s.visual2Alt);

    if (s.cmd) h += '<p style="font-size:14px;margin:16px 0 0"><b>' + (s.cmdlabel || '') + '</b></p>' + cmdBox(s.cmd);
    var multi = pick(s.cmdMulti);
    if (multi) for (var j = 0; j < multi.length; j++) h += cmdBox(multi[j]);

    if (s.expect) h += '<div class="expect"><div class="t">こうなれば成功です</div><div class="m">' + s.expect + '</div></div>';
    if (s.note)   h += '<div class="note">' + s.note + '</div>';
    h += stuckBanner();

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
    var ctx = ctxOf(s);
    ctx.gui = ctx.act && !ctx.cmd && !ctx.paste;   // 画面だけを操作するステップ

    var own = s.tb || [], seen = {}, gen = [];
    for (var k = 0; k < own.length; k++) seen[own[k].q] = 1;
    // 共通の項目は「そのステップに関係するもの」だけを、別グループとして足す
    for (var c = 0; c < COMMON.length; c++) {
      if (!seen[COMMON[c].q] && applies(COMMON[c], ctx)) gen.push(COMMON[c]);
    }
    var all = own.concat(gen);

    var aid = AID.filter(function (a) { return applies(a, ctx); }).slice(0, 3);

    var h = '<div class="help">' +
      mascot('calm', '<b>大丈夫です。ここで止まる人はたくさんいます。</b><br>' +
             '上から順に試すと、たいてい解決します。<b>全部読む必要はありません。</b>');

    // ① まず疑う3つ（手を動かさない画面では、確認するものが無いので出さない）
    if (aid.length) {
      h += '<div class="hsec">まず、これだけ確認してください</div><div class="firstaid">';
      aid.forEach(function (f, i) {
        h += '<div class="fa"><span class="fn">' + (i + 1) + '</span>' +
             '<div><b>' + f.t + '</b><br><span class="fd">' + f.d + '</span></div></div>';
      });
      h += '</div>';
    } else {
      h += '<div class="hsec">この画面は、読んで進むだけです</div>' +
           '<div class="note">ぴんと来なくても大丈夫です。ここは手を動かす場面ではないので、' +
           '<b>そのまま次に進んで構いません</b>。先をやってから戻ると、すっと分かることがよくあります。</div>';
    }

    // ② 症状から探す（検索つき）
    h += '<div class="hsec">症状から探す</div>' +
         '<input class="hsearch" id="hq" type="text" autocomplete="off" spellcheck="false" ' +
         'placeholder="画面に出ている文字を貼り付けて探せます（例: not found）">' +
         '<div id="hlist">';
    // ステップ固有と、全体で共通のものを分けて見せる
    function group(label, items) {
      if (!items.length) return '';
      var g = '<div class="ghead">' + label + '</div>';
      items.forEach(function (it) {
        g += '<details class="tb" data-tbq="' + esc(it.q) + '"><summary>' + it.q + '</summary>' +
             '<div class="a">' + it.a + '</div></details>';
      });
      return g;
    }
    h += group('このステップでよくあること', own);
    h += group('そのほか（どのステップでも起こること）', gen);
    h += '<div class="nohit" id="nohit"' + (all.length ? '' : ' style="display:block"') +
         '>当てはまるものが見つかりませんでした。下の方法で聞いてください。</div></div>';

    // ③ 段階を追って聞く
    h += '<div class="hsec">それでも解決しないとき</div>' +
         '<div class="esc">' +
         '<div class="escstep"><span class="en">1</span><div>' +
         '<b>AIに聞く</b>（すぐ試せます）<br>' +
         '<span class="fd">下のボタンで<b>質問文がコピー</b>されます。Claude Code に貼り、' +
         '〈実際に起きたこと〉だけ書き足して送ってください。</span>' +
         '<div style="margin-top:10px"><button type="button" class="act ok" data-aiprompt="1">AIに聞く文章をコピー</button></div>' +
         '</div></div>' +
         '<div class="escstep"><span class="en">2</span><div>' +
         '<b>人に聞く</b>（15分たったら、ためらわずに）<br>' +
         '<span class="fd">' + support() + '</span>' +
         '<div style="margin-top:10px"><button type="button" class="act ng" data-report="1">今の状況をコピー</button></div>' +
         '<details class="tb" style="margin-top:10px"><summary>画面を見せると早く解決します（撮り方）</summary>' +
         '<div class="a"><b>Windows</b>: <span class="k">Windows</span>+<span class="k">Shift</span>+<span class="k">S</span> を押して、' +
         '写したい範囲をドラッグ。<br><b>Mac</b>: <span class="k">Cmd</span>+<span class="k">Shift</span>+<span class="k">4</span> を押して、範囲をドラッグ。<br>' +
         '撮ったものを、そのままチャットに貼り付けられます。<b>エラーの文字が読める大きさ</b>で撮ってください。</div></details>' +
         '</div></div></div>';

    // ④ 解決したときの出口
    h += '<div class="solved"><button type="button" class="link" data-solved="1">✓ 解決しました</button></div>';

    h += '</div>';
    box.innerHTML = h;
  }

  // 検索で絞り込む
  function filterHelp(q) {
    var list = document.getElementById('hlist');
    if (!list) return;
    var key = String(q).trim().toLowerCase();
    var items = list.querySelectorAll('details.tb[data-tbq]'), hit = 0;
    items.forEach(function (d) {
      var text = (d.textContent || '').toLowerCase();
      var show = !key || text.indexOf(key) >= 0;
      d.style.display = show ? '' : 'none';
      if (show) { hit++; if (key) d.open = true; }
    });
    // グループ見出しは、そのグループに残りがあるときだけ出す
    list.querySelectorAll('.ghead').forEach(function (g) {
      var any = false, n = g.nextElementSibling;
      while (n && n.tagName === 'DETAILS') { if (n.style.display !== 'none') any = true; n = n.nextElementSibling; }
      g.style.display = any ? '' : 'none';
    });
    var nh = document.getElementById('nohit');
    if (nh) nh.style.display = hit ? 'none' : 'block';
  }

  function aiPrompt() {
    var s = STEPS[st.i];
    var todo = pick(s.todo);
    var lines = [
      'プログラミング初心者です。研修の途中で詰まっています。',
      '専門用語はできるだけ避けて、次にやることを1つだけ教えてください。',
      '',
      '【やろうとしていること】',
      s.title,
      '',
      '【手順】'
    ];
    if (todo) todo.forEach(function (t, i) { lines.push((i + 1) + '. ' + strip(t)); });
    else lines.push('（画面の指示にしたがって操作中）');
    lines.push('');
    lines.push('【本来こうなるはず】');
    lines.push(strip(s.expect || s.ask));
    lines.push('');
    lines.push('【実際に起きたこと】');
    lines.push('（ここに書いてください。エラーが出ていれば、そのまま貼り付けてください）');
    lines.push('');
    lines.push('【環境】' + (needsOs() ? osName() : 'Windows または Mac') + ' / VS Code');
    copy(lines.join('\n'), 'コピーしました。Claude Code に貼って、〈実際に起きたこと〉だけ書き足してください。');
  }

  function strip(h) { return String(h).replace(/<[^>]*>/g, ''); }

  function report() {
    var s = STEPS[st.i];
    var min = Math.floor((Date.now() - stampStep()) / 60000);
    var t = '【' + (document.title.split('|')[0].trim()) + 'でつまずきました】\n' +
            (needsOs() ? '・パソコン: ' + osName() + '\n' : '') +
            '・止まった場所: ' + st.i + 'ステップ目「' + s.title + '」\n' +
            '・できなかったこと: ' + s.ask + '\n' +
            '・このステップでの経過時間: 約' + min + '分\n' +
            (tried.length ? '・自分で試したこと: ' + tried.join(' / ') + '\n' : '') +
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
    if (t.dataset.invite) { doInvite(false); return; }
    if (t.dataset.invitecopy) { doInvite(true); return; }
    if (t.dataset.aiprompt) { aiPrompt(); return; }
    if (t.dataset.solved) {
      var box = document.getElementById('help'); if (box) box.innerHTML = '';
      toast('よかったです。その調子で進めてください。');
      return;
    }
    if (t.dataset.report) { report(); return; }
    if (t.dataset.copy !== undefined) { copy(t.dataset.copy); return; }
    if (t.dataset.reset) {
      if (confirm('最初からやり直しますか？')) { st = { os: null, i: 0 }; save(); render(); }
      return;
    }
  });

  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'hq') filterHelp(e.target.value);
  });
  document.addEventListener('toggle', function (e) {
    var d = e.target;
    if (d && d.tagName === 'DETAILS' && d.open && d.dataset.tbq) {
      if (tried.indexOf(d.dataset.tbq) < 0) tried.push(d.dataset.tbq);
    }
  }, true);

  if (st.i > 0 && needsOs() && !st.os) st.i = 0;
  render();
})();
