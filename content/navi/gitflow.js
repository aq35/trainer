// チームのブランチ運用（Git-Flow） — 1画面に1つずつ進むナビの中身。
// 書き方は README の「教材を直すとき」を見てください。文字列の中の HTML は
// ビルド時に、許可したタグ（tools/html.mjs の INLINE。b / br / a / code / span など）だけ通します。
export const title = "チームのブランチ運用（Git-Flow）";

export default {
key:'trainer-gitflow-v1',
greeting:'ここまでは、ブランチを<b>自分のために</b>使ってきました。<br>' +
         'この回は<b>「なぜチームには決まりごとが要るのか」</b>から始めます。<b>名前を覚えるのは、いちばん最後で構いません。</b><br>' +
         '使い捨てのフォルダで1周するので、<b>誰のリポジトリも汚しません。</b>',

common:[
  { q:'言葉の意味が分からない',
    a:'<a href="index.html#/glossary" target="_blank" rel="noopener">用語集</a>を見てください。' },
  { when:'cmd', q:'そもそもブランチが分からない',
    a:'<a href="branch.html" target="_blank" rel="noopener">ブランチと安全な進め方</a>に戻ってください。<b>この回は、その続きです。</b>' },
  { when:'cmd', q:'いま自分がどこにいるか分からなくなった',
    a:'<code>git branch</code> を打つと、いるブランチに <code>*</code> が付きます。<br>枝の形を見るなら <code>git log --oneline --graph --all</code> です。<b>迷ったら、この2つ。</b>' },
  { when:'cmd', q:'コマンドを打ち間違えた／やり直したい',
    a:'<b>この回は使い捨てのフォルダです。壊して構いません。</b><br>作り直すなら、フォルダごと消して3番目の画面からやり直してください。<b>失うものはありません。</b>' }
],

steps:[
{
  icon:'icon-folder.svg', phase:'1. なぜ生まれたか', readonly:true,
  title:'一人のときは、決まりごとが要りませんでした',
  visual:'media/solo-no-flow.svg',
  visualAlt:'一人開発ではブランチの決まりが要らなかった理由と、チームになると何が変わるか',
  why:'<b>ここまで、ブランチの決まりごとを1つも使っていません。</b>それで困りませんでした。<b>なぜ困らなかったのか</b>から始めます。',
  todo:{
    common:['思い出してください。<a href="branch.html" target="_blank" rel="noopener">ブランチの回</a>も<a href="work.html" target="_blank" rel="noopener">仕事の一周</a>も、<b>作って、戻して、それで終わり</b>でした',
            '困らなかった理由は3つです',
            '　① <b>何が入っているか、全部知っている</b>（自分で入れたものしか入っていない）',
            '　② <b>出す相手がいない</b>（いつ出すかも自分で決められる）',
            '　③ <b>壊れても、困るのは自分だけ</b>',
            '<b>チームに入ると、この3つが全部ひっくり返ります。</b>次の画面で見ます']
  },
  expect:'<b>「決まりごとは、困った人が作った」</b>と分かれば十分です。<b>几帳面な人のための作法ではありません。</b>',
  note:'<b>ここが分からないまま名前だけ覚えると、必ずつらくなります。</b><br>' +
       '<code>develop</code> や <code>release</code> という言葉は、<b>誰かが困った結果として生まれたもの</b>です。<br>' +
       '<b>だから、この回は「どう困るのか」から順に見ていきます。</b>覚えるのは最後で構いません。',
  ask:'一人のときに決まりごとが要らなかった理由が、分かりましたか？',
  tb:[
    { q:'一人でも、ちゃんとやったほうがいいのでは？',
      a:'<b>やりすぎると、逆に続きません。</b>一人なら <code>main</code> ＋ 短いブランチで十分です。<br>ただし<b>1つだけ、一人でも効くもの</b>があります ——<b>出したものにタグを打つ</b>こと。あとで「どれを出したか」が分かります。この回の中でやります。' },
    { q:'いまの現場がどうなっているか、まだ想像できない',
      a:'<b>それでかまいません。この回のあいだに、少しずつ形が見えてきます。</b><br>いま持っておいてほしい問いは1つだけです ——<b>「これは、出せるもの？ それとも作りかけ？」</b>。<b>この回は、ずっとこの問いの話をします。</b>' }
  ]
},
{
  icon:'icon-key.svg', phase:'2. 何が困るのか',
  title:'3人が同じ main に入れたら、何が困るでしょうか',
  visual:'media/three-devs-main.svg',
  visualAlt:'3人が同じmainに直接入れると起きる3つの困りごと',
  why:'<b>決まりごとの中身より先に、困りごとを見ます。</b>ここが分かれば、あとは全部その対策として読めます。',
  todo:{
    common:['<b>3人が、同じ <code>main</code> に直接コミットしている</b>とします',
            '　<b>Aさん</b>…… 機能が完成した　<b>Bさん</b>…… まだ作りかけ　<b>Cさん</b>…… ちょっと実験してみた',
            'そこへ上司が来て、<b>「明日、出して」</b>と言いました',
            '<b>何が困るでしょうか。3つ、書き出してみてください</b>（紙かメモ帳に）',
            '　<b>思いつかなければ1つでも構いません。</b>書いてから、下の答えを見てください']
  },
  expect:'<b>この3つです。</b><br>' +
         '① <b>「いまの main、出せるの？」に誰も答えられない</b> —— 作りかけが入っているかもしれない<br>' +
         '② <b>頼んでいないものが、一緒に出る</b> —— Cさんの実験も、そのまま乗ってしまう<br>' +
         '③ <b>戻したくても、どこまで戻せばいいか分からない</b> —— Bさんの分だけ抜く、ができない<br>' +
         '<b>1つでも自分で書けていれば十分</b>です。',
  note:'<b>一番きついのは ③ です。</b>3人分が1列に混ざったあとで、<b>「Bさんの分だけ」を抜くのは、ほぼ不可能</b>だからです。<br>' +
       '<b>だから、入れる前に分けるしかありません。</b>——これが、ブランチを決まりごとにした出発点です。<br>' +
       '<b>フローの話は、全部ここから出ています。</b>',
  ask:'困ることを自分で書いてから、答え合わせしましたか？',
  tb:[
    { q:'1つも書けなかった',
      a:'<b>ふつうです。まだ経験していないことなので、想像しにくくて当然です。</b><br>1つだけ持ち帰ってください ——<b>「混ざると、あとで分けられない」</b>。この回で出てくる決まりごとは、ほぼ全部これへの対策です。' },
    { q:'そもそも、なんで直接コミットできてしまうの？',
      a:'<b>git が止めてくれないからです。</b>git は「誰が」「何を」入れるかを判断しません。<b>入れていいかどうかは、人が決めるしかありません</b>。<br>あとの画面で、<b>GitHub 側で止める設定</b>（ブランチ保護）も出てきます。<b>人の記憶に頼らない、という考え方です。</b>' },
    { q:'PR（プルリクエスト）を使えば解決では？',
      a:'<b>鋭いです。半分そのとおりです。</b>PR があれば「確認してから入れる」ができるので、①と②はかなり防げます。<br>ただし<b>③（出す直前に、入れる/入れないを分ける）は、PR だけでは足りません</b>。そこがブランチを分ける理由として残ります。<br><b>実は、いまの主流はこの「PRで足りるところは、PRに任せる」形</b>です。最後の画面で見ます。' }
  ]
},
{
  icon:'icon-terminal.svg', phase:'3. 土台を作る',
  title:'使い捨てのフォルダで、main と develop を作ります',
  why:'<b>本物のリポジトリでは練習しません。</b>壊して覚えるために、捨てて構わない場所を作ります。',
  todo:{
    common:['ターミナルを開いて、下の枠を<b>まとめて</b>コピーして実行します',
            '　（<b>デスクトップ</b>に <code>gitflow-practice</code> というフォルダができます）',
            '最後の <code>git branch</code> で、<b>2本</b>出れば成功です',
            '　<code>main</code> …… 出せるもの　／　<code>develop</code> …… 次に出すもの',
            '<b>いまは同じ中身です。</b>ここから枝分かれしていきます']
  },
  pre:[
    ['cd ~/Desktop','ターミナルがいる場所を、デスクトップに移します（<code>cd</code> ＝ change directory ＝ 場所を変える）'],
    ['mkdir gitflow-practice','そこに新しいフォルダを1つ作ります（<code>mkdir</code> ＝ make directory）'],
    ['cd gitflow-practice','作ったフォルダの中に入ります'],
    ['git init -b main','<b>このフォルダを、git の管理下に置きます。</b>同時に、最初の枝の名前を <code>main</code> にします（<code>-b</code> ＝ branch）'],
    ['echo v1 > app.txt','<code>app.txt</code> というファイルを作り、中に「v1」と書きます'],
    ['git add . &amp;&amp; git commit -m "最初のコミット"','いまの中身を<b>記録に取ります</b>。<code>add</code> が「これを記録する」の指定、<code>commit</code> が記録の実行です'],
    ['git switch -c develop','<code>develop</code> という枝を<b>作って、そこへ移ります</b>（<code>-c</code> ＝ create ＝ 作る）'],
    ['git branch','<b>いま存在する枝の一覧</b>を出します']
  ],
  cmdMulti:{
    win:['cd ~/Desktop',
         'mkdir gitflow-practice',
         'cd gitflow-practice',
         'git init -b main',
         'echo v1 > app.txt',
         'git add . && git commit -m "最初のコミット"',
         'git switch -c develop',
         'git branch'],
    mac:['cd ~/Desktop',
         'mkdir gitflow-practice',
         'cd gitflow-practice',
         'git init -b main',
         'echo v1 > app.txt',
         'git add . && git commit -m "最初のコミット"',
         'git switch -c develop',
         'git branch']
  },
  cmdlabel:'1行ずつでも、まとめてでも構いません',
  expect:'<b><code>develop</code> と <code>main</code> の2本が出れば成功</b>です。いまいる方に <code>*</code> が付きます。' +
         '<pre><code>* develop\n  main</code></pre>',
  note:'<b>この <code>app.txt</code> が、これから「サービス」の役をします。</b>中身は何でも構いません。<br>' +
       '<b>大事なのはファイルの中身ではなく、どのブランチに、いつ入るか</b>です。',
  after:'<b>git の管理下にあるフォルダが、1つできました。</b>そして枝が2本あります。<br>' +
        'ただし<b>いまは中身がまったく同じ</b>です。枝は「どのコミットを指しているか」の目印なので、同じところを指していれば中身も同じになります。<br>' +
        'そして<b>あなたはいま <code>develop</code> にいます</b>（<code>*</code> が付いている方）。この先の作業は、ここから始めます。',
  ask:'main と develop の2本が出ましたか？',
  tb:[
    { q:'git init で「-b は使えない」と言われた',
      a:'<b>git が古いです。</b>代わりに <code>git init</code> だけ打ち、最初のコミットのあとに <code>git branch -M main</code> を実行してください。<br>それで同じ状態になります。' },
    { q:'echo v1 > app.txt でファイルができない',
      a:'<b>PowerShell だと文字コードが変わることがありますが、この回では問題になりません。</b><br>気になるなら、VS Code で <code>app.txt</code> を作って「v1」と書いて保存するだけでも同じです。' },
    { q:'デスクトップ以外に作りたい',
      a:'<b>どこでも構いません。</b>1行目の <code>cd ~/Desktop</code> を、好きな場所に変えてください。<br>あとで消すので、分かりやすい場所を選んでください。' }
  ]
},
{
  icon:'icon-git.svg', phase:'4. ブランチの正体',
  title:'ブランチの中身を、のぞいてみます',
  visual:'media/branch-is-label.svg',
  visualAlt:'gitにとってブランチはただの目印で、名前の意味は人が決めた約束であること',
  why:'決まりごとを覚える前に、<b>git 自身はブランチをどう見ているのか</b>を確かめます。<b>ここを誤解している人が多い</b>ところです。',
  todo:{
    common:['さっきのフォルダで、<b>変な名前のブランチを2本</b>作ります（1〜2行目）',
            '　<code>banana</code> と <code>release/1.0.0</code>。<b>git が名前で区別するか</b>を見ます',
            '<b>ブランチの正体を、直接のぞきます</b>（3行目）',
            '　ブランチは <code>.git/refs/heads/</code> にある、<b>40文字が1行書いてあるだけのファイル</b>です',
            '<b>3本の中身を見比べます</b>（4行目）。同じでしょうか、違うでしょうか']
  },
  pre:[
    ['git branch banana','<code>banana</code> という名前の枝を作ります。<b>移りません</b>（<code>-c</code> が無いので、作るだけです）'],
    ['git branch release/1.0.0','同じように、<code>/</code> を含む名前で1本作ります'],
    ['ls .git/refs/heads','<b>枝の実体が置いてある場所</b>の中身を一覧します（<code>ls</code> ＝ list）'],
    ['git rev-parse main develop banana','3本の枝が<b>それぞれどのコミットを指しているか</b>を表示します']
  ],
  cmdMulti:{
    common:['git branch banana',
            'git branch release/1.0.0',
            'ls .git/refs/heads',
            'git rev-parse main develop banana']
  },
  cmdlabel:'ブランチの中身をのぞく',
  expect:'<b>3本とも、まったく同じ40文字が出れば成功</b>です。' +
         '<pre><code>$ ls .git/refs/heads\nbanana   develop   main   release\n\n$ git rev-parse main develop banana\nb04b8c1764af43a1787fffc95ecb02d3e23c78af\nb04b8c1764af43a1787fffc95ecb02d3e23c78af\nb04b8c1764af43a1787fffc95ecb02d3e23c78af</code></pre>' +
         '<b>git は <code>develop</code> も <code>banana</code> も、まったく区別していません。</b>（40文字は人によって違います）<br>' +
         '<code>release</code> だけフォルダになっているのは、<b>名前に <code>/</code> が入っているから</b>です。<b>これが <code>feature/</code> のような書き方の正体</b>で、まとめて見えるようにしているだけです。',
  note:'<b>ブランチは、コピーでもフォルダでもありません。</b>「どのコミットを指しているか」を書いた<b>ただの目印</b>です。<br>' +
       '<b>だから、いくら作っても重くなりません。</b>そして <code>develop</code> という名前に、git 側の意味は<b>1つもありません</b>。<br>' +
       '<b>意味をつけたのは、人です。</b>——名前を見ただけで<b>「出せるものか、作りかけか」</b>が分かるように。',
  after:'<b>3本とも、同じ40文字が出ました。</b>この40文字は<b>コミット1つを指す番号</b>です。<br>' +
        'つまり<b>3本とも、同じ1つのコミットを指しているだけ</b>で、中身のコピーはどこにもありません。<br>' +
        'だから枝は<b>いくら作っても一瞬で終わり、容量も増えません</b>。「枝を作る」は、目印を1つ置くだけの作業です。<br>' +
        'そして <code>develop</code> という名前に、<b>git 側の意味は1つもありません</b>。——意味は、このあと人が決めます。',
  ask:'3本とも同じ40文字だと、自分の目で確かめましたか？',
  tb:[
    { q:'ls .git/refs/heads が動かない（Windows）',
      a:'<b>PowerShell でも <code>ls</code> は使えます</b>（<code>Get-ChildItem</code> の別名）。<br>それでも駄目なら <code>dir .git\\refs\\heads</code> を試してください。<b>4行目の <code>git rev-parse</code> だけでも、この画面の目的は果たせます。</b>' },
    { q:'.git フォルダが見えない',
      a:'<b>隠しフォルダなので、ふつうは表示されません。</b>ただし<b>コマンドからは、そのまま触れます</b>。<br><b>中を書き換えないでください。</b>見るだけです。壊すとリポジトリが動かなくなります。' },
    { q:'では、ブランチ名は何でもいいの？',
      a:'<b>git にとっては何でもいいです。人にとっては、まったく良くありません。</b><br>名前は<b>チームへの伝言</b>です。<code>feature/search</code> なら「検索機能を作りかけ」、<code>hotfix/1.0.1</code> なら「本番の緊急修正」と、<b>開かなくても伝わります</b>。<br><b>この「伝言のルール」をひとまとめにしたものが、次の画面の Git-Flow です。</b>' },
    { q:'作った banana ブランチは、どうすればいい？',
      a:'<b>消しておいてください</b> ——<code>git branch -d banana</code> と <code>git branch -d release/1.0.0</code>。<br>消し忘れても、この先の手順は動きます。<b>ただし、一覧が散らかります。</b>' }
  ]
},
{
  icon:'icon-git.svg', phase:'5. 思想', readonly:true,
  title:'Git-Flow は、その約束をひとまとめにしたものです',
  visual:'media/gitflow-idea.svg',
  visualAlt:'Git-Flowの思想。出せるものと作りかけを混ぜない。合流の向きは一方通行',
  why:'<b>名前に意味を与えたのは人だ</b>と、さっき確かめました。<b>その約束を全部決めたもの</b>が Git-Flow です。',
  todo:{
    common:['決めた約束は5つありますが、<b>言っているのは1つ</b>です ——<b>「出せるもの」と「作りかけ」を混ぜない</b>',
            '　<code>main</code> …… <b>いまお客さんが使っているもの</b>。そのまま出せる状態を保つ',
            '　<code>develop</code> …… <b>次に出すもの置き場</b>。動くが、まだ出さない',
            'そして<b>合流の向きが決まっています</b>（一方通行）',
            '　<code>feature → develop → release → main</code>',
            'この向きがあるから、<b>「いまどこに何が入っているか」を全員が言えます</b>']
  },
  expect:'<b>2本に分ける理由が「混ぜないため」だと分かれば十分</b>です。名前はこのあと手を動かして覚えます。',
  note:'<b>なぜ、そこまでして分けるのか。</b><br>' +
       '<b>main は、いつ「出して」と言われるか分からない</b>からです。作りかけが1行でも混ざっていると、その瞬間に出せません。<br>' +
       '<b>「出せる状態を、いつでも保っておく」</b> —— これがチーム開発の一番の土台です。',
  ask:'main と develop を分ける理由が、自分の言葉で言えそうですか？',
  tb:[
    { q:'一人の開発でも、develop は要る？',
      a:'<b>要りません。</b>一人なら <code>main</code> ＋ 短いブランチで十分です。<br>develop が効くのは<b>「出す人」と「作る人」が別々にいるとき</b>。誰かが出す判断をしている間も、別の人が作り続けられるようにする仕組みです。' },
    { q:'うちの現場は Git-Flow じゃないと思う',
      a:'<b>その可能性は高いです。そして、それで構いません。</b>いま主流はもっと簡単な形（<code>main</code> 1本＋短命ブランチ）です。<br>それでも学ぶ価値があるのは、<b>Git-Flow が「なぜ分けるのか」を一番はっきり見せてくれる</b>からです。最後の画面で、やめる判断の話もします。' }
  ]
},
{
  icon:'icon-git.svg', phase:'6. feature',
  title:'機能を1つ作って、develop に合流させます',
  why:'<b>作りかけは、develop に直接書きません。</b>1機能につき1本、専用のブランチを立てます。',
  todo:{
    common:['<code>develop</code> から <code>feature/search</code> を切ります（下の1行目）',
            'そこで作業してコミットします（2〜3行目）',
            '<code>develop</code> に戻って合流させます（4〜5行目）',
            '　<code>--no-ff</code> を付けています。<b>「ここで1機能が入った」という印を履歴に残す</b>ためです',
            '終わったブランチは消します（6行目）。<b>記録は履歴に残るので、消して構いません</b>']
  },
  pre:[
    ['git switch -c feature/search develop','<b>いちばん最後に「起点」を書きます。</b><code>develop</code> を起点に <code>feature/search</code> を作って、そこへ移ります'],
    ['echo 検索機能 >> app.txt','<code>app.txt</code> の<b>末尾に1行足します</b>（<code>&gt;&gt;</code> は追記。<code>&gt;</code> だと上書きになるので注意）'],
    ['git commit -am "検索機能を追加"','変更を記録します（<code>-a</code> ＝ 既にあるファイルの変更を自動で add、<code>-m</code> ＝ メッセージ）'],
    ['git switch develop','<code>develop</code> に戻ります（<code>-c</code> が無いので、作らずに移るだけ）'],
    ['git merge --no-ff feature/search -m "Merge feature/search"','<code>feature/search</code> の内容を、<b>いまいる <code>develop</code> に取り込みます</b>。<code>--no-ff</code> は「一直線にせず、合流の印を残す」'],
    ['git branch -d feature/search','用済みの枝を消します（<code>-d</code> ＝ delete。<b>合流済みのものしか消せません</b>）'],
    ['git log --oneline --graph','履歴を<b>枝の形つき</b>で表示します']
  ],
  cmdMulti:{
    common:['git switch -c feature/search develop',
            'echo 検索機能 >> app.txt',
            'git commit -am "検索機能を追加"',
            'git switch develop',
            'git merge --no-ff feature/search -m "Merge feature/search"',
            'git branch -d feature/search',
            'git log --oneline --graph']
  },
  cmdlabel:'1機能＝1ブランチ。作って、戻して、消す',
  expect:'<b>枝が分かれて合流した形が出れば成功</b>です。' +
         '<pre><code>*   8af8372 Merge feature/search\n|\\\n| * 42fb57f 検索機能を追加\n|/\n* e643710 最初のコミット</code></pre>' +
         'この<b>ふくらみ</b>が「1機能が入った」という印です。<b>先頭の英数字（コミットの番号）は、人それぞれ違います。</b>',
  note:'<b><code>--no-ff</code> を付けない場合</b>、履歴は一直線になり、どこからどこまでが1つの機能だったかが分からなくなります。<br>' +
       '<b>あとで「この機能だけ取り消したい」と言われたときに効きます。</b>ふくらみ1つを取り消せば済むからです。',
  after:'<b><code>develop</code> が、<code>feature/search</code> で作ったものを含んだ状態になりました。</b><br>' +
        '履歴に<b>ふくらみ</b>ができています。これが <code>--no-ff</code> の効果で、<b>どこからどこまでが1つの機能だったか</b>が形として残ります。<br>' +
        'そして <code>feature/search</code> という<b>名前は消えましたが、コミットは1つも消えていません</b>。外したのは名札だけです。',
  ask:'枝が分かれて合流した形が、履歴に出ましたか？',
  tb:[
    { q:'ブランチ名の <code>feature/</code> は必要？',
      a:'<b>git の機能ではなく、ただの名前の付け方</b>です。<code>/</code> を入れると、ツール上でフォルダのようにまとまって見えます。<br><b>チームで揃っていることのほうが大事</b>です。参画したら、既存のブランチ名を真似してください。' },
    { q:'merge のとき、エディタが開いて止まった',
      a:'<b>コミットメッセージの入力待ちです。</b>壊れていません。<br><b>nano</b>（下に <code>^X Exit</code> と出る）なら <kbd>Ctrl</kbd>+<kbd>X</kbd> → <kbd>Y</kbd> → <kbd>Enter</kbd>。<br><b>vim</b>（何も出ない）なら <code>:wq</code> と打って <kbd>Enter</kbd>。' },
    { q:'branch -d で「マージされていない」と怒られた',
      a:'<b>合流に失敗しています。</b>消す前に <code>git branch --merged</code> を打って、消したいブランチが一覧に出るか確かめてください。<br>出ないなら、1つ前の merge が終わっていません。<b>-D（大文字）で強制的に消さないでください。</b>作業が消えます。' }
  ]
},
{
  icon:'icon-git.svg', phase:'7. release',
  title:'出す直前に「凍結」します',
  why:'<b>release ブランチは、機能を追加する場所ではありません。</b>——<b>追加を止める</b>ための場所です。',
  todo:{
    common:['<code>develop</code> から <code>release/1.0.0</code> を切ります（1行目）',
            '<b>この瞬間から、この中に新しい機能は入れません。</b>入れていいのは<b>出す準備の修正だけ</b>',
            '　誤字・表示崩れ・設定値。「動きを変えない直し」だけです',
            '確認して、直します（2〜3行目）',
            '<b>切ったあとも、develop は止まりません。</b>次の機能の作業はそのまま進みます']
  },
  pre:[
    ['git switch -c release/1.0.0 develop','<code>develop</code> を起点に <code>release/1.0.0</code> を作って移ります。<b>この瞬間が「凍結」です</b>'],
    ['echo 誤字を直した >> app.txt','出す前の細かい直しを、1つ入れます'],
    ['git commit -am "リリース前の微修正"','それを記録します'],
    ['git branch','枝の一覧を出して、<b>いま自分がどこにいるか</b>を確かめます']
  ],
  cmdMulti:{
    common:['git switch -c release/1.0.0 develop',
            'echo 誤字を直した >> app.txt',
            'git commit -am "リリース前の微修正"',
            'git branch']
  },
  cmdlabel:'凍結ブランチを立てる',
  expect:'<b><code>release/1.0.0</code> ができ、いまそこにいれば成功</b>です。' +
         '<pre><code>  develop\n  main\n* release/1.0.0</code></pre>',
  note:'<b>これが release ブランチの本当の価値です。</b><br>' +
       '「出す準備」と「次の開発」を<b>同時に進められる</b>ようになります。凍結が無いと、確認の間じゅう全員が手を止めることになります。<br>' +
       '<b>だから、ここに新機能を足すと意味が消えます。</b>足した瞬間、確認をやり直しになるからです。',
  after:'<b>枝が3本になり、あなたはいま <code>release/1.0.0</code> にいます。</b><br>' +
        'ここが大事なところです ——<b><code>develop</code> は止まっていません。</b>いま他の人が <code>develop</code> で次の機能を作り続けても、<b>それはこの <code>release/1.0.0</code> には入ってきません</b>。<br>' +
        '<b>「出す準備」と「次の開発」が、同時に進められる状態</b>になりました。これが凍結の値打ちです。',
  ask:'release ブランチを立てられましたか？',
  tb:[
    { q:'「出す準備の修正」と「新機能」の線引きが分からない',
      a:'<b>1つだけ聞いてください ——「これを入れたら、確認をやり直しますか」</b><br><b>やり直す</b>なら新機能です。次のリリースに回します。<br><b>やり直さない</b>（誤字・色・文言）なら、release の中で直して構いません。' },
    { q:'1.0.0 という数字はどう決めるの？',
      a:'<b>3つの数字に意味があります</b>（セマンティックバージョニング）。<br><b>1</b>.0.0 …… <b>使い方が変わる</b>（前のままでは動かなくなる）<br>1.<b>0</b>.0 …… <b>機能が増えた</b>（前のままでも動く）<br>1.0.<b>0</b> …… <b>不具合を直した</b><br>次の画面で、この番号をタグにします。' }
  ]
},
{
  icon:'icon-github.svg', phase:'8. main とタグ',
  title:'main に出して、タグを打ちます',
  why:'<b>出したら、必ず名札を付けます。</b>付けないと、あとで「どれを出したか」が分からなくなります。',
  todo:{
    common:['<code>main</code> に合流させます（1〜2行目）。<b>ここではじめて、お客さんに出る形になります</b>',
            '<b>タグを打ちます</b>（3行目）。<code>-a</code> は「メモ付きのタグ」という意味です',
            '<b>そして develop にも戻します</b>（4〜5行目）',
            '　<b>release で直した誤字を、develop 側にも反映するため</b>です。忘れがちです',
            'release ブランチを消して（6行目）、タグを確認します（7行目）']
  },
  pre:[
    ['git switch main','<code>main</code> に移ります'],
    ['git merge --no-ff release/1.0.0 -m "Release 1.0.0"','凍結したものを <code>main</code> に取り込みます。<b>ここではじめて、お客さんに出る形</b>になります'],
    ['git tag -a v1.0.0 -m "1.0.0 リリース"','<b>いまの <code>main</code> の位置に、名札を打ちます</b>（<code>-a</code> ＝ メモ付きのタグ）'],
    ['git switch develop','<code>develop</code> に移ります'],
    ['git merge --no-ff release/1.0.0 -m "Merge release/1.0.0 back"','<b>同じものを <code>develop</code> にも入れます。</b>release で直した誤字を、こちらにも反映するためです'],
    ['git branch -d release/1.0.0','凍結の枝は役目を終えたので消します'],
    ['git tag -n1','タグの一覧を、メモ1行付きで表示します']
  ],
  cmdMulti:{
    common:['git switch main',
            'git merge --no-ff release/1.0.0 -m "Release 1.0.0"',
            'git tag -a v1.0.0 -m "1.0.0 リリース"',
            'git switch develop',
            'git merge --no-ff release/1.0.0 -m "Merge release/1.0.0 back"',
            'git branch -d release/1.0.0',
            'git tag -n1']
  },
  cmdlabel:'main へ → タグ → develop へも戻す → 片付ける',
  expect:'<b>タグが1つ出れば成功</b>です。' +
         '<pre><code>v1.0.0          1.0.0 リリース</code></pre>' +
         '<b>release を、main と develop の<u>両方</u>に戻したこと</b>を覚えておいてください。次の画面で、これを忘れるとどうなるかを見ます。',
  note:'<b>タグは、あとで自分を助けます。</b><br>' +
       '障害のとき、上司から聞かれるのはいつも同じです ——<b>「いま本番に出ているのは、どれ？」</b><br>' +
       'タグがあれば <code>git tag</code> の1行で答えられます。無ければ、履歴を1つずつ遡ることになります。',
  after:'<b><code>main</code> が更新され、そこに <code>v1.0.0</code> という名札が付きました。</b>「この時点のものを出した」という記録です。<br>' +
        'そして<b><code>develop</code> にも、同じものを入れました。</b>これを飛ばすと、release で直した誤字が <code>develop</code> 側に残ったままになります。<br>' +
        '<b>戻し先が2つある</b> —— この形は、このあとの hotfix でもう一度出てきます。<b>そちらでは、忘れると事故になります。</b>',
  ask:'v1.0.0 のタグが出ましたか？',
  tb:[
    { q:'タグとブランチは何が違うの？',
      a:'<b>ブランチは進みます。タグは動きません。</b><br><code>main</code> は新しいコミットが入るたびに先へ進みますが、<code>v1.0.0</code> は<b>打った場所に永久に残ります</b>。<br>次の画面で、実際にそこへ戻ってみます。' },
    { q:'-a を付けないタグもあるの？',
      a:'<b>あります</b>（<code>git tag v1.0.0</code>）。ただし<b>誰がいつ打ったかが残りません</b>。<br><b>リリースには <code>-a</code> を使ってください。</b>あとで「これ、いつ出したもの？」に答えられます。' },
    { q:'develop への戻しを飛ばしてもよさそうに見える',
      a:'<b>いま飛ばすと、次の画面の実験が成立しません。</b>そして現場では、これが事故になります。<br>理由は、<b>まさに次の画面で自分の目で見ます。</b>' }
  ]
},
{
  icon:'icon-key.svg', phase:'9. タグの意味',
  title:'タグを打った時点のコードに、戻ってみます',
  visual:'media/tag-vs-branch.svg',
  visualAlt:'ブランチは進むがタグは動かない。タグはそのときのコードに戻るための名札',
  why:'タグの価値は、打ったときではなく<b>「戻して」と言われたとき</b>に分かります。',
  todo:{
    common:['まず <code>develop</code> の <code>app.txt</code> を見ます（1行目）。<b>3行</b>あるはずです',
            '<b>タグの時点に移動します</b>（2行目）。<code>--detach</code> は「見るだけ」という意味です',
            'もう一度 <code>app.txt</code> を見ます（3行目）',
            '<b>戻ります</b>（4行目）。<b>この操作で何も壊れません</b>',
            '　（<code>HEAD is now at ...</code> と出ます。<b>異常ではありません</b>）']
  },
  pre:[
    ['cat app.txt','ファイルの中身を表示します（<code>cat</code> は「中身を出す」道具だと思ってください）'],
    ['git switch --detach v1.0.0','<b>タグが指している時点に移ります。</b><code>--detach</code> は「どの枝にも乗らず、その1点だけを見る」という意味です'],
    ['cat app.txt','<b>その時点の</b>中身を表示します'],
    ['git switch develop','元の場所（<code>develop</code>）に戻ります']
  ],
  cmdMulti:{
    common:['cat app.txt',
            'git switch --detach v1.0.0',
            'cat app.txt',
            'git switch develop']
  },
  cmdlabel:'タグの時点を見て、戻ってくる',
  expect:'<b>2回目の <code>cat</code> で、中身が変わっていれば成功</b>です。' +
         '<pre><code>v1.0.0 の時点   → v1 / 検索機能 / 誤字を直した\nいまの develop  → 同じ3行（まだ差がありません）</code></pre>' +
         '<b>いまは差が出ません。</b>この先で新しいコミットを足すと、差がはっきりします。<b>1コマンドで過去に行けたこと</b>が、この画面の成果です。',
  note:'<b>「先週の金曜のバージョンに戻して」</b>——これは実際によくある依頼です。<br>' +
       'タグがあれば、その一言に<b>1コマンドで応えられます</b>。無ければ、日付から推測して履歴を探すことになります。<br>' +
       '<b>障害対応の最中に、それをやる時間はありません。</b>',
  after:'<b>1コマンドで、過去のある1点に行って、帰ってきました。</b><br>' +
        'いま中身に差が出ないのは、<b><code>v1.0.0</code> 以降にまだ何も足していない</b>からです。<b>次の hotfix のあとに同じことをすると、はっきり差が出ます。</b><br>' +
        '大事なのは中身の差ではなく、<b>「その時点を、名前で呼び出せた」こと</b>です。タグが無ければ、40文字の番号を履歴から探すことになります。',
  ask:'タグの時点に移動して、戻ってこられましたか？',
  tb:[
    { q:'HEAD is now at ... と出た。これは何？',
      a:'<b>壊れていません。「どのブランチにも乗っていない状態」（detached HEAD）になった、という意味</b>です。<br>過去を<b>見るため</b>の状態なので、ここで編集やコミットはしないでください。<code>git switch develop</code> で、いつでも戻れます。' },
    { q:'cat が使えない（Windows）',
      a:'<b>PowerShell でも <code>cat</code> は使えます</b>（<code>Get-Content</code> の別名）。<br>それでも駄目なら、VS Code で <code>app.txt</code> を開いて見てください。<b>やっていることは同じです。</b>' },
    { q:'過去のコードを見るだけなら、他の方法は？',
      a:'<b>移動しなくても見られます。</b><code>git show v1.0.0:app.txt</code> で、そのときのファイルの中身だけが出ます。<br><b>移動より安全なので、実務ではこちらもよく使います。</b>' }
  ]
},
{
  icon:'icon-git.svg', phase:'10. hotfix',
  title:'本番が壊れました。main から直接、切ります',
  visual:'media/hotfix-two-way.svg',
  visualAlt:'hotfixはmainから切り、mainとdevelopの両方に戻す。develop側を忘れると不具合が復活する',
  why:'<b>ここだけが例外です。</b>develop を通さず、main から直接ブランチを切ります。',
  todo:{
    common:['お客さんから連絡が来ました。<b>「ログインできません」</b>。いますぐ直します',
            '<b>develop は使えません。</b>作りかけが入っているので、そのまま出せないからです',
            'だから <code>main</code> から切ります（1行目）。<b>本番と同じ中身から始めるため</b>です',
            '直して（2〜3行目）、<code>main</code> に戻してタグを打ちます（4〜6行目）',
            '<b>そして develop にも戻します</b>（7〜8行目）。<b>ここが、いちばん忘れられます</b>']
  },
  pre:[
    ['git switch -c hotfix/1.0.1 main','<b>起点が <code>main</code> です。</b><code>develop</code> ではありません —— <b>本番と同じ中身から直さないと、そのまま出せない</b>からです'],
    ['echo 緊急修正 >> app.txt','修正を1行入れます'],
    ['git commit -am "ログインできない不具合を修正"','記録します'],
    ['git switch main','<code>main</code> に移ります'],
    ['git merge --no-ff hotfix/1.0.1 -m "Hotfix 1.0.1"','修正を <code>main</code> に取り込みます'],
    ['git tag -a v1.0.1 -m "1.0.1 緊急リリース"','新しい名札を打ちます。<b>不具合の修正なので、3つ目の数字だけ上がります</b>'],
    ['git switch develop','<code>develop</code> に移ります'],
    ['git merge --no-ff hotfix/1.0.1 -m "Merge hotfix/1.0.1 back"','<b>ここが本番です。</b>同じ修正を <code>develop</code> にも入れます'],
    ['git branch -d hotfix/1.0.1','枝を消します'],
    ['git tag -n1','タグの一覧を表示します']
  ],
  cmdMulti:{
    common:['git switch -c hotfix/1.0.1 main',
            'echo 緊急修正 >> app.txt',
            'git commit -am "ログインできない不具合を修正"',
            'git switch main',
            'git merge --no-ff hotfix/1.0.1 -m "Hotfix 1.0.1"',
            'git tag -a v1.0.1 -m "1.0.1 緊急リリース"',
            'git switch develop',
            'git merge --no-ff hotfix/1.0.1 -m "Merge hotfix/1.0.1 back"',
            'git branch -d hotfix/1.0.1',
            'git tag -n1']
  },
  cmdlabel:'main から切って、main と develop の両方へ戻す',
  expect:'<b>タグが2つ並べば成功</b>です。' +
         '<pre><code>v1.0.0          1.0.0 リリース\nv1.0.1          1.0.1 緊急リリース</code></pre>' +
         '<b>不具合の修正なので、3つ目の数字だけが上がりました。</b>',
  note:'<b>hotfix だけが、main から生えます。</b>理由は1つ —— <b>本番と同じ中身から直さないと、直したものをそのまま出せない</b>からです。<br>' +
       'develop から直すと、まだ出していない機能が一緒に付いてきます。<b>緊急のときに、それを一つずつ外す時間はありません。</b>',
  after:'<b>タグが2つになりました</b> —— <code>v1.0.0</code> と <code>v1.0.1</code>。<b>3つ目の数字だけが上がっている</b>のは、機能を足したのではなく<b>不具合を直したから</b>です。<br>' +
        'そして修正は、<b><code>main</code> と <code>develop</code> の両方</b>に入りました。<br>' +
        '<b>この2回目のマージが、この回でいちばん忘れられる操作です。</b>忘れるとどうなるかを、次の画面で実際に起こします。',
  ask:'タグが v1.0.0 と v1.0.1 の2つになりましたか？',
  tb:[
    { q:'develop に戻すのを忘れたら、どうなるの？',
      a:'<b>次の画面で、実際に起こします。</b>ここでは飛ばして構いません。' },
    { q:'hotfix も release ブランチを通すべき？',
      a:'<b>通しません。それが hotfix の意味です。</b>「確認の期間を置く」のが release、「置かずに出す」のが hotfix。<br>だから <b>hotfix は変更を極限まで小さく</b>します。1行で済むなら1行だけ。<b>ついでの修正を混ぜないでください。</b>' },
    { q:'現場で、この判断は自分がするの？',
      a:'<b>最初はしません。必ず先に聞いてください。</b>——<b>「これは hotfix ですか、次のリリースに回しますか」</b><br>この一言が言えるだけで、<b>手順を分かっている人</b>として扱われます。判断そのものは、先輩の仕事です。' }
  ]
},
{
  icon:'icon-key.svg', phase:'11. 事故を、自分で起こす',
  title:'develop に戻し忘れると、何が起きるでしょうか',
  why:'<b>ルールは、破ったときに何が起きるかを見ないと身につきません。</b>安全な場所で、一度起こしてみます。',
  todo:{
    common:['<b>別のフォルダ</b>を作って、わざと「戻し忘れ」を再現します（下の枠をまとめて実行）',
            'やっていることは3つです',
            '　① 本番の不具合を <code>main</code> で直す（<code>&gt;</code> を <code>&gt;=</code> に）。<b>develop には戻さない</b>',
            '　② その間に、別の担当者が <code>develop</code> で<b>同じ行</b>をさわる（古い <code>&gt;</code> のまま）',
            '　③ 次のリリースで、develop を main に入れる',
            '<b>③ で何が起きるでしょうか。</b>予想してから実行してください']
  },
  pre:[
    ['cd ~/Desktop && mkdir gf2 && cd gf2 && git init -b main','<b>別の使い捨てフォルダ</b>を作り、git の管理下に置きます（さっきのフォルダとは分けます）'],
    ['printf \'...age > 18...\' > logic.js','<code>logic.js</code> を作ります。中身は <code>age &gt; 18</code> ——<b>18歳ちょうどが弾かれる不具合</b>です'],
    ['git add . && git commit -m "初版" && git switch -c develop','記録して、<code>develop</code> を作ります'],
    ['git switch -c hotfix main','<b><code>main</code> から</b> hotfix を切ります（本番が壊れた、という想定）'],
    ['printf \'...age >= 18...\' > logic.js','<code>&gt;</code> で<b>上書き</b>して、<code>&gt;=</code> に直します'],
    ['git commit -am "18歳ちょうどが使えない不具合を修正"','その修正を記録します'],
    ['git switch main && git merge --no-ff hotfix -m "Hotfix"','<code>main</code> にだけ入れます。<b>develop には入れません —— ここがわざと作る「抜け」です</b>'],
    ['git switch develop','<code>develop</code> に移ります。<b>ここには修正が入っていません</b>'],
    ['printf \'...age > 18 && !banned...\' > logic.js','<code>develop</code> 側で、別の担当者が<b>古い <code>&gt;</code> のまま</b>別の条件を足します'],
    ['git commit -am "利用停止ユーザーを弾く"','その追加を記録します'],
    ['git switch main && git merge --no-ff develop -m "Release 1.1.0"','<b>次のリリースとして、<code>develop</code> を <code>main</code> に入れます。</b>ここで何が起きるでしょうか']
  ],
  cmdMulti:{
    common:['cd ~/Desktop && mkdir gf2 && cd gf2 && git init -b main',
            'printf \'function canUse(age) {\\n  return age > 18;\\n}\\n\' > logic.js',
            'git add . && git commit -m "初版" && git switch -c develop',
            'git switch -c hotfix main',
            'printf \'function canUse(age) {\\n  return age >= 18;\\n}\\n\' > logic.js',
            'git commit -am "18歳ちょうどが使えない不具合を修正"',
            'git switch main && git merge --no-ff hotfix -m "Hotfix"',
            'git switch develop',
            'printf \'function canUse(age) {\\n  return age > 18 && !banned;\\n}\\n\' > logic.js',
            'git commit -am "利用停止ユーザーを弾く"',
            'git switch main && git merge --no-ff develop -m "Release 1.1.0"']
  },
  cmdlabel:'戻し忘れを、わざと再現する',
  expect:'<b>コンフリクトが起きます。</b>そして中身がこうなります。' +
         '<pre><code>function canUse(age) {\n&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD\n  return age &gt;= 18;          ← 直したもの（main 側）\n=======\n  return age &gt; 18 &amp;&amp; !banned;  ← 新しい機能（develop 側）\n&gt;&gt;&gt;&gt;&gt;&gt;&gt; develop\n}</code></pre>' +
         '<b>ここで「新しい方が正しいだろう」と develop 側を選ぶと、<u>直した不具合がそのまま復活します</u>。</b>' +
         '<b>正解は、両方を合わせた <code>age &gt;= 18 &amp;&amp; !banned</code> です。</b>',
  note:'<b>これがデグレ（直したものが元に戻る事故）です。</b>いちばん怖いのは、<b>誰も嘘をついていない</b>ことです。<br>' +
       'hotfix を書いた人も、機能を足した人も、コンフリクトを解いた人も、それぞれ正しく仕事をしています。<b>手順が1つ抜けただけ</b>です。<br>' +
       '<b>だから手順で守ります。</b>「hotfix は、main と develop の両方に戻す」——これを人の記憶ではなく、決まりにします。',
  after:'<b>コンフリクトが起きました。</b>git は「同じ行が、両側で別々に変わっている」ことに気づき、<b>自動では決められない</b>と言っています。<br>' +
        'ここが分かれ道です。<code>&gt;=</code> は<b>直した結果</b>、<code>&gt; ... &amp;&amp; !banned</code> は<b>新しい機能</b>で、<b>どちらも正しい変更</b>です。<br>' +
        '<b>片方を選ぶと、もう片方が消えます。</b>「新しい方が正しいだろう」で develop 側を選ぶと、<b>直した不具合がそのまま復活します</b>。<br>' +
        '正しい直し方は <code>age &gt;= 18 &amp;&amp; !banned</code> ——<b>両方を合わせること</b>です。<br>' +
        '<b>そして本当の正解は、この状況を作らないこと</b>でした。——hotfix を、<code>develop</code> にも戻しておけば起きません。',
  ask:'コンフリクトを自分の目で見て、原因が「戻し忘れ」だと分かりましたか？',
  tb:[
    { q:'コンフリクトのまま止まってしまった',
      a:'<b>それで構いません。この画面の目的は、直すことではなく見ることです。</b><br>やめるなら <code>git merge --abort</code>。フォルダごと消しても構いません（<b>使い捨てです</b>）。' },
    { q:'printf の行が長くて、うまく貼れない',
      a:'<b>この画面は、読むだけでも成立します。</b>上の「こうなれば成功です」に、実際の結果を載せてあります。<br>手を動かすなら、VS Code で <code>logic.js</code> を作り、中身を書き換えながら同じ順番でコミットしても同じです。' },
    { q:'どうすれば、この事故を防げますか',
      a:'<b>3つあります。人の注意力に頼らない順に。</b><br>① <b>hotfix を閉じる手順を、チェックリストにする</b>（main / develop / タグ の3つ）<br>② <b>develop に自動テストを置く</b>。直した不具合のテストが残っていれば、復活した瞬間に赤くなります<br>③ <b>コンフリクトを解いた人が、必ず「両方の意図」を確認する</b>。片方を選ぶのではなく、合わせられないかを先に考える' }
  ]
},
{
  icon:'icon-ai.svg', phase:'12. 判断',
  title:'このバグ修正、どこに入れますか',
  visual:'media/bugfix-where.svg',
  visualAlt:'バグ修正をどのブランチに入れるかの判断表。急ぎかどうかで3つに分かれる',
  why:'<b>現場で実際に迷うのは、ここです。</b>「バグを直しました。どこに入れますか」に答えられるようにします。',
  todo:{
    common:['<b>次の3つは、それぞれどこから切って、どこへ戻しますか。</b>紙かメモ帳に書いてください',
            '　<b>A</b> 決済が失敗する。お客さんから問い合わせが来ている',
            '　<b>B</b> 明日リリースの画面で、ボタンの文言が間違っている（release を切ったあと）',
            '　<b>C</b> 検索結果の並び順が変。急ぎではないと言われた',
            '<b>3つとも書いてから</b>、上の図と下の答えを見てください']
  },
  expect:'<b>A → hotfix</b>（<code>main</code> から切り、<b>main と develop の両方</b>へ。タグも打つ）<br>' +
         '<b>B → release ブランチの中で直す</b>（閉じるときに、main と develop の両方へ入ります）<br>' +
         '<b>C → develop から切る</b>（<code>develop</code> にだけ戻す。main には触らない）<br>' +
         '<b>3つとも合っていなくて構いません。</b>——<b>判断の軸が1つだと分かれば十分</b>です。',
  note:'<b>迷ったときに聞くのは、いつも同じ1つです。</b><br>' +
       '<b>「これは、いますぐ出さないといけませんか」</b><br>' +
       'はい → hotfix ／ 出す直前のものに含める → release ／ いいえ → develop。<b>ブランチの名前ではなく、急ぎ具合で決まります。</b>',
  ask:'3つの行き先を、自分で書いてから答え合わせしましたか？',
  tb:[
    { q:'B が難しい。release に入れていいの？',
      a:'<b>入れていいものと、いけないものの線引きが必要です。</b>4番目の画面で使った質問がそのまま効きます ——<b>「これを入れたら、確認をやり直しますか」</b><br>文言の直しなら、やり直しません。だから release の中で直します。' },
    { q:'A なのか C なのか、自分では判断できない',
      a:'<b>判断しなくて構いません。聞いてください。</b><br>ただし、<b>丸投げにしない聞き方</b>があります ——「決済が失敗する件、<b>問い合わせが来ているので hotfix かと思いました</b>が、いかがですか」。<br><b>自分の見立てを添えると、返事が速くなります。</b>' },
    { q:'現場によって答えが違いそう',
      a:'<b>違います。</b>とくに B は、チームによって「release で直す」「develop で直して取り込む」に分かれます。<br><b>だから初日に聞いてください</b> ——「<b>緊急の修正と、リリース直前の修正は、どのブランチで直していますか</b>」。<b>この質問ができる新人は、かなり珍しいです。</b>' }
  ]
},
{
  icon:'icon-key.svg', phase:'13. 境界', readonly:true,
  title:'やっていいこと、原則やってはいけないこと',
  visual:'media/gitflow-rules.svg',
  visualAlt:'Git-Flowでやっていいことと、原則やってはいけないこと',
  why:'ここまでの手順を、<b>1枚に畳みます。</b>覚えるのは数ではなく、<b>どれも同じ理由から出ている</b>ということです。',
  todo:{
    common:['<b>やってはいけない側は、すべて同じ1つの理由から出ています</b>',
            '　<b>「出せるもの」と「作りかけ」が混ざる</b>、あるいは<b>混ざったことに気づけなくなる</b>',
            '<code>main</code> に直接コミット → 誰も確認していないものが本番に載る',
            '<code>release</code> に新機能 → 凍結の意味が消え、いつまでも出せない',
            'hotfix の戻し忘れ → <b>前の画面で見たとおり</b>、直した不具合が復活する',
            '長生きする feature → コンフリクトの大きさは、<b>日数で決まります</b>']
  },
  expect:'<b>「原則」と書いてある意味が分かれば十分</b>です。——<b>破っていい場面もありますが、破ったと分かっていて破る</b>のと、知らずに破るのは別物です。',
  note:'<b>新人が最初に怒られるのは、たいてい main への直接コミットです。</b><br>' +
       '<b>防ぎ方があります。</b>GitHub の <b>Settings → Branches</b> で <code>main</code> を保護すると、直接 push できなくなります。<br>' +
       '<b>ルールを人の記憶に置かず、仕組みに置く。</b>これはテストの回と同じ考え方です。',
  ask:'「やってはいけない」の理由が、全部つながって見えましたか？',
  tb:[
    { q:'ブランチを消すのが、もったいなく感じる',
      a:'<b>消しても、作業は1行も消えません。</b>合流した時点で、コミットは履歴に入っています。<br>消えるのは<b>名札だけ</b>です。名札が残り続けると、一覧が数十本になって<b>いま生きている作業が見えなくなります</b>。' },
    { q:'main を保護すると、自分も push できなくなるのでは？',
      a:'<b>そのとおりで、それが目的です。</b>プルリクエストを経由してだけ入るようになります。<br>個人の練習リポジトリでは不要ですが、<b>チームでは、ほぼ必ず設定されています</b>。「push できません」と出たら故障ではなく、<b>設計どおり</b>です。' },
    { q:'原則を破っていい場面って、たとえば？',
      a:'<b>本番が落ちていて、1分でも早く戻したいとき</b>などです。手順を飛ばす判断が正しいこともあります。<br>ただし<b>それは、判断できる人がやること</b>です。そして必ず、<b>あとから履歴を整える</b>作業がついてきます。<b>タダでは飛ばせません。</b>' }
  ]
},
{
  icon:'icon-ai.svg', phase:'14. 限界', readonly:true,
  title:'大きな作り直しが始まったら、Git-Flow は壊れます',
  visual:'media/long-branch.svg',
  visualAlt:'大きな改修が並走したときにGit-Flowが壊れる理由と、3つの現実解',
  why:'<b>Git-Flow は万能ではありません。</b>いちばん壊れるのが、この場面です。',
  todo:{
    common:['<b>「画面を全部作り直す」</b>ような話が来たとします。3か月かかります',
            '素直にやると <code>feature/renewal</code> を1本立てて、3か月そこで作業することになります',
            '　その間も <code>develop</code> は進み続けます。<b>合流しないまま、離れていきます</b>',
            '　最後に合流しようとすると、<b>数百のコンフリクト</b>が一度に出ます。誰も判断できません',
            '<b>現実的な手は3つです。</b>上の図の順に検討します',
            '　① <b>分けない</b>（スイッチで隠す）　② <b>週に一度は取り込む</b>　③ <b>Git-Flow をやめる</b>']
  },
  expect:'<b>「長く分けるほど、合流が高くつく」</b>と分かれば十分です。<b>Git-Flow でも、この法則からは逃げられません。</b>',
  note:'<b>①のスイッチ（フィーチャーフラグ）が、いま一番よく使われます。</b>新しい画面も develop に入れてしまい、<code>if (新しい画面を使う)</code> で隠します。<br>' +
       '<b>合流を「最後の1回の大事故」から「毎日の小さな作業」に変える</b>——これが発想の中身です。<br>' +
       '<b>そして③も、恥ではありません。</b>いま主流は <code>main</code> 1本＋短命ブランチ（GitHub Flow）です。<b>Git-Flow は、リリース日が決まっている製品のための形</b>です。',
  ask:'長いブランチが、なぜ危ないのか分かりましたか？',
  tb:[
    { q:'スイッチで隠すと、未完成のコードが本番に入りませんか',
      a:'<b>入ります。そこが怖いところであり、狙いでもあります。</b><br>入っていても<b>オフなら誰にも見えません</b>。そして<b>毎日合流しているので、大事故が起きません</b>。<br>代わりに必要なのは、<b>スイッチを消す作業を忘れないこと</b>です。放置すると、条件分岐だらけになります。' },
    { q:'どの形を使うかは、誰が決めるの？',
      a:'<b>あなたが決める場面は、当分ありません。</b>参画したら、そこの形に合わせます。<br>ただし<b>初日に聞いておくと、動きが変わります</b> ——「<b>ブランチはどう運用していますか。main に直接入れることはありますか</b>」。' },
    { q:'GitHub Flow との違いを、ひとことで言うと？',
      a:'<b>Git-Flow は「リリース日がある」前提、GitHub Flow は「できたら出す」前提</b>です。<br>スマホアプリのように<b>審査があって出す日が決まる</b>ものは Git-Flow 寄り、Webサービスのように<b>1日に何度も出せる</b>ものは GitHub Flow 寄りになります。<b>優劣ではなく、出し方の違いです。</b>' }
  ]
},
{
  icon:'icon-github.svg', phase:'15. 実例', readonly:true,
  title:'では、いま実際は何が使われているのでしょうか',
  visual:'media/oss-flows.svg',
  visualAlt:'Node.js・Kubernetes・Rustの実際のブランチ運用。3つともdevelopを持たない',
  visual2:'media/oss-terms.svg',
  visual2Alt:'開発フローで出てくる専門用語の、やさしい言い換え一覧',
  why:'<b>有名なソフトが、実際に何をしているかを見ます。</b>ここに載せた3つは、公開されている手順書を読んで確かめたものです。',
  todo:{
    common:['<b>Node.js</b> …… <code>main</code> ＋ <code>v22.x</code>（そのバージョンを<b>何年も保守し続ける枝</b>）',
            '　この長生きする枝を <b>LTS</b>（long-term support ＝ <b>長期サポート</b>）と呼びます',
            '<b>Kubernetes</b> …… <code>main</code> ＋ <code>release-1.30</code>',
            '　<b>コードフリーズ</b>（＝<b>新しい機能を入れるのをやめる日</b>）の前に枝を作り、そのあとは<b>チェリーピック</b>だけ',
            '　<b>チェリーピック</b>＝他の枝から<b>コミットを1つだけ摘んで持ってくる</b>こと（<code>git cherry-pick</code>）',
            '<b>Rust</b> …… <code>nightly</code> →〈6週間〉→ <code>beta</code> →〈6週間〉→ <code>stable</code>',
            '　出す日を先に決め、<b>間に合ったものだけ乗せる</b>やり方を<b>リリーストレイン</b>（電車の時刻表）と呼びます',
            '<b>気づきましたか。3つとも <code>develop</code> を持っていません。</b>']
  },
  expect:'<b>「develop が無い」ことに気づけば十分</b>です。<br>' +
         '<b>main そのものが develop の役</b>をしています。作りかけは <code>main</code> ではなく、<b>プルリクエストの中</b>にあります。',
  note:'<b>紛らわしい点を1つ。</b>Git-Flow の <code>release/1.0.0</code> と、ここに出てくる <code>release-1.30</code> や <code>v22.x</code> は、<b>名前は似ていても別物</b>です。<br>' +
       '<b>Git-Flow の release</b> …… 出す直前の<b>短い凍結</b>。出したら消す<br>' +
       '<b>OSS の release ブランチ</b> …… そのバージョンを<b>何か月・何年も保守し続ける長い枝</b>。消さない<br>' +
       '<b>「release」と聞いたら、どちらの意味か確かめてください。</b>',
  ask:'3つとも develop を持っていないことに、気づけましたか？',
  tb:[
    { q:'develop が無いなら、作りかけはどこに置くの？',
      a:'<b>プルリクエスト（PR）の中です。</b>自分のブランチで作り、PR を出し、<b>確認が通ったものだけ <code>main</code> に入ります</b>。<br>つまり <b>PR そのものが、develop の代わりの「隔離場所」</b>になっています。<br>PR の仕組みが無かった時代（Git-Flow が書かれたのは2010年です）は、その隔離をブランチでやるしかありませんでした。<b>道具が変わったので、形も変わりました。</b>' },
    { q:'nightly / beta / stable って何？',
      a:'<b>同じソフトの「熟し具合」が違う3つの出口</b>です。<br><b>nightly</b>（ナイトリー）…… <b>毎晩</b>自動で作られる最新版。壊れていることもある<br><b>beta</b>（ベータ）…… 出す1つ手前。<b>重大な不具合の修正しか受け付けない</b><br><b>stable</b>（ステーブル）…… <b>安定版</b>。ふつうの人が使うのはこれ<br>Rust はこの3つを、6週間ごとに1段ずつ押し出しています。' },
    { q:'Node.js が「GitHubの緑のマージボタンを使うな」と書いているのはなぜ？',
      a:'<b>履歴の形を、自分たちで決めたいからです。</b>ボタンで入れると形が揃わないので、専用のツールで <b>squash</b>（スカッシュ ＝ <b>たくさんのコミットを1つに潰す</b>）してから入れています。<br><b>あなたの現場でも、ボタンの設定が決まっていることがあります。</b>「Squash and merge だけ有効」のようにです。<b>勝手に変えないでください。</b>' },
    { q:'ここに書いてあることは、確かめたもの？',
      a:'<b>はい。3つとも、公開されている手順書を読んで確認しました。</b><br>Node.js は <code>doc/contributing/collaborator-guide.md</code>、Kubernetes は <code>sig-release</code> のリリース工程の文書、Rust は公式のリリース手順です。<br><b>ただし、こうした手順は変わります。</b>案件で使うときは、<b>そのチームの手順書を読んでください。</b>' }
  ]
},
{
  icon:'icon-key.svg', phase:'16. 共通点', readonly:true,
  title:'バラバラなのに、同じことを守っています',
  visual:'media/oss-common.svg',
  visualAlt:'3つのプロジェクトが別々に気にしていることと、共通していること',
  why:'<b>3つが気にしていることは、まったく違います。</b>それでも、守っているものは同じです。',
  todo:{
    common:['<b>Node.js</b> が気にしているのは <b>「古い版を使い続ける人を、置き去りにしない」</b>',
            '<b>Kubernetes</b> が気にしているのは <b>「出す直前に、入り口を狭める」</b>',
            '<b>Rust</b> が気にしているのは <b>「出す日を、先に決めてしまう」</b>',
            '<b>それでも、3つに共通することがあります</b>',
            '　① <code>main</code> は、いつでも出せる状態　② 作りかけは PR の中にしかない　③ 出したものには名前が付く',
            '<b>これは、1回目の画面で見たものと同じです</b> ——「出せるもの」と「作りかけ」を混ぜない']
  },
  expect:'<b>枝の数が違っても、守っているものは同じ</b>だと分かれば十分です。<br>' +
         '<b>フローは「覚えて当てはめるもの」ではなく、「守りたいものから決まるもの」</b>です。',
  note:'<b>そして、いまの主流の形はこう呼ばれます。</b><br>' +
       '<b>トランクベース</b>（trunk-based ＝ <b>幹（みき）1本</b>。枝は作るが、すぐ幹に戻す）。<b>Git-Flow とは、発想の順番が逆</b>です。<br>' +
       'Git-Flow は<b>先に枝を全部そろえる</b>。トランクベースは<b>1本から始めて、必要な分だけ足す</b>。<br>' +
       '<b>だから Node.js も Kubernetes も、足したのは「出したあとを保守する枝」だけ</b>でした。',
  ask:'枝の数が違っても、守っているものは同じだと分かりましたか？',
  tb:[
    { q:'トランクベースって、要は Git-Flow をやらないこと？',
      a:'<b>「やらない」ではなく「短くする」です。</b>枝は作ります。ただし<b>1〜2日で幹に戻す</b>のが前提です。<br>思い出してください——<b>コンフリクトの大きさは、日数で決まります</b>。トランクベースは、その日数をひたすら短くする作戦です。' },
    { q:'「継続的デリバリ」という言葉をよく聞く',
      a:'<b>いつでも出せる状態を、常に保っておくこと</b>です（continuous delivery、略して CD）。<br><b>「出す日」を特別な日にしない</b>、という考え方です。毎日出せるなら毎日出します。<br>これができる前提だと、<code>develop</code> も長い <code>release</code> も要らなくなります。<b>だから主流が変わりました。</b>' },
    { q:'結局、自分は何を覚えればいいの？',
      a:'<b>形の名前ではなく、この3つです。</b><br>① <code>main</code> に作りかけを入れない<br>② 自分のブランチを長生きさせない<br>③ 出したものには名前（タグ）を付ける<br><b>この3つを守っていれば、どの現場の形にも乗れます。</b>' },
    { q:'うちの現場が、どれにも当てはまらない気がする',
      a:'<b>よくあります。ほとんどの会社は、教科書どおりではありません。</b>「Git-Flow のつもりだけど release は使っていない」といった形が普通です。<br><b>だから名前を当てにいかず、こう聞いてください</b> ——「<b>作りかけは、どこに置きますか</b>」「<b>本番に出ているものは、どこを見れば分かりますか</b>」。<b>この2つで、その現場の形はだいたい分かります。</b>' }
  ]
},
{
  kind:'fin',
  emoji:'🌊',
  title:'「どのブランチに入れますか」に、答えられるようになりました',
  lead:'ブランチの名前を覚えたのではありません。<br>' +
       '<b>チームが何を守ろうとしているのかが、見えるようになりました。</b>',
  gained:'main と develop を分ける理由が言える／feature を切って戻して消せる／release の「凍結」の意味が言える／タグを打って、その時点に戻れる／hotfix を main と develop の両方に戻せる／戻し忘れの事故を自分で再現した／バグ修正の行き先を急ぎ具合で判断できる／長いブランチが危ない理由が言える／いま主流の形（トランクベース）と、有名なソフトの実例が言える',
  criteria:[
    '<b>「なぜ main と develop を分けるのか」に、自分の言葉で答えられる</b>（混ぜないため）',
    '<b>バグ修正を渡されたとき、「これは、いますぐ出すものですか」と聞ける</b>',
    '<b>hotfix を閉じるとき、戻し先が2つ（main と develop）あることを忘れない</b>',
    '<b>形の名前ではなく、3つを覚えている</b>（main に作りかけを入れない／自分のブランチを長生きさせない／出したものにタグを付ける）',
    '<b>「うちはどう運用していますか」を、参画初日に聞ける</b>',
  ],
  transfer:'<b>この回で作ったフォルダは、もう消して構いません。</b>（デスクトップの <code>gitflow-practice</code> と <code>gf2</code>）<br>' +
    '<b>持ち帰るのは手順ではなく、質問です。</b>参画したら初日にこう聞いてください ——<b>「ブランチはどう運用していますか。main に直接入れることはありますか」</b>。<br><b>形の名前が返ってこなくても困りません。</b>そのときはこう聞きます ——<b>「作りかけは、どこに置きますか」「本番に出ているものは、どこを見れば分かりますか」</b>。<br>' +
    '<b>自分の題材でやるなら</b>、<a href="loop.html" target="_blank" rel="noopener">毎週まわす回</a>で <code>main</code> を保護し、必ずプルリクエスト経由にするところから始めてください。',
  note:'<b>覚えることは、結局これだけです。</b><br>' +
       '<b>「出せるもの」と「作りかけ」を混ぜない。</b>ブランチの名前は、そのための道具にすぎません。<br>' +
       '現場の形が違っても、聞くことは同じです ——<b>「これは、いますぐ出すものですか」</b>。',
  nextHref:'index.html#/graduation',
  nextLabel:'最終チェックへ'
}
]};
