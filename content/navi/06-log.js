// 第6回 履歴をたどる — 1画面に1つずつ進むナビの中身。
// 書き方は design/curriculum.md の「3. 書き方の約束」。出力は content/runs/06-log.mjs を実際に打って得たもの。
// この教材の本物の履歴は、受講者のフォークでは先に進んでいる。出力が誰でも同じになるよう、c68c135 から数える。
import { pg, ref } from '../refs.js';

export const title = '第6回 履歴をたどる';

export default {
key:'trainer-v2-06',
greeting:'この回は、<b>何も変えずに、読むだけ</b>です。<br>あなたのコミットと、この教材を作ったときの本物の履歴から、<b>いつ・誰が・何を・なぜ</b>変えたかを探します。',

common:[
  { when:'cmd', q:'fatal: not a git repository と出た',
    a:'trainer フォルダの外にいます。VS Code で trainer フォルダを開き、「ターミナル」→「新しいターミナル」で出し直してください。' },
  { when:'cmd', q:'画面の下に : や (END) が出て、打てなくなった',
    a:'出力が長いので、Git が<b>1画面ずつ見せる道具</b>（ページャ）で開いています。<span class="k">q</span> を押すと戻ります。<span class="k">Space</span> で次の画面に進めます。' },
  { when:'cmd', q:'unknown revision c68c135 と出た',
    a:'打ち間違いがないか確かめてください（<code>c68c135</code> は、数字の 6・8・1・3・5 と英字の c です）。' }
],

steps:[
{
  icon:'icon-git.svg', phase:'1. 自分の履歴',
  title:'コミットの中身を、省略せずに見ます',
  why:'<code>--oneline</code> を付けないと、1つのコミットに書かれていることが全部出ます。',
  pre:[['git log -3', 'コミットの履歴を、新しい順に3件表示します。何も変えません']],
  cmd:'git log -3',
  cmdlabel:'打つコマンド',
  out:'6-log-3',
  expect:'<code>commit</code>・<code>Author:</code>・<code>Date:</code> と、コミットメッセージの組が3つ出ます。',
  after:'1つのコミットに、次のことが書かれています。<br>・<code>commit</code> のあとの40文字 … コミットの番号（ハッシュ）。<code>--oneline</code> で出ていたのは、この先頭7文字<br>・<code>Author:</code> … 誰が（第1回で設定した名前とメールアドレス）<br>・<code>Date:</code> … いつ<br>・字下げされた行 … なぜ（コミットメッセージ）<br><code>(HEAD -&gt; main, origin/main, origin/HEAD)</code> は、<b>そのコミットを指している名前</b>です。<code>HEAD -&gt; main</code> は「いま main にいる」、<code>origin/main</code> は「フォークの main もここ」という意味です。',
  ask:'commit・Author・Date の組が3つ出ましたか？',
  ref:[pg.log, ref.log],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'1. 自分の履歴',
  title:'practice フォルダを変えたコミットだけを見ます',
  why:'フォルダやファイルを指定すると、<b>そこを変えたコミットだけ</b>に絞れます。',
  pre:[['git log --oneline -- practice/', 'practice/ の中を変えたコミットだけを、1件1行で表示します。<code>--</code> のあとに、絞りたいフォルダやファイルを書きます']],
  cmd:'git log --oneline -- practice/',
  cmdlabel:'打つコマンド',
  out:'6-log-practice',
  expect:'あなたが第3〜5回でしたコミットの3行だけが出ます。',
  after:'この教材を作った人のコミットは、practice/ を変えていないので出ません。',
  ask:'あなたのコミットの3行だけが出ましたか？',
  ref:[pg.limitLog, ref.log],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'1. 自分の履歴',
  title:'最後に hello.md を変えたコミットを、差分つきで見ます',
  why:'「<b>何を</b>変えたか」まで、1回で見る方法です。',
  pre:[['git log -p -1 -- practice/hello.md', 'hello.md を変えたコミットを1件、<b>差分つき</b>で表示します（<code>-p</code> ＝差分も出す、<code>-1</code> ＝1件）']],
  cmd:'git log -p -1 -- practice/hello.md',
  cmdlabel:'打つコマンド',
  out:'6-log-p',
  expect:'第5回のコミットと、その差分（<code>-</code> と <code>+</code> の行）が出ます。',
  after:'前の画面の <code>git log</code> の形に、第5回で読んだ <code>git diff</code> の形がつながっています。<b>いつ・誰が・なぜ・何を</b>が、1つの出力にそろいました。',
  ask:'コミットと差分が一緒に出ましたか？',
  ref:[pg.log, ref.log],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. 教材の本物の履歴',
  title:'この教材が作られたときの履歴を見ます',
  why:'あなたのフォークには、<b>この教材を作ったときのコミット</b>も全部入っています。',
  pre:[['git log --oneline -3 c68c135', '<code>c68c135</code> というコミットから、古いほうへ3件を表示します']],
  cmd:'git log --oneline -3 c68c135',
  cmdlabel:'打つコマンド',
  out:'6-log-base',
  expect:'<code>c68c135 設計: Git だけを教える教材に作り直す案</code> から始まる3行が出ます。',
  after:'<code>git log</code> のあとにコミットの番号を書くと、<b>そのコミットから</b>古いほうへたどります。<br>この教材の履歴は今も増えているので、番号を指定しないと、あなたの画面と下の出力は合いません。この回では、誰の画面でも同じになるよう <code>c68c135</code> から数えます。',
  ask:'c68c135 から始まる3行が出ましたか？',
  ref:[pg.log, ref.log],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. 教材の本物の履歴',
  title:'そのコミットで、どのファイルが変わったかを見ます',
  why:'<code>git show</code> は、1つのコミットを詳しく見るコマンドです。',
  pre:[['git show --stat --oneline c68c135', 'c68c135 のコミットで変わったファイルを、行数のまとめで表示します']],
  cmd:'git show --stat --oneline c68c135',
  cmdlabel:'打つコマンド',
  out:'6-show-base',
  expect:'<code>design/curriculum.md | 126 +++…</code> と <code>1 file changed, 126 insertions(+)</code> が出ます。',
  after:'このコミットでは、教材の設計を書いたファイル <code>design/curriculum.md</code> を1つ、126行で作っています。メッセージには「全16回」とありますが、いまの教材は全10回です。<b>設計は、このあとのコミットで変わりました</b>。気になったら、<code>git log --oneline -- design/curriculum.md</code> で、このファイルの履歴をたどれます。',
  ask:'design/curriculum.md が出ましたか？',
  ref:[ref.show, pg.log],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. 教材の本物の履歴',
  title:'1つのファイルの履歴をたどります',
  why:'「このファイルは、いつ、なぜ変わったのか」を調べる形です。',
  pre:[['git log --oneline -3 c68c135 -- README.md', 'c68c135 から古いほうへ、<b>README.md を変えたコミットだけ</b>を3件表示します']],
  cmd:'git log --oneline -3 c68c135 -- README.md',
  cmdlabel:'打つコマンド',
  out:'6-log-file',
  expect:'<code>908d5bc</code> から始まる3行が出ます。',
  after:'出発点に指定したコミットそのものは README.md を変えていないので、出てきません。コミットの番号と <code>-- ファイル</code> は、一緒に使えます。',
  ask:'908d5bc から始まる3行が出ましたか？',
  ref:[pg.limitLog, ref.log],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. 教材の本物の履歴',
  title:'コミットメッセージの言葉で探します',
  why:'「あの変更はどこだっけ」を、言葉で探す方法です。',
  pre:[['git log --oneline --grep="Git-Flow" c68c135', 'c68c135 から古いほうへ、<b>コミットメッセージに Git-Flow を含む</b>コミットを表示します']],
  cmd:'git log --oneline --grep="Git-Flow" c68c135',
  cmdlabel:'打つコマンド',
  out:'6-log-grep',
  expect:'4行出ます。いちばん上は <code>d15130b</code> です。',
  after:'いちばん上の <code>d15130b</code> の1行目には、Git-Flow という言葉がありません。<code>--grep</code> は、<code>--oneline</code> で見えている1行目だけでなく、<b>メッセージの2行目以降も</b>探しているからです。<code>git show d15130b</code> を打つと、メッセージの全部を確かめられます。',
  ask:'4行出ましたか？',
  ref:[pg.limitLog, ref.log],
  tb:[]
},
{
  kind:'fin',
  title:'履歴から、いつ・誰が・何を・なぜを探しました',
  lead:'この回は、何も変えていません。',
  gained:'<code>git log</code> は、<b>件数</b>（<code>-3</code>）・<b>場所</b>（<code>-- ファイル</code>）・<b>言葉</b>（<code>--grep</code>）・<b>出発点</b>（コミットの番号）で絞れます。<code>git show</code> で1つのコミットを詳しく見られます。',
  criteria:[
    '<code>git status</code> が <code>working tree clean</code> を出す（何も変えていない）'
  ],
  deepenWhy:'よいコミットメッセージとは何かを、この教材の本物の履歴を材料に考えます。',
  deepen:'git log --oneline -10 c68c135 の出力を貼ります。\n\n（ここに貼る）\n\nこの中で「あとから読んで、なぜ変えたかが分かる」メッセージと、分かりにくいメッセージを、私が先に選びます。私の選び方が妥当か、理由と一緒に教えてください。\n\n私の選び方:\n（ここに書く）',
  ref:[pg.log],
  nextHref:'07-undo.html',
  nextLabel:'第7回 取り消す へ'
}
]};
