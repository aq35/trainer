// 第4回 ステージングエリア — 1画面に1つずつ進むナビの中身。
// 書き方は design/curriculum.md の「3. 書き方の約束」。出力と図は content/runs/04-staging.mjs を実際に打って得たもの。
import { pg, ref } from '../refs.js';
import { T } from '../runs/_texts.mjs';

export const title = '第4回 ステージングエリア';

const paste = (t) => t.replace(/\n$/, '');

export default {
key:'trainer-v2-04',
greeting:'この回で、<b>ステージングエリア</b>（次のコミットに入れるものを並べておく場所）を使い分けます。<br>変更を2つ作り、<b>1つだけ</b>をコミットします。',

common:[
  { when:'cmd', q:'fatal: not a git repository と出た',
    a:'trainer フォルダの外にいます。VS Code で trainer フォルダを開き、「ターミナル」→「新しいターミナル」で出し直してください。' },
  { when:'cmd', q:'画面の下に : や (END) が出て、打てなくなった',
    a:'出力が長いので、Git が<b>1画面ずつ見せる道具</b>（ページャ）で開いています。<span class="k">q</span> を押すと戻ります。' }
],

steps:[
{
  icon:'icon-vscode.svg', phase:'1. 変更する',
  title:'hello.md に、1行足します',
  why:'第3回でコミットしたファイルを、変更します。',
  todo:{
    common:['VS Code で <code>practice/hello.md</code> を開きます',
            '<span class="k">Ctrl</span>+<span class="k">A</span>（Mac は <span class="k">Cmd</span>+<span class="k">A</span>）で全部を選び、下の枠の中身を貼り付けます',
            '保存します']
  },
  textBox:true,
  cmdMulti:{ common:[paste(T.hello4a)] },
  cmdlabel:'hello.md の中身（4行目が増えています）',
  expect:'hello.md の最後に「ステージングエリアの練習をしています。」の行があり、保存できています。',
  ask:'保存できましたか？',
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. 状態を見る',
  title:'変更したファイルは、まだステージされていません',
  why:'ファイルを変えただけで、Git に何が見えているかを確かめます。',
  pre:[['git status', 'いまの状態を表示します。何も変えません']],
  cmd:'git status',
  cmdlabel:'打つコマンド',
  out:'4-status-modified',
  areas:'a4-modified',
  expect:'<code>Changes not staged for commit:</code> の下に <code>modified:   practice/hello.md</code> が出ます。',
  after:'<code>Changes not staged for commit</code> は「<b>ステージされていない変更</b>」、<code>modified</code> は「<b>修正済</b>」です。<br>図のとおり、作業ディレクトリの中身（②）だけが新しく、ステージングエリアとリポジトリは前のまま（①）です。',
  ask:'Changes not staged for commit の下に practice/hello.md が出ましたか？',
  ref:[pg.status, pg.states, ref.status],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'3. ステージする',
  title:'変更を、ステージングエリアに載せます',
  why:'<code>git add</code> は、新しいファイルだけでなく、<b>変更したファイル</b>にも使います。',
  pre:[
    ['git add practice/hello.md', 'hello.md の<b>いまの中身</b>を、ステージングエリアに載せます'],
    ['git status', '載ったかを確かめます']
  ],
  cmdMulti:{ common:['git add practice/hello.md', 'git status'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['4-add', '4-status-staged'],
  areas:'a4-staged',
  expect:'<code>Changes to be committed:</code> の下に <code>modified:   practice/hello.md</code> が出ます。',
  after:'hello.md が「次のコミットに入る変更」に移りました（<b>ステージ済</b>）。図では、ステージングエリアの中身も②になっています。',
  ask:'Changes to be committed の下に移りましたか？',
  ref:[pg.staging, ref.add],
  tb:[]
},
{
  icon:'icon-vscode.svg', phase:'4. もう一度変更する',
  title:'ステージしたあとで、もう1行足します',
  why:'ステージングエリアに載るのが「いつの中身か」を確かめるためです。',
  todo:{
    common:['hello.md で全部を選び、下の枠の中身を貼り付けます',
            '保存します']
  },
  textBox:true,
  cmdMulti:{ common:[paste(T.hello4b)] },
  cmdlabel:'hello.md の中身（5行目が増えています）',
  expect:'最後に「2回目の変更です。」の行があり、保存できています。',
  ask:'保存できましたか？',
  tb:[]
},
{
  icon:'icon-git.svg', phase:'4. もう一度変更する',
  title:'同じファイルが、2か所に出ます',
  why:'この回でいちばん大事な画面です。',
  pre:[['git status', 'いまの状態を表示します']],
  cmd:'git status',
  cmdlabel:'打つコマンド',
  out:'4-status-both',
  areas:'a4-both',
  expect:'<code>practice/hello.md</code> が、<code>Changes to be committed</code> と <code>Changes not staged for commit</code> の<b>両方</b>に出ます。',
  after:'<code>git add</code> でステージングエリアに載るのは、<b>add したときの中身</b>です。そのあとの変更は、もう一度 add するまで載りません。<br>図のとおり、3つの場所の中身が<b>全部違います</b>（リポジトリ①・ステージングエリア②・作業ディレクトリ③）。いまコミットすると、入るのは②です。',
  ask:'hello.md が2か所に出ましたか？',
  ref:[pg.staging, pg.states],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'4. もう一度変更する',
  title:'もう一度 add して、そろえます',
  why:'2回目の変更も、次のコミットに入れます。',
  pre:[
    ['git add practice/hello.md', 'hello.md のいまの中身（③）を、ステージングエリアに載せ直します'],
    ['git status', '確かめます']
  ],
  cmdMulti:{ common:['git add practice/hello.md', 'git status'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['4-add-again', '4-status-staged-again'],
  areas:'a4-staged-again',
  expect:'hello.md が <code>Changes to be committed</code> の下だけに出ます。',
  after:'ステージングエリアの中身が、作業ディレクトリと同じ②になりました（図の番号は、いまある中身を古い順に数え直しています）。',
  ask:'Changes to be committed の下だけになりましたか？',
  ref:[pg.staging, ref.add],
  tb:[]
},
{
  icon:'icon-vscode.svg', phase:'5. 1つだけコミットする',
  title:'新しいファイル todo.md を作ります',
  why:'2つ目の変更です。こちらは、<b>まだコミットに入れない</b>ことにします。',
  todo:{
    common:['practice フォルダを右クリック →「新しいファイル」で <code>todo.md</code> を作ります',
            '下の枠の中身を貼り付けて、保存します']
  },
  textBox:true,
  cmdMulti:{ common:[paste(T.todo4)] },
  cmdlabel:'todo.md の中身',
  expect:'practice フォルダに todo.md があり、保存できています。',
  ask:'todo.md を作れましたか？',
  tb:[]
},
{
  icon:'icon-git.svg', phase:'5. 1つだけコミットする',
  title:'うっかり、todo.md もステージしてしまいます',
  why:'よくある間違いを、わざと起こします。',
  pre:[
    ['git add practice/todo.md', 'todo.md をステージングエリアに載せます'],
    ['git status', '確かめます']
  ],
  cmdMulti:{ common:['git add practice/todo.md', 'git status'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['4-add-todo', '4-status-two'],
  areas:'a4-two',
  expect:'<code>Changes to be committed</code> の下に、hello.md と todo.md の2つが出ます。',
  after:'このままコミットすると、2つとも入ります。',
  ask:'2つとも Changes to be committed の下に出ましたか？',
  ref:[pg.track, ref.add],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'5. 1つだけコミットする',
  title:'★ todo.md を、ステージングエリアから下ろします',
  why:'打つ前に「<b>何が変わるか・何が消えるか・どう戻すか</b>」を考えます。分からなければ、AI にこの3つを聞いてから打ちます。',
  pre:[
    ['git restore --staged practice/todo.md', 'todo.md を<b>ステージングエリアから下ろします</b>。作業ディレクトリの todo.md はそのまま残ります'],
    ['git status', '確かめます']
  ],
  cmdMulti:{ common:['git restore --staged practice/todo.md', 'git status'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['4-restore-staged', '4-status-unstaged'],
  areas:'a4-unstaged',
  expect:'hello.md は <code>Changes to be committed</code> に残り、todo.md は <code>Untracked files</code> に戻ります。',
  after:'答え合わせです。<br>・<b>変わったこと</b>: todo.md がステージングエリアから消えた<br>・<b>消えないもの</b>: 作業ディレクトリの todo.md（図の todo.md の行。VS Code でも開けます）<br>・<b>戻し方</b>: もう一度 <code>git add practice/todo.md</code><br>このコマンドは、第3回の <code>git status</code> の案内（<code>use "git restore --staged &lt;file&gt;..." to unstage</code>）に出ていたものです。',
  ask:'todo.md が Untracked files に戻りましたか？',
  ref:[pg.unstaging, ref.restore, ref.rel223],
  tb:[
    { q:'Pro Git には git reset HEAD で下ろすと書いてある',
      a:'Pro Git 日本語版は、古い版の Git の案内に合わせて書かれています。<b>いまの Git は、上の出力のとおり <code>git restore --staged</code> を案内します</b>（Git 2.23 で加わったコマンド。根拠のリリースノートを参照）。' },
    { q:'git restore --staged を付けずに git restore と打ってしまった',
      a:'<code>--staged</code> の無い <code>git restore</code> は、<b>作業ディレクトリの変更を捨てる</b>コマンドです（第7回で扱います）。todo.md は追跡されていないので、今回は変わりません。<code>git status</code> で状態を確かめてから、打ち直してください。' }
  ]
},
{
  icon:'icon-git.svg', phase:'6. コミットする',
  title:'hello.md だけを、コミットします',
  why:'コミットに入るのは、<b>ステージングエリアにあるものだけ</b>です。',
  pre:[
    ['git commit -m "hello.md に2行足した"', 'ステージングエリアの中身でコミットを作ります'],
    ['git status', '何が残ったかを確かめます']
  ],
  cmdMulti:{ common:['git commit -m "hello.md に2行足した"', 'git status'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['4-commit', '4-status-end'],
  areas:'a4-end',
  expect:'<code>1 file changed, 2 insertions(+)</code> と出て、そのあとの <code>git status</code> に todo.md が <code>Untracked files</code> として残ります。',
  after:'コミットに入ったのは hello.md の1つだけです。todo.md は作業ディレクトリに残っています。<b>次の回で、中身を確かめてからコミットします。</b><br><code>ahead of \'origin/main\' by 1 commit</code> は、まだプッシュしていないという意味です。プッシュも次の回でします。',
  ask:'1 file changed と出て、todo.md が残りましたか？',
  ref:[pg.commit, ref.commit],
  tb:[]
},
{
  kind:'fin',
  title:'ステージングエリアを使い分けました',
  lead:'2つの変更のうち、1つだけをコミットしました。',
  gained:'<code>git add</code> で載せ、<code>git restore --staged</code> で下ろせます。ステージングエリアに載るのは<b>add したときの中身</b>です。',
  criteria:[
    '<code>git log --oneline -1</code> が「hello.md に2行足した」を出す',
    '<code>git status</code> の Untracked files に practice/todo.md がある'
  ],
  deepenWhy:'「なぜ Git には、ステージングエリアがあるのか」を、自分の言葉で説明して、AI に直してもらいます。',
  deepen:'私の理解を書きます。間違っているところだけ、理由と一緒に直してください。\n\n（ここに書く。例: ステージングエリアがあると、〇〇ができる。今日の練習では、〇〇と〇〇のうち、〇〇だけをコミットできた）\n\n最後に、Pro Git 日本語版の「三つの状態」の節と比べて、ずれている所があれば教えてください。',
  ref:[pg.states],
  nextHref:'05-diff.html',
  nextLabel:'第5回 差分を読む へ'
}
]};
