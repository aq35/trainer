// 第7回 取り消す — 1画面に1つずつ進むナビの中身。
// 書き方は design/curriculum.md の「3. 書き方の約束」。出力と図は content/runs/07-undo.mjs を実際に打って得たもの。
import { pg, ref, gh } from '../refs.js';
import { T } from '../runs/_texts.mjs';

export const title = '第7回 取り消す';

const paste = (t) => t.replace(/\n$/, '');

export default {
key:'trainer-v2-07',
greeting:'この回で、<b>取り消し方を3つ</b>使い分けます。<br>取り消しのコマンドには、<b>打つと戻せなくなるもの</b>があります。★の画面では、打つ前に「何が消えるか」を必ず確かめます。',

common:[
  { when:'cmd', q:'fatal: not a git repository と出た',
    a:'trainer フォルダの外にいます。VS Code で trainer フォルダを開き、「ターミナル」→「新しいターミナル」で出し直してください。' },
  { when:'cmd', q:'画面の下に : や (END) が出て、打てなくなった',
    a:'出力が長いので、Git が<b>1画面ずつ見せる道具</b>（ページャ）で開いています。<span class="k">q</span> を押すと戻ります。' },
  { when:'cmd', q:'見慣れない画面（エディタ）が開いてしまった',
    a:'<code>-m "…"</code> や <code>--no-edit</code> を付けずに打つと、メッセージを書くためのエディタが開きます。画面の一番下の表示を AI に貼って「これを閉じる方法は？」と聞き、閉じてから打ち直してください。' }
],

steps:[
{
  icon:'icon-vscode.svg', phase:'1. 保存した変更を捨てる',
  title:'hello.md に、まちがえた行を足します',
  why:'「まだ add もコミットもしていない変更」を、捨てる練習です。',
  todo:{
    common:['hello.md で全部を選び、下の枠の中身を貼り付けます',
            '保存します']
  },
  textBox:true,
  cmdMulti:{ common:[paste(T.hello7)] },
  cmdlabel:'hello.md の中身（最後の行が、まちがえた行です）',
  expect:'最後に「まちがえて書いた行です。」があり、保存できています。',
  ask:'保存できましたか？',
  tb:[]
},
{
  icon:'icon-git.svg', phase:'1. 保存した変更を捨てる',
  title:'捨てる前に、何を捨てるかを見ます',
  why:'捨てるコマンドの前に、<b>差分で中身を確かめる</b>習慣です。',
  pre:[['git diff', '作業ディレクトリと、ステージングエリアの違いを表示します']],
  cmd:'git diff',
  cmdlabel:'打つコマンド',
  out:'7-diff',
  areas:'a7-mistake',
  expect:'<code>+まちがえて書いた行です。</code> の1行だけが出ます。',
  after:'次の画面で捨てるのは、この <code>+</code> の1行です。図のとおり、この中身（②）は<b>作業ディレクトリにしかありません</b>。',
  ask:'+ の行が1行だけ出ましたか？',
  ref:[pg.diff, ref.diff],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'1. 保存した変更を捨てる',
  title:'★ 作業ディレクトリの変更を、捨てます',
  why:'<b>このコマンドで捨てた変更は、Git からは戻せません。</b>一度も add もコミットもしていない中身は、Git のどこにも入っていないからです。',
  pre:[
    ['git restore practice/hello.md', 'hello.md を、<b>ステージングエリアの中身に戻します</b>。作業ディレクトリでの変更は捨てられます'],
    ['git status', '確かめます']
  ],
  cmdMulti:{ common:['git restore practice/hello.md', 'git status'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['7-restore', '7-status-clean'],
  areas:'a7-restored',
  expect:'<code>nothing to commit, working tree clean</code> と出ます。VS Code の hello.md からも、まちがえた行が消えます。',
  after:'図のとおり、3つの場所が同じ中身（①）に戻りました。前の画面の②は、もうどこにもありません。<br><code>--staged</code> を付けた第4回の <code>git restore --staged</code> は、ステージングエリアから下ろすだけで、作業ディレクトリは変えませんでした。<b><code>--staged</code> の有無で、消えるものが違います。</b>',
  ask:'working tree clean と出ましたか？',
  ref:[pg.unmodifying, ref.restore, ref.rel223],
  tb:[
    { q:'Pro Git には git checkout -- で戻すと書いてある',
      a:'Pro Git 日本語版は、古い版の Git の案内に合わせて書かれています。いまの Git は <code>git status</code> で <code>git restore</code> を案内します（Git 2.23 で加わったコマンド）。Pro Git のその節にも「危険なコマンド」「あなたがファイルに加えた変更はすべて消えてしまいます」という注意があり、<b>危なさは同じ</b>です。' }
  ]
},
{
  icon:'icon-vscode.svg', phase:'2. 直前のコミットを直す',
  title:'todo.md に、1行足します',
  why:'次は「コミットしてから、まちがいに気づいた」場合です。',
  todo:{
    common:['todo.md で全部を選び、下の枠の中身を貼り付けます',
            '保存します']
  },
  textBox:true,
  cmdMulti:{ common:[paste(T.todo7)] },
  cmdlabel:'todo.md の中身（最後の行が増えています）',
  expect:'最後に「- 取り消し方を覚える」があり、保存できています。',
  ask:'保存できましたか？',
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. 直前のコミットを直す',
  title:'打ち間違えたメッセージで、コミットします',
  why:'わざと、メッセージの最後を「たs」と打ち間違えます。',
  pre:[
    ['git add practice/todo.md', 'todo.md をステージングエリアに載せます'],
    ['git commit -m "todo.md に項目をたs"', '打ち間違えたメッセージで、コミットを作ります']
  ],
  cmdMulti:{ common:['git add practice/todo.md', 'git commit -m "todo.md に項目をたs"'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['7-add', '7-commit-typo'],
  expect:'<code>[main 英数字] todo.md に項目をたs</code> と出ます。',
  after:'このコミットの番号は <code>4d0ce08</code> です（あなたの画面では違います）。次の画面で、この番号がどうなるかを見ます。',
  ask:'コミットできましたか？',
  ref:[pg.commit, ref.commit],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. 直前のコミットを直す',
  title:'★ 直前のコミットを、作り直します',
  why:'<code>--amend</code> は、<b>直前のコミットを、新しいコミットで置き換えます</b>。まだプッシュしていないコミットにだけ使います。',
  pre:[
    ['git commit --amend -m "todo.md に項目を足した"', '直前のコミットを、このメッセージで<b>作り直します</b>（中身は、いまのステージングエリアのもの）'],
    ['git log --oneline -2', '履歴を2件表示します']
  ],
  cmdMulti:{ common:['git commit --amend -m "todo.md に項目を足した"', 'git log --oneline -2'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['7-amend', '7-log-amend'],
  expect:'履歴のいちばん上が「todo.md に項目を足した」になり、「たs」のコミットは出てきません。',
  after:'コミットの番号が、前の画面の番号から <code>a424458</code> に<b>変わりました</b>。直したのではなく、<b>別のコミットを作って、置き換えた</b>からです。<code>Date:</code> の行は、もとのコミットの日時を引き継いだという表示です。<br>プッシュしたあとで置き換えると、フォークにある履歴と食い違い、送るには履歴を書き換える強いプッシュが要ります（根拠: GitHub Docs）。この教材では、<b>プッシュしたコミットは amend しません</b>。',
  ask:'いちばん上が「todo.md に項目を足した」になりましたか？',
  ref:[pg.undoing, ref.commit, gh.amend],
  tb:[]
},
{
  icon:'icon-github.svg', phase:'3. プッシュ済みのコミットを取り消す',
  title:'直したコミットを、フォークに送ります',
  why:'次の画面で、<b>送ったあとのコミット</b>を取り消します。',
  pre:[['git push', 'まだ送っていないコミットを、あなたのフォークに送ります']],
  cmd:'git push',
  cmdlabel:'打つコマンド',
  out:'7-push',
  expect:'<code>main -&gt; main</code> と出ます。',
  after:'送ったのは、置き換えたあとの <code>a424458</code> だけです。打ち間違えたほうのコミットは、一度も送っていません。',
  ask:'main -> main と出ましたか？',
  ref:[pg.push, ref.push],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'3. プッシュ済みのコミットを取り消す',
  title:'★ 送ったコミットを、打ち消すコミットを作ります',
  why:'送ったコミットは、置き換えずに<b>「打ち消す」コミットを足して</b>取り消します。履歴は1つも消えません。',
  pre:[
    ['git revert --no-edit HEAD', 'いちばん新しいコミット（<code>HEAD</code>）の変更を、<b>逆向きにする新しいコミット</b>を作ります。<code>--no-edit</code> ＝メッセージは Git が付けたものをそのまま使う'],
    ['git log --oneline -3', '履歴を3件表示します']
  ],
  cmdMulti:{ common:['git revert --no-edit HEAD', 'git log --oneline -3'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['7-revert', '7-log-revert'],
  expect:'履歴のいちばん上に <code>Revert "todo.md に項目を足した"</code> が増えます。VS Code の todo.md から「- 取り消し方を覚える」の行が消えます。',
  after:'<code>a424458</code> はそのまま残り、その上に<b>打ち消すコミット</b> <code>f314fa1</code> が加わりました。<code>1 deletion(-)</code> は、a424458 で足した1行を消したという意味です。<br>履歴を書き換えていないので、このあと普通の <code>git push</code> で送れます。',
  ask:'Revert のコミットが、いちばん上に増えましたか？',
  ref:[ref.revert],
  tb:[]
},
{
  icon:'icon-github.svg', phase:'3. プッシュ済みのコミットを取り消す',
  title:'打ち消したコミットを、フォークに送ります',
  why:'取り消しも、1つのコミットとして送ります。',
  pre:[
    ['git push', 'Revert のコミットを、あなたのフォークに送ります'],
    ['git status', '確かめます']
  ],
  cmdMulti:{ common:['git push', 'git status'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['7-push-revert', '7-status'],
  expect:'<code>main -&gt; main</code> と出て、<code>git status</code> が <code>up to date</code> と <code>working tree clean</code> を出します。',
  after:'強いプッシュは要りませんでした。<b>足すだけの取り消し</b>だからです。',
  ask:'up to date と working tree clean が出ましたか？',
  ref:[pg.push, ref.push],
  tb:[]
},
{
  kind:'fin',
  title:'3つの取り消し方を、使い分けました',
  lead:'取り消すものと、消えるものが、それぞれ違いました。',
  gained:'・<code>git restore ファイル</code> … 作業ディレクトリの変更を捨てる。<b>捨てた中身は Git から戻せない</b><br>・<code>git commit --amend</code> … 直前のコミットを置き換える。<b>プッシュ前だけ</b><br>・<code>git revert</code> … 打ち消すコミットを足す。<b>プッシュ後はこれ</b>',
  criteria:[
    '<code>git log --oneline -3</code> のいちばん上が <code>Revert "todo.md に項目を足した"</code>',
    '<code>git status</code> が <code>up to date</code> と <code>working tree clean</code> を出す'
  ],
  deepenWhy:'この回で使わなかった取り消しのコマンドを、<b>打たずに</b>調べます。打つ前に危なさを知る練習です。',
  deepen:'git reset --hard について教えてください。次の3つに分けて答えてください。\n\n1. 作業ディレクトリ・ステージングエリア・リポジトリのうち、どこの何が変わるか\n2. 打ったあとで戻せないものは何か\n3. 今日使った git restore・git commit --amend・git revert のどれかで代わりにできる場面はあるか\n\n答えには、git help reset の該当する箇所を引用してください。私は、その箇所を git help reset で確かめます。',
  ref:[pg.undoing, ref.revert],
  nextHref:'08-ignore.html',
  nextLabel:'第8回 追跡しないもの へ'
}
]};
