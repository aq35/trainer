// 第10回 コンフリクト — 1画面に1つずつ進むナビの中身。
// 書き方は design/curriculum.md の「3. 書き方の約束」。出力は content/runs/10-conflict.mjs を実際に打って得たもの。
import { pg, ref, gh, vs } from '../refs.js';
import { T } from '../runs/_texts.mjs';

export const title = '第10回 コンフリクト';

const paste = (t) => t.replace(/\n$/, '');

export default {
key:'trainer-v2-10',
greeting:'最後の回です。2つのブランチで<b>同じ行</b>を別々に変えて、<b>コンフリクト</b>（Git が自動ではまとめられない食い違い）を起こし、自分で解決します。<br>解決したマージをフォークに送り、GitHub で確かめたら、全10回の終わりです。',

common:[
  { when:'cmd', q:'fatal: not a git repository と出た',
    a:'trainer フォルダの外にいます。VS Code で trainer フォルダを開き、「ターミナル」→「新しいターミナル」で出し直してください。' },
  { when:'cmd', q:'画面の下に : や (END) が出て、打てなくなった',
    a:'出力が長いので、Git が<b>1画面ずつ見せる道具</b>（ページャ）で開いています。<span class="k">q</span> を押すと戻ります。' },
  { when:'cmd', q:'見慣れない画面（エディタ）が開いてしまった',
    a:'<code>--no-edit</code> を付けずに打つと、メッセージを書くエディタが開くことがあります。画面の一番下の表示を AI に貼って「これを閉じる方法は？」と聞き、閉じてから <code>git status</code> で状態を確かめてください。' },
  { q:'途中で分からなくなった',
    a:'マージの途中なら、<code>git merge --abort</code> で<b>マージを始める前</b>に戻れます（この回の★の画面）。そのあと <code>git status</code> で確かめ、コンフリクトを起こす画面からやり直してください。' }
],

steps:[
{
  icon:'icon-git.svg', phase:'1. 食い違いを作る',
  title:'ブランチを作って、移ります',
  why:'1つ目の変更は、ブランチで作ります。',
  pre:[['git switch -c change-title', '<code>change-title</code> というブランチを作って、移ります']],
  cmd:'git switch -c change-title',
  cmdlabel:'打つコマンド',
  out:'10-switch-c',
  expect:'<code>Switched to a new branch \'change-title\'</code> と出ます。',
  after:'第9回と同じ操作です。',
  ask:'change-title に移りましたか？',
  ref:[pg.newBranch, ref.switch],
  tb:[]
},
{
  icon:'icon-vscode.svg', phase:'1. 食い違いを作る',
  title:'hello.md の題名を変えます（ブランチ側）',
  why:'1行目の題名を「Git の練習帳」にします。',
  todo:{
    common:['hello.md で全部を選び、下の枠の中身を貼り付けます',
            '保存します']
  },
  textBox:true,
  cmdMulti:{ common:[paste(T.hello10branch)] },
  cmdlabel:'hello.md の中身（1行目が変わります）',
  expect:'1行目が <code># Git の練習帳</code> になり、保存できています。',
  ask:'保存できましたか？',
  tb:[]
},
{
  icon:'icon-git.svg', phase:'1. 食い違いを作る',
  title:'ブランチでコミットして、main に戻ります',
  why:'ブランチ側の変更を、コミットにしておきます。',
  pre:[
    ['git add practice/hello.md', 'hello.md をステージングエリアに載せます'],
    ['git commit -m "題名を「Git の練習帳」にした"', 'change-title にコミットします'],
    ['git switch main', 'main に戻ります']
  ],
  cmdMulti:{ common:['git add practice/hello.md', 'git commit -m "題名を「Git の練習帳」にした"', 'git switch main'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['10-add-branch', '10-commit-branch', '10-switch-main'],
  expect:'<code>[change-title 英数字]</code> のあとに <code>Switched to branch \'main\'</code> と出ます。',
  after:'main に戻ったので、hello.md の1行目は <code># はじめての Git</code> に戻っています。',
  ask:'main に戻れましたか？',
  ref:[pg.basicBranching, ref.commit, ref.switch],
  tb:[]
},
{
  icon:'icon-vscode.svg', phase:'1. 食い違いを作る',
  title:'main でも、同じ1行目を変えます',
  why:'同じ行を、ブランチとは<b>違う文</b>にします。これが食い違いになります。',
  todo:{
    common:['hello.md で全部を選び、下の枠の中身を貼り付けます',
            '保存します']
  },
  textBox:true,
  cmdMulti:{ common:[paste(T.hello10main)] },
  cmdlabel:'hello.md の中身（1行目が変わります）',
  expect:'1行目が <code># はじめての Git（練習）</code> になり、保存できています。',
  ask:'保存できましたか？',
  tb:[]
},
{
  icon:'icon-git.svg', phase:'1. 食い違いを作る',
  title:'main でコミットします',
  why:'これで、main と change-title が<b>同じ行を別々に変えた</b>状態になります。',
  pre:[
    ['git add practice/hello.md', 'hello.md をステージングエリアに載せます'],
    ['git commit -m "題名に（練習）を足した"', 'main にコミットします']
  ],
  cmdMulti:{ common:['git add practice/hello.md', 'git commit -m "題名に（練習）を足した"'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['10-add-main', '10-commit-main'],
  expect:'<code>[main 英数字] 題名に（練習）を足した</code> と出ます。',
  after:'第9回の add-list は<b>別のファイル</b>を変えたので、Git が自動でまとめられました。今回は<b>同じファイルの同じ行</b>です。',
  ask:'[main …] と出ましたか？',
  ref:[pg.basicBranching, ref.commit],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. コンフリクトを読む',
  title:'マージすると、コンフリクトが起きます',
  why:'わざと起こしています。<b>失敗ではありません。</b>',
  pre:[['git merge --no-edit change-title', 'change-title を main に取り込もうとします']],
  cmd:'git merge --no-edit change-title',
  cmdlabel:'打つコマンド',
  out:'10-merge-conflict',
  expect:'<code>CONFLICT (content): Merge conflict in practice/hello.md</code> と出ます。',
  after:'「practice/hello.md の<b>中身</b>で食い違いが起きた」という意味です。最後の行 <code>Automatic merge failed; fix conflicts and then commit the result.</code> は「自動のマージはできなかった。食い違いを直してから、コミットしてください」です。<br><b>マージは途中で止まっています。</b>何も壊れていません。',
  ask:'CONFLICT と出ましたか？',
  ref:[pg.conflicts, ref.merge],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. コンフリクトを読む',
  title:'いまの状態を、Git に聞きます',
  why:'コンフリクトのときも、まず <code>git status</code> です。',
  pre:[['git status', 'いまの状態を表示します']],
  cmd:'git status',
  cmdlabel:'打つコマンド',
  out:'10-status-conflict',
  expect:'<code>Unmerged paths:</code> の下に <code>both modified:   practice/hello.md</code> が出ます。',
  after:'<code>both modified</code> は「<b>両方のブランチで変えられた</b>」という意味です。<br>Git は、次にできることを2つ案内しています。<br>・<code>(fix conflicts and run "git commit")</code> … 直してからコミットする<br>・<code>(use "git merge --abort" to abort the merge)</code> … マージをやめて、始める前に戻る',
  ask:'both modified と出ましたか？',
  ref:[pg.conflicts, ref.status],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. コンフリクトを読む',
  title:'食い違っている場所を、ファイルで見ます',
  why:'Git は、食い違った行の両方を、<b>印を付けてファイルに書き込んでいます</b>。',
  pre:[['cat practice/hello.md', 'hello.md の中身を表示します']],
  cmd:'cat practice/hello.md',
  cmdlabel:'打つコマンド',
  out:'10-cat-conflict',
  expect:'<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code>・<code>=======</code>・<code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; change-title</code> の3つの印が出ます。',
  after:'印の読み方です。<br>・<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> から <code>=======</code> まで … <b>いまいる main</b> の中身<br>・<code>=======</code> から <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; change-title</code> まで … <b>取り込もうとした change-title</b> の中身<br>印の外の行（題名より下の行）は、食い違っていないので、そのままです。<br>VS Code で hello.md を開くと、同じ場所に色と <b>Accept Current Change</b> などのボタンが出ます（根拠: VS Code の説明）。',
  ask:'3つの印が出ましたか？',
  ref:[pg.conflicts, gh.conflictCli, vs.conflicts],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'3. 仕切り直す',
  title:'★ いったん、マージをやめます',
  why:'打つ前に確かめます。<b>やめると、マージを始める前の状態に戻ります</b>。main のコミットも、change-title のコミットも消えません。',
  pre:[
    ['git merge --abort', '途中のマージをやめて、<b>マージを始める前の状態</b>に戻します'],
    ['git status', '確かめます']
  ],
  cmdMulti:{ common:['git merge --abort', 'git status'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['10-abort', '10-status-abort'],
  expect:'<code>nothing to commit, working tree clean</code> と出ます。hello.md から印が消えます。',
  after:'答え合わせです。<br>・<b>変わったこと</b>: マージの途中の状態と、ファイルの印が消えた<br>・<b>消えないもの</b>: main と change-title の、どちらのコミットも<br>・<b>戻し方</b>: もう一度 <code>git merge</code> すれば、同じコンフリクトが起きる<br>分からなくなったら、ここに戻れる。これが、コンフリクトを怖がらなくてよい理由です。',
  ask:'working tree clean に戻りましたか？',
  ref:[pg.conflicts, ref.merge],
  tb:[
    { q:'マージの前に、保存しただけの変更があった',
      a:'この教材の手順どおりなら、マージの前に変更は残っていません。自分の作業でコミットしていない変更があるときは、<b>先にコミットしてからマージ</b>してください。git merge の説明には、マージの前にコミットしていない変更があると <code>--abort</code> で元に戻せないことがある、と書かれています。' }
  ]
},
{
  icon:'icon-git.svg', phase:'4. 解決する',
  title:'もう一度マージして、コンフリクトを起こします',
  why:'今度は、最後まで解決します。',
  pre:[['git merge --no-edit change-title', 'change-title を main に取り込もうとします']],
  cmd:'git merge --no-edit change-title',
  cmdlabel:'打つコマンド',
  out:'10-merge-again',
  expect:'さっきと同じ <code>CONFLICT</code> の3行が出ます。',
  after:'同じコンフリクトが、同じ形で起きました。',
  ask:'CONFLICT と出ましたか？',
  ref:[pg.conflicts, ref.merge],
  tb:[]
},
{
  icon:'icon-vscode.svg', phase:'4. 解決する',
  title:'印を消して、残したい中身にします',
  why:'<b>解決</b>とは、印を全部消して、ファイルを「こうしたい」という中身にすることです。どちらか一方を選んでも、両方を合わせても構いません。',
  todo:{
    common:['hello.md で全部を選び、下の枠の中身を貼り付けます（今回は、両方の題名を合わせた形にします）',
            '<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>・<code>=======</code>・<code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> の印が<b>1つも残っていない</b>ことを確かめます',
            '保存します']
  },
  textBox:true,
  cmdMulti:{ common:[paste(T.hello10fixed)] },
  cmdlabel:'hello.md の中身（解決したあと）',
  expect:'1行目が <code># Git の練習帳（はじめての Git）</code> になり、印が無く、保存できています。',
  note:'自分の作業では、VS Code の <b>Accept Current Change</b>（main の中身を残す）・<b>Accept Incoming Change</b>（取り込む側を残す）・<b>Accept Both Changes</b>（両方を残す）のボタンでも直せます。どれを押しても、最後に<b>印が残っていないか</b>を目で確かめます。',
  ask:'印が無くなり、保存できましたか？',
  tb:[]
},
{
  icon:'icon-git.svg', phase:'4. 解決する',
  title:'解決したことを、Git に伝えます',
  why:'コンフリクトを直したファイルは、<code>git add</code> で「解決した」と伝えます。',
  pre:[
    ['git add practice/hello.md', '解決した hello.md をステージングエリアに載せます。これが「解決した」の合図になります'],
    ['git status', '確かめます']
  ],
  cmdMulti:{ common:['git add practice/hello.md', 'git status'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['10-add-fixed', '10-status-fixed'],
  expect:'<code>All conflicts fixed but you are still merging.</code> と出ます。',
  after:'「コンフリクトは全部直ったが、<b>マージはまだ途中</b>」という意味です。次の行の <code>(use "git commit" to conclude merge)</code> が、終わらせ方の案内です。',
  ask:'All conflicts fixed と出ましたか？',
  ref:[pg.conflicts, gh.conflictCli],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'4. 解決する',
  title:'マージコミットを作って、マージを終えます',
  why:'第9回と同じ<b>マージコミット</b>ができます。今回は、あなたが解決した中身で作られます。',
  pre:[
    ['git commit --no-edit', 'マージを終わらせるコミットを作ります。<code>--no-edit</code> ＝メッセージは Git が用意したもの（Merge branch \'change-title\'）をそのまま使う'],
    ['git log --oneline --graph -6', '履歴を6件、枝分かれの線つきで表示します']
  ],
  cmdMulti:{ common:['git commit --no-edit', 'git log --oneline --graph -6'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['10-commit-merge', '10-graph'],
  expect:'<code>Merge branch \'change-title\'</code> のコミットができ、枝分かれの線が2か所に出ます。',
  after:'上の枝分かれが今回のもの（<code>ddd700d</code> と <code>82bcb1d</code> を <code>c48cd86</code> でまとめた）、下の枝分かれが第9回のものです。',
  ask:'Merge branch \'change-title\' のコミットができましたか？',
  ref:[pg.conflicts, ref.commit, ref.log],
  tb:[]
},
{
  icon:'icon-github.svg', phase:'5. 送る',
  title:'ブランチを片付けて、フォークに送ります',
  why:'全10回の、最後のプッシュです。',
  pre:[
    ['git branch -d change-title', 'マージが済んだ change-title の名前を消します'],
    ['git push', 'main を、あなたのフォークに送ります'],
    ['git status', '確かめます']
  ],
  cmdMulti:{ common:['git branch -d change-title', 'git push', 'git status'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['10-branch-d', '10-push', '10-status'],
  expect:'<code>main -&gt; main</code> と出て、<code>git status</code> が <code>up to date</code> と <code>working tree clean</code> を出します。',
  after:'解決したマージコミットが、あなたのフォークに届きました。',
  ask:'up to date と working tree clean が出ましたか？',
  ref:[pg.push, ref.push, ref.branch],
  tb:[]
},
{
  icon:'icon-github.svg', phase:'6. 確かめる',
  title:'GitHub の画面で、自分の履歴を見ます',
  why:'この教材のゴールは、<b>自分のフォークの GitHub の画面で</b>、コンフリクトを解決したマージコミットが見えることです。',
  todo:{
    common:['ブラウザで、あなたのフォークのコミットの一覧（https://github.com/あなたのユーザー名/trainer/commits/main）を開きます',
            'いちばん上に <b>Merge branch \'change-title\'</b> があることを確かめます',
            'それを押して、hello.md の1行目が <b># Git の練習帳（はじめての Git）</b> になった変更を確かめます']
  },
  expect:'コミットの一覧のいちばん上に Merge branch \'change-title\' があり、その下に第3回からのあなたのコミットが並んでいます。',
  note:'一覧の見方は、根拠の GitHub Docs（写真つき）を見てください。',
  ask:'GitHub の画面で、Merge branch \'change-title\' が見えましたか？',
  ref:[gh.commits],
  tb:[
    { q:'見えない',
      a:'ブラウザを再読み込みしてください。それでも見えなければ、開いているのが<b>あなたのフォーク</b>か（左上がユーザー名 / trainer か）と、前の画面の <code>git push</code> で <code>main -&gt; main</code> が出たかを確かめてください。' }
  ]
},
{
  kind:'fin',
  title:'全10回、おつかれさまでした',
  lead:'コンフリクトを自分で解決し、そのマージコミットをフォークに送って、GitHub で確かめました。',
  gained:'コンフリクトは、<b>印を読み、残したい中身にして、add して、commit する</b>だけです。迷ったら <code>git merge --abort</code> で始める前に戻れます。',
  criteria:[
    '変更を意味のある単位でコミットし、<code>git log</code> で理由までたどれる（第3〜6回）',
    '目的に合った取り消し方を選べる（第4・7回）',
    'ブランチで試し、マージし、コンフリクトを自分で解決できる（第9・10回）',
    'フォークにプッシュして、GitHub の画面で自分の履歴を確かめられる（第3回〜）'
  ],
  deepenWhy:'10回で使ったコマンドを、<b>自分で表にして</b>、AI に直してもらいます。',
  deepen:'この教材の10回で使ったコマンドを、私が表にしました。「作業ディレクトリ・ステージングエリア・リポジトリのどこが変わるか」と「打ったあとで戻せないものがあるか」の欄に、間違いがあれば直してください。\n\n（ここに表を書く。例: git add / ステージングエリアが変わる / 戻せないものは無い（git restore --staged で下ろせる））\n\n直すときは、根拠として git help の該当する箇所を示してください。私は git help で確かめます。',
  ref:[pg.conflicts, ref.merge],
  nextHref:'index.html',
  nextLabel:'目次に戻る'
}
]};
