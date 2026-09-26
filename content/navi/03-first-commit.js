// 第3回 最初のコミット — 1画面に1つずつ進むナビの中身。
// 書き方は design/curriculum.md の「3. 書き方の約束」。出力と図は content/runs/03-first-commit.mjs を実際に打って得たもの。
import { pg, ref, gh, vs } from '../refs.js';

export const title = '第3回 最初のコミット';

export default {
key:'trainer-v2-03',
greeting:'この回で、<b>はじめてのコミット</b>をして、あなたのフォークに<b>プッシュ</b>します。<br>ファイルが <b>作業ディレクトリ → ステージングエリア → リポジトリ</b> と進む様子を、毎回 Git に聞いて確かめながら進めます。',

common:[
  { when:'cmd', q:'fatal: not a git repository と出た',
    a:'trainer フォルダの外にいます。VS Code で trainer フォルダを開き、「ターミナル」→「新しいターミナル」で出し直してください。' },
  { when:'cmd', q:'pathspec \'practice/hello.md\' did not match any files と出た',
    a:'そのファイルが見つからない、という意味です。① ファイルを<b>保存</b>したか ② フォルダ名が <code>practice</code>、ファイル名が <code>hello.md</code> になっているか（綴り・大文字小文字）を確かめてください。' }
],

steps:[
{
  icon:'icon-vscode.svg', phase:'1. ファイルを作る',
  title:'practice フォルダに、ファイルを1つ作ります',
  why:'練習用のファイルです。<b>中身は下の3行をそのまま</b>使ってください（公開されるので、個人情報は書きません）。',
  todo:{
    common:['VS Code の左のファイル一覧で、何もない所を右クリック →「新しいフォルダー」を選び、<code>practice</code> と名前を付けます',
            'できた practice フォルダを右クリック →「新しいファイル」を選び、<code>hello.md</code> と名前を付けます',
            '下の枠の「コピー」を押して、hello.md に貼り付けます',
            '<span class="k">Ctrl</span>+<span class="k">S</span>（Mac は <span class="k">Cmd</span>+<span class="k">S</span>）で<b>保存</b>します']
  },
  textBox:true,
  cmdMulti:{ common:['# はじめての Git\n\nこのファイルは、Git の練習のために作りました。'] },
  cmdlabel:'hello.md に貼り付ける中身',
  expect:'左の一覧に <code>practice</code> フォルダと、その中に <code>hello.md</code> があります。タブに「●」が付いていなければ、保存できています。',
  ask:'practice/hello.md を作って、保存できましたか？',
  tb:[
    { q:'タブに「●」が付いたまま',
      a:'まだ保存されていません。<span class="k">Ctrl</span>+<span class="k">S</span>（Mac は <span class="k">Cmd</span>+<span class="k">S</span>）を押してください。' }
  ]
},
{
  icon:'icon-git.svg', phase:'2. 状態を見る',
  title:'Git は、新しいファイルに気づいています',
  why:'ファイルを作っただけで、Git に何が見えているかを確かめます。',
  pre:[['git status', 'いまの状態を表示します。何も変えません']],
  cmd:'git status',
  cmdlabel:'打つコマンド',
  out:'status-untracked',
  areas:'a3-untracked',
  expect:'<code>Untracked files:</code> の下に <code>practice/</code> が出ます。',
  after:'<code>Untracked files</code> は「<b>追跡されていない</b>ファイル」、つまり Git がまだ管理していないファイルのことです。<br>ファイルではなく <code>practice/</code> と<b>フォルダの名前</b>で出ているのは、フォルダの中身がまるごと追跡されていないからです。<br>図のとおり、hello.md は<b>作業ディレクトリにしかありません</b>。ステージングエリアにも、リポジトリ（コミット）にも、まだ入っていません。',
  ask:'Untracked files の下に practice/ が出ましたか？',
  ref:[pg.status, pg.states, ref.status],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'3. ステージする',
  title:'次のコミットに入れるファイルを、ステージングエリアに載せます',
  why:'<b>ステージングエリア</b>は、次のコミットに入れるものを並べておく場所です。<code>git add</code> で載せます。',
  pre:[
    ['git add practice/hello.md', 'practice/hello.md の<b>いまの中身</b>を、ステージングエリアに載せます。コミットはまだしません'],
    ['git status', '載ったかどうかを確かめます']
  ],
  cmdMulti:{ common:['git add practice/hello.md', 'git status'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['add', 'status-staged'],
  areas:'a3-staged',
  expect:'<code>Changes to be committed:</code> の下に <code>new file:   practice/hello.md</code> と出ます。',
  after:'<code>git add</code> は、うまくいくと何も表示しません。<br><code>Changes to be committed</code> は「<b>次のコミットに入る変更</b>」、<code>new file</code> は「新しく追加されるファイル」という意味です。<br>図のとおり、同じ中身（①）が<b>作業ディレクトリとステージングエリアの両方に</b>あります。リポジトリには、まだありません。<br>その上の <code>(use "git restore --staged &lt;file&gt;..." to unstage)</code> は「ステージングエリアから下ろす方法」の案内です。第4回で使います。',
  ask:'Changes to be committed の下に practice/hello.md が出ましたか？',
  ref:[pg.track, pg.states, ref.add],
  tb:[
    { q:'Pro Git には git reset HEAD で下ろすと書いてある',
      a:'Pro Git 日本語版の該当の節は、古い版の Git の案内に合わせて書かれています。<b>いまの Git は、上の出力のとおり <code>git restore --staged</code> を案内します</b>（<code>git restore</code> は Git 2.23 で加わったコマンドです。根拠: <a href="https://github.com/git/git/blob/master/Documentation/RelNotes/2.23.0.adoc" target="_blank" rel="noopener">Git 2.23 のリリースノート</a>）。<b>画面に出る Git 自身の案内を優先</b>してください。' }
  ]
},
{
  icon:'icon-git.svg', phase:'4. コミットする',
  title:'ステージングエリアの中身で、コミットを作ります',
  why:'<b>コミット</b>は、ステージングエリアに並べた内容を、説明を付けてリポジトリに入れることです。',
  pre:[['git commit -m "練習用のファイルを作った"', 'ステージングエリアの中身でコミットを作ります。<code>-m</code> のあとの <code>"…"</code> が、そのコミットの説明（<b>コミットメッセージ</b>）です']],
  cmd:'git commit -m "練習用のファイルを作った"',
  cmdlabel:'打つコマンド',
  out:'commit',
  areas:'a3-committed',
  expect:'<code>[main 英数字] 練習用のファイルを作った</code> と、<code>1 file changed</code> の行が出ます。',
  after:'1行目の <code>[main 580eb38]</code> は「<b>main</b> ブランチに、<b>580eb38</b> という番号のコミットを作った」という意味です。<b>番号はあなたの画面では違います</b>（名前・日時・中身などから計算されるため）。<br><code>1 file changed, 3 insertions(+)</code> は「1つのファイルに、3行足した」、<code>create mode 100644 practice/hello.md</code> は「このファイルを新しく作った」という意味です。<br>図のとおり、いまは<b>3つの場所すべてに、同じ中身（①）</b>があります。',
  ask:'[main 英数字] 練習用のファイルを作った と出ましたか？',
  ref:[pg.commit, pg.states, ref.commit],
  tb:[
    { q:'Please tell me who you are と出た',
      a:'第1回の名前とメールアドレスの設定が入っていません。第1回の「Git に、名前とメールアドレスを教えます」をやり直してから、もう一度コミットしてください。' },
    { q:'nothing to commit と出た',
      a:'ステージングエリアに何も載っていません。前の画面の <code>git add</code> からやり直してください。' },
    { q:'見慣れない画面（エディタ）が開いてしまった',
      a:'<code>-m "…"</code> を付けずに <code>git commit</code> だけを打つと、説明を書くためのエディタが開きます。落ち着いて閉じてから、<code>-m</code> を付けて打ち直してください。エディタの閉じ方が分からないときは、画面の一番下の表示を AI に貼って「これを閉じる方法は？」と聞いてください。' }
  ]
},
{
  icon:'icon-git.svg', phase:'4. コミットする',
  title:'履歴のいちばん上に、あなたのコミットがあります',
  why:'第2回で見た履歴に、1つ増えたことを確かめます。',
  pre:[['git log --oneline -3', 'コミットの履歴を、新しい順に3件、1件1行で表示します']],
  cmd:'git log --oneline -3',
  cmdlabel:'打つコマンド',
  out:'log-3',
  expect:'いちばん上の行が、あなたのコミット（練習用のファイルを作った）になっています。',
  after:'その下の2行は、この教材を作った人のコミットです。<b>あなたのコミットは、この教材の履歴の続きとして</b>つながりました。',
  ask:'いちばん上に、あなたのコミットがありますか？',
  ref:[pg.log, ref.log],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'5. プッシュする',
  title:'このコミットは、まだ GitHub にはありません',
  why:'コミットは、<b>パソコンの中のリポジトリ</b>に入っただけです。',
  pre:[['git status', 'いまの状態を表示します']],
  cmd:'git status',
  cmdlabel:'打つコマンド',
  out:'status-ahead',
  expect:'<code>Your branch is ahead of \'origin/main\' by 1 commit.</code> と出ます。',
  after:'「あなたのブランチは、<code>origin/main</code>（GitHub のフォーク）より<b>1コミット先に進んでいます</b>」という意味です。<br>次の行の <code>(use "git push" to publish your local commits)</code> が、GitHub に送る方法の案内です。',
  ask:'ahead of \'origin/main\' by 1 commit と出ましたか？',
  ref:[pg.status, ref.status],
  tb:[]
},
{
  icon:'icon-github.svg', phase:'5. プッシュする',
  title:'あなたのフォークに、プッシュします',
  why:'<b>プッシュ</b>は、パソコンのコミットを、リモート（ここではあなたのフォーク）に送ることです。',
  todo:{
    common:['<b>VS Code の中のターミナル</b>で、下の1行目を打ちます',
            '<b>はじめてのときは、GitHub へのサインインを求める画面が出ます。</b>案内に沿ってブラウザでサインインし、許可してから VS Code に戻ります',
            '　（VS Code は、中のターミナルで打った Git の<b>サインインを引き受ける設定</b>が、最初から入っています。根拠のリンクを参照）',
            '終わったら、2行目で状態を確かめます']
  },
  pre:[
    ['git push', 'このブランチのコミットを、<code>origin</code>（あなたのフォーク）に送ります'],
    ['git status', '送れたかを確かめます']
  ],
  cmdMulti:{ common:['git push', 'git status'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['push', 'status-pushed'],
  expect:'<code>main -&gt; main</code> の行が出て、そのあとの <code>git status</code> で <code>up to date with \'origin/main\'</code> に戻ります。',
  after:'<code>c68c135..580eb38  main -&gt; main</code> は「手元の <b>main</b> を、向こうの <b>main</b> に送り、<b>c68c135 の次に 580eb38 が加わった</b>」という意味です（番号はあなたの画面では違います）。<br>GitHub に送るときは、この前に <code>Enumerating objects</code> などで始まる行が出ることがあります。送っている途中の様子です。',
  ask:'main -> main と出て、git status が up to date に戻りましたか？',
  ref:[pg.push, ref.push, gh.push, vs.github, vs.terminalAuth],
  tb:[
    { q:'サインインの画面が出ずに、失敗した（Authentication failed など）',
      a:'<b>VS Code の中のターミナル</b>で打っているか確かめてください（Windows のターミナルや Mac のターミナルのアプリで打つと、VS Code がサインインを引き受けられません）。<br>それでも失敗するときは、エラーの全文をコピーして、担当者か AI に相談してください。' },
    { q:'Permission denied / 403 と出た',
      a:'書き込めない場所に送ろうとしています。<code>git remote -v</code> を打って、URL が<b>あなたのフォーク</b>（あなたのユーザー名）か確かめてください。<code>aq35</code> になっていたら、本家をクローンしています（第2回からやり直します）。' }
  ]
},
{
  icon:'icon-github.svg', phase:'6. 確かめる',
  title:'GitHub の画面で、自分のコミットを見ます',
  why:'送ったものが本当に届いたかは、<b>向こうの画面で</b>確かめます。',
  todo:{
    common:['ブラウザで <b>あなたのフォーク</b>（https://github.com/あなたのユーザー名/trainer）を開きます',
            'ファイルの一覧に <b>practice</b> フォルダがあり、その中に hello.md があることを確かめます',
            'ファイル一覧の上に、あなたのコミットメッセージ「練習用のファイルを作った」が出ていることを確かめます']
  },
  expect:'あなたのフォークに practice/hello.md があり、最新のコミットとして、あなたのコミットメッセージが出ています。',
  note:'<b>本家（aq35/trainer）には、何も起きていません。</b>あなたが送ったのは、あなたのフォークだけです。',
  ask:'GitHub の画面で、practice/hello.md が見えましたか？',
  tb:[
    { q:'見えない',
      a:'ブラウザを再読み込みしてください。それでも見えなければ、開いているのが<b>あなたのフォーク</b>か（左上がユーザー名 / trainer か）を確かめてください。' }
  ]
},
{
  kind:'fin',
  title:'はじめてのコミットを、GitHub に届けました',
  lead:'ファイルを作り、ステージングエリアに載せ、コミットし、あなたのフォークにプッシュしました。',
  gained:'<code>add</code> → <code>commit</code> → <code>push</code> の流れと、そのたびに <code>git status</code> で<b>いまどこにあるか</b>を確かめる習慣が身につきました。',
  criteria:[
    '<code>git log --oneline -3</code> のいちばん上に、あなたのコミットがある',
    '<code>git status</code> が <code>up to date with \'origin/main\'</code> と <code>working tree clean</code> を出す',
    'GitHub のあなたのフォークに practice/hello.md がある'
  ],
  deepenWhy:'作業ディレクトリ・ステージングエリア・リポジトリの違いを、<b>自分の言葉で説明して、AI に直してもらいます</b>。いちばん力がつく聞き方です。',
  deepen:'私の理解を書きます。間違っているところだけ、理由と一緒に直してください。合っているところは「合っています」だけで構いません。\n\n（ここに、自分の言葉で書く。例: 作業ディレクトリは〇〇で、git add をすると〇〇になり、git commit をすると〇〇になる）\n\n最後に、Pro Git 日本語版の「三つの状態」の節と比べて、私の説明とずれている所があれば教えてください。',
  ref:[pg.states],
  readNext:{ md:'git-research', label:'Git を調べるコツ', sub:'AI の答えを、Git で確かめる方法' },
  nextHref:'index.html',
  nextLabel:'目次に戻る（第4回は準備中です）'
}
]};
