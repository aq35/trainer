// 第9回 ブランチとマージ — 1画面に1つずつ進むナビの中身。
// 書き方は design/curriculum.md の「3. 書き方の約束」。出力は content/runs/09-branch.mjs を実際に打って得たもの。
import { pg, ref } from '../refs.js';
import { T } from '../runs/_texts.mjs';

export const title = '第9回 ブランチとマージ';

const paste = (t) => t.replace(/\n$/, '');

export default {
key:'trainer-v2-09',
greeting:'この回で、<b>ブランチ</b>（main とは別に、コミットを積み重ねられる流れ）で試し、main に<b>マージ</b>（取り込む）します。<br>マージには2つの形があります。両方を出して、違いを見ます。',

common:[
  { when:'cmd', q:'fatal: not a git repository と出た',
    a:'trainer フォルダの外にいます。VS Code で trainer フォルダを開き、「ターミナル」→「新しいターミナル」で出し直してください。' },
  { when:'cmd', q:'画面の下に : や (END) が出て、打てなくなった',
    a:'出力が長いので、Git が<b>1画面ずつ見せる道具</b>（ページャ）で開いています。<span class="k">q</span> を押すと戻ります。' },
  { when:'cmd', q:'error: Your local changes to the following files would be overwritten と出た',
    a:'保存したまま、コミットしていない変更があるので、ブランチを切り替えられません（切り替えると、その変更が消えてしまうため）。<code>git status</code> で何が残っているかを見て、前の画面の add と commit が済んでいるか確かめてください。' },
  { when:'cmd', q:'見慣れない画面（エディタ）が開いてしまった',
    a:'<code>git merge</code> に <code>--no-edit</code> を付けずに打つと、マージコミットのメッセージを書くエディタが開くことがあります。画面の一番下の表示を AI に貼って「これを閉じる方法は？」と聞き、閉じてから <code>git status</code> で状態を確かめてください。' }
],

steps:[
{
  icon:'icon-git.svg', phase:'1. ブランチを作る',
  title:'いまあるブランチを見ます',
  why:'第3回から、ずっと <b>main</b> というブランチでコミットしてきました。',
  pre:[['git branch', '手元のブランチの一覧を表示します。何も変えません']],
  cmd:'git branch',
  cmdlabel:'打つコマンド',
  out:'9-branch',
  expect:'<code>* main</code> の1行が出ます。',
  after:'<code>*</code> は「<b>いまいるブランチ</b>」の印です。',
  ask:'* main と出ましたか？',
  ref:[pg.branches, ref.branch],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'1. ブランチを作る',
  title:'ブランチを作って、移ります',
  why:'main を変えずに試すための、別の流れを作ります。',
  pre:[
    ['git switch -c try-greeting', '<code>try-greeting</code> という名前のブランチを作り（<code>-c</code> ＝ create）、そこへ移ります'],
    ['git branch', 'ブランチの一覧を表示します']
  ],
  cmdMulti:{ common:['git switch -c try-greeting', 'git branch'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['9-switch-c', '9-branch-2'],
  expect:'<code>Switched to a new branch \'try-greeting\'</code> と出て、一覧の <code>*</code> が try-greeting に付きます。',
  after:'作ったばかりのブランチは、main と<b>同じコミット</b>を指しています。ここからのコミットは、try-greeting にだけ積み重なります。',
  ask:'* が try-greeting に付きましたか？',
  ref:[pg.newBranch, ref.switch, ref.rel223],
  tb:[
    { q:'Pro Git には git checkout -b と書いてある',
      a:'Pro Git 日本語版は、<code>git switch</code> が加わる前（Git 2.23 より前）の書き方です。<code>git checkout -b 名前</code> と <code>git switch -c 名前</code> は、ブランチを作って移るという点で同じ動きです。この教材は、いまの Git の案内に合わせて <code>git switch</code> を使います。' }
  ]
},
{
  icon:'icon-vscode.svg', phase:'2. ブランチでコミットする',
  title:'hello.md に、あいさつを足します',
  why:'try-greeting での変更です。',
  todo:{
    common:['hello.md で全部を選び、下の枠の中身を貼り付けます',
            '保存します']
  },
  textBox:true,
  cmdMulti:{ common:[paste(T.hello9)] },
  cmdlabel:'hello.md の中身（最後の行が増えています）',
  expect:'最後に「こんにちは、ブランチ。」があり、保存できています。',
  ask:'保存できましたか？',
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. ブランチでコミットする',
  title:'ブランチで、コミットします',
  why:'いつもと同じ add と commit です。入る先が try-greeting になります。',
  pre:[
    ['git add practice/hello.md', 'hello.md をステージングエリアに載せます'],
    ['git commit -m "あいさつを足した"', 'コミットします']
  ],
  cmdMulti:{ common:['git add practice/hello.md', 'git commit -m "あいさつを足した"'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['9-add', '9-commit'],
  expect:'<code>[try-greeting 英数字] あいさつを足した</code> と出ます。',
  after:'角かっこの中が、<code>main</code> ではなく <code>try-greeting</code> になっています。',
  ask:'[try-greeting …] と出ましたか？',
  ref:[pg.basicBranching, ref.commit],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. ブランチでコミットする',
  title:'main は、1つ前に置いてきました',
  why:'履歴の横の名前で、ブランチがどのコミットを指しているかが分かります。',
  pre:[['git log --oneline -3', '履歴を3件表示します']],
  cmd:'git log --oneline -3',
  cmdlabel:'打つコマンド',
  out:'9-log',
  expect:'いちばん上に <code>(HEAD -&gt; try-greeting)</code>、2行目に <code>main</code> が付いています。',
  after:'<b>ブランチは、コミットを指している名前</b>です。try-greeting は新しいコミット <code>47158bd</code> を、main は1つ前の <code>1b3433c</code> を指しています。<code>HEAD -&gt;</code> は、いまいるブランチの印です。',
  ask:'try-greeting と main が、違う行に付いていますか？',
  ref:[pg.branches, ref.log],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'3. main に戻る',
  title:'main に戻ると、ファイルも戻ります',
  why:'ブランチを移ると、<b>作業ディレクトリの中身も、そのブランチの中身に入れ替わります</b>。',
  pre:[
    ['git switch main', 'main ブランチに移ります'],
    ['cat practice/hello.md', 'hello.md の中身を表示します（<code>cat</code> は Mac のターミナルでも、Windows の PowerShell でも使えます）']
  ],
  cmdMulti:{ common:['git switch main', 'cat practice/hello.md'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['9-switch-main', '9-cat-main'],
  expect:'hello.md に「こんにちは、ブランチ。」の行がありません。VS Code で開いている hello.md からも消えます。',
  after:'あいさつの行は、消えたのではなく <b>try-greeting のコミットにだけ</b>あります。<code>git switch try-greeting</code> で戻れば、また現れます。',
  ask:'あいさつの行が無くなりましたか？',
  ref:[pg.switching, ref.switch],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'4. マージする（fast-forward）',
  title:'try-greeting を、main にマージします',
  why:'<b>マージ</b>は、別のブランチのコミットを、いまのブランチに取り込むことです。',
  pre:[
    ['git merge try-greeting', 'try-greeting のコミットを、いまいる main に取り込みます'],
    ['git log --oneline -3', '履歴を3件表示します']
  ],
  cmdMulti:{ common:['git merge try-greeting', 'git log --oneline -3'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['9-merge-ff', '9-log-ff'],
  expect:'<code>Fast-forward</code> と出て、いちばん上の行に <code>HEAD -&gt; main, try-greeting</code> が付きます。',
  after:'<b>fast-forward</b> は、main が try-greeting の<b>1つ前にそのまま並んでいた</b>ので、main の指す先を先に進めただけのマージです。新しいコミットは作られていません。<br>いまは main も try-greeting も、同じ <code>47158bd</code> を指しています。',
  ask:'Fast-forward と出ましたか？',
  ref:[pg.basicBranching, ref.merge],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'5. マージする（マージコミット）',
  title:'もう1つブランチを作ります',
  why:'今度は、<b>main も先に進んだ</b>状態でマージします。',
  pre:[['git switch -c add-list', '<code>add-list</code> というブランチを作って、移ります']],
  cmd:'git switch -c add-list',
  cmdlabel:'打つコマンド',
  out:'9-switch-c2',
  expect:'<code>Switched to a new branch \'add-list\'</code> と出ます。',
  after:'add-list も、いまの main と同じコミットから始まります。',
  ask:'add-list に移りましたか？',
  ref:[pg.newBranch, ref.switch],
  tb:[]
},
{
  icon:'icon-vscode.svg', phase:'5. マージする（マージコミット）',
  title:'新しいファイル list.md を作ります',
  why:'add-list での変更です。',
  todo:{
    common:['practice フォルダに <code>list.md</code> を作ります',
            '下の枠の中身を貼り付けて、保存します']
  },
  textBox:true,
  cmdMulti:{ common:[paste(T.list9)] },
  cmdlabel:'list.md の中身',
  expect:'practice フォルダに list.md があり、保存できています。',
  ask:'list.md を作れましたか？',
  tb:[]
},
{
  icon:'icon-git.svg', phase:'5. マージする（マージコミット）',
  title:'add-list でコミットして、main に戻ります',
  why:'add-list にコミットを1つ積んでから、main に戻ります。',
  pre:[
    ['git add practice/list.md', 'list.md をステージングエリアに載せます'],
    ['git commit -m "覚えたコマンドの一覧を作った"', 'add-list にコミットします'],
    ['git switch main', 'main に戻ります']
  ],
  cmdMulti:{ common:['git add practice/list.md', 'git commit -m "覚えたコマンドの一覧を作った"', 'git switch main'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['9-add-list', '9-commit-list', '9-switch-main-2'],
  expect:'<code>[add-list 英数字]</code> のあとに <code>Switched to branch \'main\'</code> と出ます。VS Code の一覧から list.md が消えます。',
  after:'list.md は add-list のコミットにだけあるので、main では見えません。<br><code>ahead of \'origin/main\' by 1 commit</code> は、fast-forward で進めた main をまだ送っていないという意味です。',
  ask:'main に戻れましたか？',
  ref:[pg.switching, ref.switch],
  tb:[]
},
{
  icon:'icon-vscode.svg', phase:'5. マージする（マージコミット）',
  title:'main でも、todo.md を変えます',
  why:'これで、main と add-list が<b>別々に進んだ</b>状態になります。',
  todo:{
    common:['todo.md で全部を選び、下の枠の中身を貼り付けます',
            '保存します']
  },
  textBox:true,
  cmdMulti:{ common:[paste(T.todo9)] },
  cmdlabel:'todo.md の中身（最後の行が増えています）',
  expect:'最後に「- ブランチを覚える」があり、保存できています。',
  ask:'保存できましたか？',
  tb:[]
},
{
  icon:'icon-git.svg', phase:'5. マージする（マージコミット）',
  title:'main でコミットします',
  why:'main にもコミットを1つ積みます。',
  pre:[
    ['git add practice/todo.md', 'todo.md をステージングエリアに載せます'],
    ['git commit -m "todo.md にブランチを足した"', 'main にコミットします']
  ],
  cmdMulti:{ common:['git add practice/todo.md', 'git commit -m "todo.md にブランチを足した"'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['9-add-todo', '9-commit-todo'],
  expect:'<code>[main 英数字] todo.md にブランチを足した</code> と出ます。',
  after:'main と add-list は、同じコミットから<b>別々の方向に1つずつ</b>進みました。',
  ask:'[main …] と出ましたか？',
  ref:[pg.basicBranching, ref.commit],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'5. マージする（マージコミット）',
  title:'add-list をマージし、枝分かれを見ます',
  why:'両方が進んでいるときは、Git が<b>2つをまとめるコミット</b>を作ります。',
  pre:[
    ['git merge --no-edit add-list', 'add-list を main に取り込みます。<code>--no-edit</code> ＝マージのメッセージは Git が付けたものをそのまま使う（エディタを開かない）'],
    ['git log --oneline --graph -5', '履歴を5件、<b>枝分かれの線つき</b>で表示します（<code>--graph</code>）']
  ],
  cmdMulti:{ common:['git merge --no-edit add-list', 'git log --oneline --graph -5'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['9-merge', '9-graph'],
  expect:'<code>Merge made by the \'ort\' strategy.</code> と出て、履歴に <code>|\\</code> と <code>|/</code> の線が出ます。',
  after:'線の読み方です。<code>*</code> が1つのコミットで、線が上下のつながりです。<br>・<code>47158bd</code> から2本に分かれ、main の <code>0a13e4c</code> と add-list の <code>92016a4</code> が並んで進んでいる<br>・いちばん上の <code>e813738 Merge branch \'add-list\'</code> が2本をまとめた<b>マージコミット</b><br>fast-forward と違い、今回は<b>新しいコミットが1つ作られました</b>。<code>\'ort\'</code> は、Git がマージに使った方法の名前です。',
  ask:'Merge made by と、枝分かれの線が出ましたか？',
  ref:[pg.merging, ref.merge, ref.rel234],
  tb:[
    { q:'Pro Git には \'recursive\' strategy と書いてある',
      a:'Git 2.34 から、マージの既定の方法が <code>ort</code> に変わりました（根拠のリリースノートを参照）。Pro Git 日本語版は、それより前の出力です。' }
  ]
},
{
  icon:'icon-github.svg', phase:'6. 片付ける',
  title:'使い終わったブランチを消して、フォークに送ります',
  why:'マージが済んだブランチの名前は、もう要りません。',
  pre:[
    ['git branch -d try-greeting add-list', '2つのブランチの<b>名前</b>を消します。<code>-d</code> は、マージが済んでいるときだけ消せます'],
    ['git push', 'main を、あなたのフォークに送ります']
  ],
  cmdMulti:{ common:['git branch -d try-greeting add-list', 'git push'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['9-branch-d', '9-push'],
  expect:'<code>Deleted branch</code> の行が2つと、<code>main -&gt; main</code> が出ます。',
  after:'消えたのは<b>ブランチの名前だけ</b>です。コミットは main の履歴に取り込まれているので、残っています（<code>(was 47158bd)</code> は、消した名前が指していたコミット）。<br>マージが済んでいないブランチを <code>-d</code> で消そうとすると、Git は断ります。',
  ask:'Deleted branch が2つと、main -> main が出ましたか？',
  ref:[pg.branchMgmt, ref.branch, ref.push],
  tb:[]
},
{
  kind:'fin',
  title:'ブランチで試して、マージしました',
  lead:'fast-forward と、マージコミットを作るマージの両方をしました。',
  gained:'ブランチは<b>コミットを指す名前</b>です。main が先に進んでいなければ fast-forward、両方が進んでいればマージコミットができます。<code>git log --oneline --graph</code> で枝分かれが見えます。',
  criteria:[
    '<code>git log --oneline --graph -5</code> に、枝分かれの線と <code>Merge branch \'add-list\'</code> がある',
    '<code>git branch</code> が <code>* main</code> だけを出す'
  ],
  deepenWhy:'fast-forward とマージコミットの違いを、自分の言葉で説明して、AI に直してもらいます。',
  deepen:'私の理解を書きます。間違っているところだけ、理由と一緒に直してください。\n\n（ここに書く。例: fast-forward になるのは〇〇のとき。マージコミットができるのは〇〇のとき。ブランチを消してもコミットが残るのは〇〇だから）\n\n最後に、Pro Git 日本語版 3.2「ブランチとマージの基本」と比べて、ずれている所があれば教えてください。',
  ref:[pg.merging],
  nextHref:'10-conflict.html',
  nextLabel:'第10回 コンフリクト へ'
}
]};
