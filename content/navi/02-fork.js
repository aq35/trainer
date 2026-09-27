// 第2回 フォークして手元に持ってくる — 1画面に1つずつ進むナビの中身。
// 書き方は design/curriculum.md の「3. 書き方の約束」。出力は content/runs/02-fork.mjs を実際に打って得たもの。
import { pg, ref, gh } from '../refs.js';

export const title = '第2回 フォークして手元に持ってくる';

export default {
key:'trainer-v2-02',
greeting:'この回で、<b>練習の場所</b>を用意します。この教材のリポジトリを、あなたの GitHub のアカウントにコピー（<b>フォーク</b>）し、それをパソコンに持ってきます（<b>クローン</b>）。',

common:[
  { when:'cmd', q:'command not found / is not recognized と出た',
    a:'コマンドが見つからない、という意味です。打ち間違い（スペルと半角スペース）を確かめてください。<code>git</code> で出るときは、第1回の「Git を入れます」に戻ってください。' },
  { when:'cmd', q:'fatal: not a git repository と出た',
    a:'いまいる場所が、Git のリポジトリの中ではない、という意味です。VS Code で <b>trainer フォルダを開いているか</b>、ターミナルのいちばん下の行に <code>trainer</code> が含まれているかを確かめてください。' }
],

steps:[
{
  icon:'icon-github.svg', phase:'1. 何をするか', readonly:true,
  title:'フォークは GitHub の上で、クローンはパソコンへ',
  why:'この回でやる2つのことを、先に図で見ておきます。',
  visual:'media/fork-clone.svg',
  visualAlt:'本家のリポジトリを GitHub の上でフォークすると、あなたのアカウントにコピーができる。それを git clone で手元に持ってくる。git push は、あなたのフォークにだけ届き、本家には届かない',
  expect:'<b>フォーク</b>は GitHub の上で、あなたのアカウントにリポジトリのコピーを作ること。<b>クローン</b>は、そのリポジトリをパソコンに持ってくること、と分かれば大丈夫です。',
  note:'この先、あなたがプッシュ（<code>git push</code>）して送る先は、<b>あなたのフォークだけ</b>です。本家（この教材）には届きません。',
  ask:'フォークとクローンの違いが、図で分かりましたか？',
  ref:[gh.fork, pg.clone],
  tb:[
    { q:'なぜ本家を直接クローンしないの？',
      a:'本家を直接クローンしても練習はできますが、<b>プッシュする先が無くなります</b>（本家には、あなたは書き込めません）。自分のフォークなら、第3回から自分の変更をプッシュして、GitHub の上で確かめられます。' }
  ]
},
{
  icon:'icon-key.svg', phase:'1. 何をするか', readonly:true,
  title:'あなたのフォークは、公開されます',
  why:'始める前に、1つだけ知っておいてください。',
  expect:'次の2つを知ったうえで進められれば大丈夫です。<br>・<b>公開のリポジトリをフォークすると、フォークも公開になる</b>。フォークだけを非公開にはできない<br>・<b>フォークを消しても、プッシュした中身が見られる状態で残ることがある</b>',
  note:'どちらも GitHub Docs に書かれていることです（根拠のリンクの「Visibility of forks」の節）。<br>だから、練習で書くファイルには<b>名前・住所・メールアドレスなどの個人情報を書かない</b>でください。',
  ask:'練習のファイルに個人情報を書かない、と決めましたか？',
  ref:[gh.forks],
  tb:[
    { q:'公開されるのが嫌だ',
      a:'この教材のやり方（フォーク）では、公開は避けられません。<b>非公開で練習したい場合</b>は、GitHub で自分用の非公開リポジトリを新しく作る方法がありますが、この教材の手順とは違うものになります。' }
  ]
},
{
  icon:'icon-github.svg', phase:'2. フォーク',
  title:'この教材のリポジトリを、フォークします',
  why:'GitHub の画面で、ボタンを押して行います。',
  todo:{
    common:['GitHub にサインインした状態で、<a href="https://github.com/aq35/trainer" target="_blank" rel="noopener">github.com/aq35/trainer</a> を開きます',
            '右上のほうにある <b>Fork</b> を押します',
            '次の画面で、Owner が<b>あなたのユーザー名</b>になっていることを確かめ、<b>Create fork</b> を押します']
  },
  expect:'ページの左上に <b>あなたのユーザー名 / trainer</b> と出て、その下に「forked from aq35/trainer」と出ます。',
  note:'ボタンの場所の写真は、根拠の GitHub Docs にあります。<b>画面の見た目は時期によって変わる</b>ので、この教材には写真を載せていません。',
  ask:'あなたのユーザー名の trainer ができましたか？',
  ref:[gh.fork],
  tb:[
    { q:'Fork のボタンが押せない・見つからない',
      a:'サインインしていないと押せません。右上にあなたのアイコンが出ているか確かめてください。画面が狭いと、ボタンがメニューの中に隠れていることがあります。' },
    { q:'もうフォークしたか分からない',
      a:'GitHub の右上のアイコン → <b>Your repositories</b> を開き、<b>trainer</b> があるか見てください。あれば、それがあなたのフォークです（名前の下に「forked from aq35/trainer」と出ます）。新しく作らず、それを使います。' }
  ]
},
{
  icon:'icon-github.svg', phase:'2. フォーク',
  title:'あなたのフォークの URL を写します',
  why:'クローンするときに、<b>どこから持ってくるか</b>を URL で指定します。',
  todo:{
    common:['<b>あなたのフォークのページ</b>（左上が あなたのユーザー名 / trainer）で、緑色の <b>Code</b> ボタンを押します',
            '<b>HTTPS</b> のタブを選び、URL の右のコピーのボタンを押します',
            'URL が <code>https://github.com/あなたのユーザー名/trainer.git</code> の形であることを確かめます']
  },
  expect:'URL の中に <b>あなたのユーザー名</b>が入っています。<code>aq35</code> ではありません。',
  note:'<code>aq35</code> の URL をクローンすると、本家を持ってくることになり、第3回でプッシュできません。<b>ここがいちばん間違えやすい所です。</b>',
  ask:'URL の中に、あなたのユーザー名が入っていますか？',
  ref:[gh.clone],
  tb:[
    { q:'SSH や GitHub CLI のタブもある',
      a:'この教材では <b>HTTPS</b> を使います。SSH は鍵の準備が要るため、この教材の範囲に入れていません。' }
  ]
},
{
  icon:'icon-terminal.svg', phase:'3. クローン',
  title:'フォークを、パソコンにクローンします',
  why:'VS Code のターミナルで打ちます。2行目の URL は、<b>前の画面で写したもの</b>に置き換えます。',
  pre:[
    ['cd ~', '<code>cd</code> は、ターミナルのいまいる場所を移すコマンドです。<code>~</code> は<b>あなたのユーザーのフォルダ（ホーム）</b>を表します。ここに trainer フォルダを作ります'],
    ['git clone https://github.com/あなたのユーザー名/trainer.git', '指定した URL のリポジトリを、<b>履歴ごと</b>持ってきて、同じ名前（trainer）のフォルダを作ります']
  ],
  cmdMulti:{ common:['cd ~', 'git clone https://github.com/あなたのユーザー名/trainer.git'] },
  cmdlabel:'URL を置き換えてから打つコマンド',
  out:['cd-home', 'clone'],
  expect:'<code>Cloning into \'trainer\'...</code> と出て、最後に次の行が打てる状態に戻ります。',
  after:'下の出力は、手元でこの手順を再現したものです。<b>GitHub から持ってくると、このあとに <code>remote:</code> や <code>Receiving objects</code> で始まる行が数行続きます。</b>取ってきている途中の様子なので、最後まで待てば大丈夫です。<br><code>Cloning into \'trainer\'</code> は「trainer というフォルダに、クローンしています」という意味です。',
  ask:'Cloning into \'trainer\'... と出て、エラーなく終わりましたか？',
  ref:[pg.clone, ref.clone, gh.clone],
  tb:[
    { q:'fatal: destination path \'trainer\' already exists と出た',
      a:'同じ場所に、すでに trainer というフォルダがあります。前にクローンしたものなら、それを使って次に進んでください。' },
    { q:'Repository not found と出た',
      a:'URL が違う可能性が高いです。<b>あなたのユーザー名</b>が正しく入っているか、前の画面に戻って写し直してください。' },
    { q:'サインインを求められた',
      a:'公開のリポジトリのクローンでは、ふつうは求められません。<b>URL が合っているか</b>、前の画面に戻って確かめてください。' }
  ]
},
{
  icon:'icon-folder.svg', phase:'3. クローン',
  title:'クローンした trainer フォルダを、VS Code で開きます',
  why:'この先は、ずっとこのフォルダの中で練習します。',
  todo:{
    common:['VS Code のメニューから「ファイル」→「フォルダーを開く」を選びます',
            'ユーザーのフォルダ（ホーム）の中の <b>trainer</b> を選んで開きます',
            '「このフォルダー内のファイルの作成者を信頼しますか？」と聞かれたら、この教材のリポジトリなので「はい」を選びます',
            '「ターミナル」→「新しいターミナル」で、ターミナルを出し直します']
  },
  expect:'VS Code の左側に <b>TRAINER</b> と出て、ファイルの一覧が並びます。ターミナルの行に <code>trainer</code> が含まれています。',
  ask:'trainer フォルダを開いて、ターミナルを出せましたか？',
  tb:[
    { q:'ホームのフォルダがどこか分からない',
      a:'Windows ではふつう <code>C:\\Users\\あなたのユーザー名</code>、Mac ではユーザー名の家のアイコンのフォルダです。ターミナルで <code>cd ~</code> のあとに <code>pwd</code> を打つと、場所が表示されます。' }
  ]
},
{
  icon:'icon-git.svg', phase:'4. 状態を見る',
  title:'いまの状態を、Git に聞きます',
  why:'<code>git status</code> は、この教材でいちばん多く打つコマンドです。<b>迷ったら、まずこれ</b>です。',
  pre:[['git status', '<b>いまの状態を表示</b>します。どのブランチにいるか、変更したファイルがあるか。何も変えません']],
  cmd:'git status',
  cmdlabel:'打つコマンド',
  out:'status-clean',
  expect:'<code>nothing to commit, working tree clean</code> と出ます。',
  after:'1行ずつ、こう読みます。<br>・<code>On branch main</code> … いま <b>main</b> というブランチにいます（ブランチは第9回で扱います）<br>・<code>Your branch is up to date with \'origin/main\'.</code> … GitHub のフォーク（<code>origin</code>）と、同じところまで持っています<br>・<code>nothing to commit, working tree clean</code> … <b>作業ディレクトリ</b>（いま開いている trainer フォルダの中身）に、まだ何も変更がありません',
  ask:'working tree clean と出ましたか？',
  ref:[pg.status, ref.status],
  tb:[
    { q:'fatal: not a git repository と出た',
      a:'trainer フォルダの外にいます。前の画面に戻って、VS Code で trainer フォルダを開き、ターミナルを出し直してください。' }
  ]
},
{
  icon:'icon-git.svg', phase:'4. 状態を見る',
  title:'この教材の、本物の履歴を見ます',
  why:'クローンすると、ファイルだけでなく<b>履歴（これまでのコミット）も全部</b>持ってきます。',
  pre:[['git log --oneline -5', 'コミットの履歴を、<b>新しい順に5件</b>、1件1行で表示します（<code>--oneline</code> ＝1行ずつ、<code>-5</code> ＝5件）']],
  cmd:'git log --oneline -5',
  cmdlabel:'打つコマンド',
  out:'log-5',
  expect:'英数字7文字と、日本語の説明の行が5行出ます。',
  after:'1行が1つの<b>コミット</b>です。左の英数字は<b>コミットを見分ける番号</b>（ハッシュ）の先頭、右はコミットした人が書いた説明（コミットメッセージ）です。いちばん上の行の <code>(HEAD -&gt; main, …)</code> は、そのコミットを指している名前です（第6回と第9回で読みます）。<br>下の出力は、この教材が作られた途中の時点のものです。<b>あなたの画面では、いちばん上に、もっと新しいコミットが並んでいます。</b>この教材を作った人の、本物の履歴です。',
  ask:'5行の履歴が出ましたか？',
  ref:[pg.log, ref.log],
  tb:[
    { q:'画面が止まって、下に : が出ている',
      a:'表示が画面に収まらず、続きを待っている状態です。<span class="k">q</span> を押すと戻ります。' }
  ]
},
{
  icon:'icon-github.svg', phase:'4. 状態を見る',
  title:'どこから持ってきたかを、Git に聞きます',
  why:'Git は、クローンした元の場所を覚えています。第3回で、ここにプッシュします。',
  pre:[['git remote -v', 'このリポジトリが覚えている<b>リモート</b>（GitHub などの、ほかの場所にあるリポジトリ）の名前と URL を表示します']],
  cmd:'git remote -v',
  cmdlabel:'打つコマンド',
  out:'remote',
  expect:'<code>origin</code> のあとに、<b>あなたのフォークの URL</b>が2行出ます。',
  after:'<code>origin</code> は、クローンした元に Git が自動で付ける<b>名前</b>です。<code>(fetch)</code> は持ってくるとき、<code>(push)</code> は送るときの行き先です。<br>どちらも<b>あなたのフォーク</b>になっていれば、準備は完了です。',
  ask:'origin の URL に、あなたのユーザー名が入っていますか？',
  ref:[pg.remotes, ref.remote],
  tb:[
    { q:'URL が aq35/trainer になっている',
      a:'本家をクローンしています。このままでは第3回でプッシュできません。trainer フォルダを消してから、<b>あなたのフォークの URL</b>で、クローンからやり直してください（まだ何も変更していないので、消しても失うものはありません）。' }
  ]
},
{
  icon:'icon-folder.svg', phase:'5. 決めごと', readonly:true,
  title:'練習で触るのは、practice/ の中だけにします',
  why:'このリポジトリには、教材そのもののファイルが入っています。',
  expect:'第3回から、<code>practice</code> というフォルダを作り、<b>その中のファイルだけ</b>を作ったり変えたりします。',
  note:'ほかのファイルを変えると、教材の画面を作るための仕組み（ビルド）が壊れることがあります。<br>うっかり変えてしまっても、<b>第7回で戻し方をやります</b>。怖がらなくて大丈夫です。',
  ask:'practice/ の中だけで練習する、と分かりましたか？',
  tb:[]
},
{
  kind:'fin',
  title:'練習の場所ができました',
  lead:'この教材のリポジトリを、あなたのアカウントにフォークし、パソコンにクローンしました。',
  gained:'<code>git status</code> で状態を、<code>git log</code> で履歴を、<code>git remote -v</code> で行き先を、<b>Git に聞いて</b>確かめられるようになりました。',
  criteria:[
    'GitHub に <b>あなたのユーザー名 / trainer</b> がある',
    'パソコンの trainer フォルダで <code>git status</code> を打つと、<code>working tree clean</code> と出る',
    '<code>git remote -v</code> の URL に、あなたのユーザー名が入っている'
  ],
  deepenWhy:'クローンしたとき、パソコンには何ができたのでしょうか。<b>AI に説明させて、そのあと実物を見て確かめます。</b>',
  deepen:'git clone をすると、フォルダの中に .git というフォルダができるそうです。\n.git の中には何が入っていて、trainer フォルダのほかのファイルとは何が違いますか。初心者向けに5行で説明してください。\nそのあと、私が自分の目で確かめるには、どのコマンドを打てばよいかも教えてください（何も変えないコマンドだけにしてください）。',
  ref:[pg.clone],
  readNext:{ md:'why-git', label:'なぜ Git が生まれたのか', sub:'いま見た「履歴」が、なぜ大事にされるのか' },
  nextHref:'03-first-commit.html',
  nextLabel:'次: 第3回 最初のコミット'
}
]};
