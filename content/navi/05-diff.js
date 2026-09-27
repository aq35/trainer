// 第5回 差分を読む — 1画面に1つずつ進むナビの中身。
// 書き方は design/curriculum.md の「3. 書き方の約束」。出力は content/runs/05-diff.mjs を実際に打って得たもの。
import { pg, ref, gh } from '../refs.js';
import { T } from '../runs/_texts.mjs';

export const title = '第5回 差分を読む';

const paste = (t) => t.replace(/\n$/, '');

export default {
key:'trainer-v2-05',
greeting:'この回で、<b>コミットする前に、何を変えたか</b>を Git に見せてもらいます。<br>見るだけのコマンドなので、何度打っても何も変わりません。',

common:[
  { when:'cmd', q:'fatal: not a git repository と出た',
    a:'trainer フォルダの外にいます。VS Code で trainer フォルダを開き、「ターミナル」→「新しいターミナル」で出し直してください。' },
  { when:'cmd', q:'画面の下に : や (END) が出て、打てなくなった',
    a:'出力が長いので、Git が<b>1画面ずつ見せる道具</b>（ページャ）で開いています。<span class="k">q</span> を押すと戻ります。' }
],

steps:[
{
  icon:'icon-git.svg', phase:'1. 差分を見る',
  title:'いま git diff を打つと、何も出ません',
  why:'<b>差分</b>は「どこが、どう変わったか」です。まず、変更が無いときの形を見ます。',
  pre:[['git diff', '作業ディレクトリと、ステージングエリアの<b>違い</b>を表示します。何も変えません']],
  cmd:'git diff',
  cmdlabel:'打つコマンド',
  out:'5-diff-none',
  expect:'何も表示されずに、次の入力を待つ状態に戻ります。',
  after:'第4回の最後から、追跡しているファイルは変えていないので、違いがありません。<br>todo.md は作業ディレクトリにありますが、<b>追跡されていない</b>ファイルなので <code>git diff</code> には出ません。',
  ask:'何も出ませんでしたか？',
  ref:[pg.diff, ref.diff],
  tb:[]
},
{
  icon:'icon-vscode.svg', phase:'1. 差分を見る',
  title:'hello.md の1行を書き換え、1行を消します',
  why:'差分の読み方を練習するための変更です。',
  todo:{
    common:['hello.md で全部を選び、下の枠の中身を貼り付けます',
            '保存します']
  },
  textBox:true,
  cmdMulti:{ common:[paste(T.hello5)] },
  cmdlabel:'hello.md の中身（4行目が変わり、5行目が無くなります）',
  expect:'hello.md が4行（空の行を含む）になり、保存できています。',
  ask:'保存できましたか？',
  tb:[]
},
{
  icon:'icon-git.svg', phase:'1. 差分を見る',
  title:'差分を読みます',
  why:'<code>-</code> と <code>+</code> の行が、この回の主役です。',
  pre:[['git diff', '作業ディレクトリと、ステージングエリアの違いを表示します']],
  cmd:'git diff',
  cmdlabel:'打つコマンド',
  out:'5-diff',
  expect:'<code>-</code> で始まる行が2行、<code>+</code> で始まる行が1行出ます。',
  after:'上から順に読みます。<br>・<code>--- a/practice/hello.md</code> が<b>前</b>、<code>+++ b/practice/hello.md</code> が<b>後</b><br>・<code>@@ -1,5 +1,4 @@</code> は「前の1行目から5行ぶんが、後の1行目から4行ぶんになった」<br>・<code>-</code> で始まる行は<b>消えた行</b>、<code>+</code> で始まる行は<b>増えた行</b>、空白で始まる行は変わっていない行<br>1行を書き換えると、「古い行が消えて、新しい行が増えた」と表されます。',
  ask:'- の行が2行、+ の行が1行ありましたか？',
  ref:[pg.diff, ref.diff],
  tb:[
    { q:'色が付いていて、- と + が見えにくい',
      a:'色は、行の頭の <code>-</code> <code>+</code> と同じ意味です（赤が消えた行、緑が増えた行）。色が見分けにくいときは、行の頭の記号で読んでください。' }
  ]
},
{
  icon:'icon-git.svg', phase:'2. ステージした差分',
  title:'add すると、git diff には出なくなります',
  why:'<code>git diff</code> が<b>何と何を比べているか</b>を確かめます。',
  pre:[
    ['git add practice/hello.md', 'hello.md をステージングエリアに載せます'],
    ['git diff', 'もう一度、差分を表示します']
  ],
  cmdMulti:{ common:['git add practice/hello.md', 'git diff'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['5-add', '5-diff-after-add'],
  expect:'<code>git diff</code> が、何も出さなくなります。',
  after:'<code>git diff</code> は<b>作業ディレクトリとステージングエリア</b>を比べます。add で2つが同じ中身になったので、違いが無くなりました。<b>変更が消えたわけではありません。</b>',
  ask:'git diff が何も出さなくなりましたか？',
  ref:[pg.diff, ref.diff],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. ステージした差分',
  title:'ステージした差分は、--staged で見ます',
  why:'コミットする前に、<b>コミットに入るもの</b>を確かめる方法です。',
  pre:[['git diff --staged', '<b>ステージングエリアと、最後のコミット</b>の違いを表示します。つまり、いまコミットすると入る変更です']],
  cmd:'git diff --staged',
  cmdlabel:'打つコマンド',
  out:'5-diff-staged',
  expect:'前の画面で見たのと同じ差分が出ます。',
  after:'2つをまとめると、こうなります。<br>・<code>git diff</code> … 作業ディレクトリ と ステージングエリア の違い（まだ add していない変更）<br>・<code>git diff --staged</code> … ステージングエリア と 最後のコミット の違い（次のコミットに入る変更）',
  ask:'同じ差分が出ましたか？',
  ref:[pg.diff, ref.diff],
  tb:[
    { q:'--cached という書き方も見かけた',
      a:'<code>--staged</code> と <code>--cached</code> は同じ意味です（根拠: Pro Git 2.2・git diff の説明）。' }
  ]
},
{
  icon:'icon-git.svg', phase:'3. コミットする',
  title:'todo.md も載せて、変更の量を確かめます',
  why:'第4回で残した todo.md も、このコミットに入れます。',
  pre:[
    ['git add practice/todo.md', 'todo.md をステージングエリアに載せます'],
    ['git diff --staged --stat', 'コミットに入る変更を、<b>ファイルごとの行数だけ</b>で表示します（<code>--stat</code> ＝まとめ）']
  ],
  cmdMulti:{ common:['git add practice/todo.md', 'git diff --staged --stat'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['5-add-todo', '5-diff-stat'],
  expect:'hello.md と todo.md の2行と、<code>2 files changed</code> の行が出ます。',
  after:'<code>| 3 +--</code> は「3行が変わった（1行増えて、2行消えた）」という意味です。<code>+</code> と <code>-</code> の数が、増えた行・消えた行の数に合っています。',
  ask:'2 files changed と出ましたか？',
  ref:[pg.diff, ref.diff],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'3. コミットする',
  title:'確かめた内容で、コミットします',
  why:'差分を見てからコミットするのが、この回の目的です。',
  pre:[['git commit -m "hello.md の説明を直し、todo.md を足した"', 'ステージングエリアの中身でコミットを作ります']],
  cmd:'git commit -m "hello.md の説明を直し、todo.md を足した"',
  cmdlabel:'打つコマンド',
  out:'5-commit',
  expect:'<code>2 files changed, 4 insertions(+), 2 deletions(-)</code> と出ます。',
  after:'前の画面の <code>--stat</code> と、同じ数になっています。<code>create mode 100644 practice/todo.md</code> は「todo.md を新しく作った」という意味です。',
  ask:'2 files changed と出ましたか？',
  ref:[pg.commit, ref.commit],
  tb:[]
},
{
  icon:'icon-github.svg', phase:'4. プッシュする',
  title:'第4回と第5回のコミットを、フォークに送ります',
  why:'パソコンのコミットを、あなたのフォークにそろえます。',
  pre:[
    ['git push', 'まだ送っていないコミットを、<code>origin</code>（あなたのフォーク）に送ります'],
    ['git status', '送れたかを確かめます']
  ],
  cmdMulti:{ common:['git push', 'git status'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['5-push', '5-status'],
  expect:'<code>main -&gt; main</code> と出て、<code>git status</code> が <code>up to date with \'origin/main\'</code> と <code>working tree clean</code> を出します。',
  after:'<code>580eb38..0708793</code> は、第3回のコミットの次に、第4回と第5回の2つのコミットが加わったという意味です（番号はあなたの画面では違います）。',
  ask:'up to date と working tree clean が出ましたか？',
  ref:[pg.push, ref.push, gh.push],
  tb:[]
},
{
  kind:'fin',
  title:'差分を読んでから、コミットしました',
  lead:'<code>git diff</code> と <code>git diff --staged</code> を使い分けました。',
  gained:'<code>-</code> は消えた行、<code>+</code> は増えた行。<code>git diff</code> は<b>まだ add していない変更</b>、<code>--staged</code> は<b>次のコミットに入る変更</b>です。',
  criteria:[
    '<code>git status</code> が <code>working tree clean</code> を出す',
    'GitHub のあなたのフォークに practice/todo.md がある'
  ],
  deepenWhy:'差分の1行1行を、AI と一緒に読みます。<b>自分の読みを先に書く</b>のがコツです。',
  deepen:'下の git diff の出力を、1行ずつ私が読みます。読み間違いがあれば直してください。\n\n（ここに git diff の出力を貼る）\n\n私の読み:\n（例: @@ -1,5 +1,4 @@ は〇〇。- の行は〇〇。）\n\n最後に、git diff と git diff --staged が何と何を比べているかを、1行ずつで説明してください。',
  ref:[pg.diff],
  nextHref:'06-log.html',
  nextLabel:'第6回 履歴をたどる へ'
}
]};
