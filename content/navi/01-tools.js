// 第1回 道具をそろえる — 1画面に1つずつ進むナビの中身。
// 書き方は design/curriculum.md の「3. 書き方の約束」。出力は content/runs/01-tools.mjs を実際に打って得たもの。
import { pg, ref, gh, vs } from '../refs.js';

export const title = '第1回 道具をそろえる';

export default {
key:'trainer-v2-01',
greeting:'この回で、<b>Git を使う準備</b>をします。VS Code・Git・GitHub のアカウントの3つです。<br>コマンドは、画面のコピーボタンで写して打てば大丈夫です。<b>打つ前に、その行が何をするかを必ず読んでから</b>打ちます。',

common:[
  { when:'cmd', q:'command not found / is not recognized と出た',
    a:'その名前のコマンドが見つからない、という意味です。多いのは次の2つです。<br>① 打ち間違い（スペルと、単語の間の<b>半角スペース</b>）<br>② 入れた直後で、ターミナルがまだ知らない → <b>VS Code を閉じて開き直して</b>から、もう一度打ちます' },
  { q:'英語がたくさん出てきて不安',
    a:'<b>全部を読む必要はありません。</b>この教材の画面には、同じコマンドを実際に打ったときの出力を載せてあります。<b>見比べて、同じ形なら大丈夫です。</b>分からない行は、AI に「この行はどういう意味？」と聞いてください（聞き方は読み物の <a href="index.html#/git-research" target="_blank" rel="noopener">Git を調べるコツ</a>）。' }
],

steps:[
{
  kind:'os', phase:'はじめに',
  title:'まず、お使いのパソコンを教えてください',
  why:'Windows と Mac で、入れ方が少し違います。選んだほうの手順だけを出します。'
},
{
  icon:'icon-vscode.svg', phase:'1. エディタ',
  title:'VS Code を入れます',
  why:'ファイルを書くためのアプリです。この教材では、<b>コマンドを打つ画面（ターミナル）も VS Code の中のもの</b>を使います。',
  todo:{
    win:['<a href="https://code.visualstudio.com/" target="_blank" rel="noopener">code.visualstudio.com</a> を開き、Windows 用をダウンロードします',
         'ダウンロードしたファイルを開き、画面の案内に沿ってインストールします（設定は変えなくて大丈夫です）',
         'インストールが終わったら、VS Code を開きます'],
    mac:['<a href="https://code.visualstudio.com/" target="_blank" rel="noopener">code.visualstudio.com</a> を開き、Mac 用をダウンロードします',
         'ダウンロードしたファイルを開くと出てくる「Visual Studio Code」を、「アプリケーション」フォルダに移します',
         'アプリケーションから VS Code を開きます']
  },
  expect:'VS Code の画面が開きます。',
  note:'手順の画面写真は、公式の説明（下の根拠のリンク）にあります。<b>ボタンの見た目は時期によって変わる</b>ので、この教材には写真を載せていません。',
  ask:'VS Code を開けましたか？',
  ref:[vs.setupWin, vs.setupMac],
  tb:[
    { q:'会社のパソコンで、インストールが止められる',
      a:'管理者の権限が要る設定になっていることがあります。<b>自分で回避しようとしないでください。</b>そのパソコンの管理者（会社のパソコンなら、社内でパソコンを管理している部署）に「VS Code を入れたいが、権限で止まる」と伝えてください。' },
    { q:'Mac で「開発元が未確認のため開けません」と出た',
      a:'アプリのアイコンを右クリック（または control を押しながらクリック）して「開く」を選ぶと、確認の画面から開けることがあります。' }
  ]
},
{
  icon:'icon-terminal.svg', phase:'1. エディタ',
  title:'VS Code の中で、ターミナルを出します',
  why:'<b>ターミナル</b>は、文字でパソコンに命令する画面です。Git は、ここにコマンドを打って使います。',
  todo:{
    common:['VS Code のメニューから「ターミナル」→「新しいターミナル」を選びます',
            '画面の下に、文字が並んだ場所が出てきます。いちばん下の行の、記号（<code>&gt;</code> や <code>%</code> や <code>$</code>）の右側に打ちます']
  },
  visual:'media/prompt-anatomy.svg',
  visualAlt:'ターミナルの1行目の読み方。記号より左はいまいる場所、右が自分で打つ場所',
  expect:'画面の下半分に、文字が表示された場所が出ます。',
  note:'<b>この教材では、VS Code の中のターミナルを使ってください。</b>第3回で GitHub に送るときのサインインを、VS Code が引き受けてくれるためです（第3回で説明します）。',
  ask:'画面の下にターミナルが出ましたか？',
  ref:[vs.terminal],
  tb:[
    { q:'メニューに「ターミナル」が見つからない',
      a:'Mac では、メニューは画面のいちばん上（時計と同じ行）にあります。先に VS Code の画面を1回クリックしてから探してください。' }
  ]
},
{
  icon:'icon-git.svg', phase:'2. Git',
  title:'Git を入れます',
  why:'この教材で使う道具そのものです。',
  todo:{
    common:['ターミナルに、下のコマンドを打って Enter を押します',
            '終わったら、<b>VS Code を閉じて、開き直します</b>']
  },
  pre:{
    win:[['winget install --id Git.Git -e --source winget', 'Windows のアプリを入れる道具（winget）で、Git を入れます']],
    mac:[['brew install git', 'Mac のアプリを入れる道具（Homebrew）で、Git を入れます']]
  },
  cmdMulti:{
    win:['winget install --id Git.Git -e --source winget'],
    mac:['brew install git']
  },
  cmdlabel:'打つコマンド',
  expect:'エラーが出ずに終われば大丈夫です。',
  after:'入ったかどうかは、次の画面で確かめます。',
  ask:'終わって、VS Code を開き直しましたか？',
  ref:{ win:[ref.install, ref.winget], mac:[ref.installMac, ref.brew] },
  tb:[
    { os:'mac', q:'command not found: brew と出た',
      a:'Homebrew がまだ入っていません。次の1行で入れます（Homebrew 公式の1行です）。<pre><code>/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"</code></pre>最後に <code>Next steps</code> と出たら、その下に書かれたコマンドも打ちます。そのあと <code>brew install git</code> を打ち直します。' },
    { os:'win', q:'winget が認識されません と出た',
      a:'<a href="https://git-scm.com/install/windows.html" target="_blank" rel="noopener">Git の公式サイト</a>の「Click here to download」でインストーラを入れます。設定は<b>変えずに Next</b> で進めます。' },
    { os:'win', q:'「変更を加えることを許可しますか？」と出た',
      a:'「はい」を押します。' }
  ]
},
{
  icon:'icon-git.svg', phase:'2. Git',
  title:'Git が入ったことを確かめます',
  todo:{
    common:['ターミナルに、下のコマンドを打って Enter を押します']
  },
  pre:[['git --version', 'Git が入っているかを確かめ、入っていれば<b>その版（バージョン）</b>を表示します。何も変えません']],
  cmd:'git --version',
  cmdlabel:'打つコマンド',
  out:'version',
  expect:'<code>git version</code> のあとに数字が出れば、Git は入っています。',
  after:'出てきた数字が、あなたの Git の版です。この教材は 2.43.0 で打った出力を載せているので、数字が違っていても問題ありません。',
  ask:'git version と数字が出ましたか？',
  ref:[pg.install],
},
{
  icon:'icon-github.svg', phase:'3. GitHub',
  title:'GitHub のアカウントを作ります',
  why:'第2回で、この教材のリポジトリを<b>自分のアカウントにコピー（フォーク）</b>して練習します。そのためのアカウントです。',
  todo:{
    common:['<a href="https://github.com/signup" target="_blank" rel="noopener">github.com/signup</a> を開きます',
            'メールアドレス・パスワード・<b>ユーザー名</b>を決めて、画面の案内に沿って進めます',
            'メールに届いた確認のコードを入れて、登録を終えます']
  },
  expect:'GitHub にサインインした画面が出ます。',
  note:'<b>ユーザー名は、誰でも見られる場所に出ます。</b>本名を出したくなければ、本名以外にしてください。<br>画面の写真つきの手順は、根拠の GitHub Docs にあります。',
  ask:'GitHub にサインインできましたか？',
  ref:[gh.account],
  tb:[
    { q:'すでにアカウントを持っている',
      a:'そのアカウントを使って構いません。次の画面に進んでください。' },
    { q:'確認のメールが届かない',
      a:'迷惑メールのフォルダを見てください。それでも無ければ、登録の画面から送り直しができます。' }
  ]
},
{
  icon:'icon-key.svg', phase:'3. GitHub',
  title:'コミットに載せるメールアドレスを、公開用のものにします',
  why:'Git は、コミットに<b>名前とメールアドレス</b>を必ず書き込みます。この教材で練習するリポジトリは<b>公開</b>されるので、ふだんのメールアドレスを使うと、誰でも見られる状態になります。',
  todo:{
    common:['GitHub の右上のアイコン → Settings → 左のメニューの Emails を開きます',
            '<b>Keep my email addresses private</b> にチェックを入れます',
            '同じ Emails の画面に出てくる <code>…@users.noreply.github.com</code> のアドレスを、メモ帳などに写しておきます（次の画面で使います。見つからないときは、根拠の GitHub Docs の手順を見てください）']
  },
  expect:'<code>数字+ユーザー名@users.noreply.github.com</code> の形のアドレスが手元にあります。',
  note:'この形のアドレスは、GitHub が用意している<b>公開用のアドレス</b>です。このアドレスでコミットしても、GitHub はあなたのアカウントのコミットとして扱います（根拠: GitHub Docs）。',
  ask:'noreply のアドレスを写せましたか？',
  ref:[gh.noreply, gh.commitEmail, gh.forks],
  tb:[
    { q:'アドレスが「ユーザー名@users.noreply.github.com」で、数字が無い',
      a:'2017年7月18日より前に作ったアカウントでは、この形のことがあります。GitHub Docs によると、Keep my email addresses private を<b>いったん外して、もう一度入れる</b>と、数字の付いた形になります。' },
    { q:'ふだんのメールアドレスでも困らない',
      a:'それなら、ふだんのアドレスでも構いません。<b>ただし、公開されることは知ったうえで</b>選んでください。一度プッシュしたコミットのメールアドレスは、あとから消すのが難しいです。' }
  ]
},
{
  icon:'icon-terminal.svg', phase:'4. Git の設定',
  title:'Git に、名前とメールアドレスを教えます',
  why:'この2つは、これから作る<b>すべてのコミット</b>に書き込まれます。最初に1回だけ設定します。',
  todo:{
    common:['1行目の <code>あなたの名前</code> を、<b>表に出してよい名前</b>に書き換えて打ちます（ローマ字でも、ニックネームでも構いません）',
            '2行目の <code>…</code> の部分を、前の画面で写した noreply のアドレスに書き換えて打ちます',
            '　<code>"</code>（二重引用符）は消さずに残します']
  },
  pre:[
    ['git config --global user.name "あなたの名前"', 'コミットに書き込む<b>名前</b>を設定します。<code>--global</code> は「このパソコンの、すべてのリポジトリで使う」という意味です'],
    ['git config --global user.email "…@users.noreply.github.com"', 'コミットに書き込む<b>メールアドレス</b>を設定します']
  ],
  cmdMulti:{ common:['git config --global user.name "あなたの名前"', 'git config --global user.email "…@users.noreply.github.com"'] },
  cmdlabel:'書き換えてから打つコマンド',
  expect:'どちらも、<b>何も表示されずに</b>次の行に戻ります。',
  after:'何も出ないのは、うまくいった合図です。Git の多くのコマンドは、<b>うまくいったときは黙っています</b>。設定されたかどうかは、次の画面で確かめます。',
  ask:'2行とも、エラーが出ずに打てましたか？',
  ref:[pg.identity, ref.config, gh.commitEmail],
  tb:[
    { q:'名前に日本語を使ってもよい？',
      a:'使えます。ただし、<b>誰でも見られる場所に出る</b>ことは覚えておいてください。' },
    { q:'error: invalid key と出た',
      a:'<code>user.name</code> や <code>user.email</code> の綴りが違う可能性が高いです。コピーボタンで写し直してから、名前とアドレスの部分だけを書き換えてください。' },
    { q:'間違えて設定してしまった',
      a:'<b>同じコマンドを、正しい値で打ち直せば上書きされます。</b>' }
  ]
},
{
  icon:'icon-terminal.svg', phase:'4. Git の設定',
  title:'設定されたことを確かめます',
  why:'打ったものが本当に入ったかは、<b>Git に聞いて確かめます</b>。自分の記憶や、AI の「できているはずです」ではなく、手元の事実を見ます。',
  pre:[
    ['git config --global user.name', '値を付けずに打つと、<b>いまの設定を表示</b>します（変えません）'],
    ['git config --global user.email', '同じく、メールアドレスの設定を表示します']
  ],
  cmdMulti:{ common:['git config --global user.name', 'git config --global user.email'] },
  cmdlabel:'打つコマンド',
  out:['config-name', 'config-email'],
  expect:'前の画面で入れた名前と、noreply のアドレスが、そのまま出ます。',
  after:'下の出力は、例として「山田 花子」で設定したものです。<b>あなたの画面には、あなたが入れた値が出ます。</b><br>このように、同じ <code>git config</code> でも、<b>値を付けると「設定する」、付けないと「表示する」</b>になります。',
  ask:'自分の名前と、noreply のアドレスが出ましたか？',
  ref:[pg.identity, ref.config],
  tb:[
    { q:'何も表示されない',
      a:'前の画面のコマンドが入っていない可能性があります。前に戻って、もう一度打ってから確かめてください。' },
    { q:'違う値が出た',
      a:'前の画面のコマンドを、正しい値で打ち直してください。上書きされます。' }
  ]
},
{
  kind:'fin',
  title:'道具がそろいました',
  lead:'VS Code・Git・GitHub のアカウントがそろい、Git に名前とメールアドレスを教えました。',
  gained:'VS Code の中のターミナルでコマンドを打ち、<b>Git に聞いて</b>結果を確かめられるようになりました。',
  criteria:[
    '<code>git --version</code> で、Git の版が表示される',
    '<code>git config --global user.name</code> と <code>user.email</code> で、自分が設定した値が表示される',
    'メールアドレスが公開されることを知ったうえで、使うアドレスを自分で選んだ'
  ],
  deepenWhy:'<code>--global</code> には、ほかの選び方もあります。<b>AI に聞いて、そのあと Git 自身の説明で確かめてみてください。</b>',
  deepen:'git config の --global は何を意味しますか。--global を付けずに打つと、何が違いますか。\n初心者にも分かるように3行で説明し、そのあと「git help config」のどの見出しに書いてあるかも教えてください。',
  ref:[pg.help],
  readNext:{ md:'git-research', label:'Git を調べるコツ', sub:'AI と Git 自身を、両方使って調べる方法' },
  nextHref:'02-fork.html',
  nextLabel:'次: 第2回 フォークして手元に持ってくる'
}
]};
