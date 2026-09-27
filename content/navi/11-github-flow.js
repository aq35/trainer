// 第11回 GitHub フロー — 1画面に1つずつ進むナビの中身。
// 書き方は design/curriculum.md の「3. 書き方の約束」。出力は content/runs/11-github-flow.mjs を実際に打って得たもの。
// プルリクエストは、自分のフォークの中だけで出してマージする（本家 aq35/trainer には出さない）。
import { pg, ref, gh } from '../refs.js';
import { T } from '../runs/_texts.mjs';

export const title = '第11回 GitHub フロー';

const paste = (t) => t.replace(/\n$/, '');

export default {
key:'trainer-v2-11',
greeting:'この回で、<b>GitHub フロー</b>を一周します。ブランチで変えて、<b>プルリクエスト</b>（「このブランチを main にマージしてください」という GitHub 上の依頼）を出し、GitHub の画面でマージします。<br>練習なので、プルリクエストは<b>あなたのフォークの中だけ</b>で出します。',

common:[
  { when:'cmd', q:'fatal: not a git repository と出た',
    a:'trainer フォルダの外にいます。VS Code で trainer フォルダを開き、「ターミナル」→「新しいターミナル」で出し直してください。' },
  { when:'cmd', q:'画面の下に : や (END) が出て、打てなくなった',
    a:'出力が長いので、Git が<b>1画面ずつ見せる道具</b>（ページャ）で開いています。<span class="k">q</span> を押すと戻ります。' }
],

steps:[
{
  icon:'icon-github.svg', phase:'1. 流れを知る',
  title:'GitHub フローは、6つの手順です',
  why:'GitHub Docs は、GitHub での作業の流れを、次の6つで説明しています。',
  readonly:true,
  todo:{
    common:['<b>ブランチを作る</b>（main を直接変えない）',
            '<b>変更する</b>（コミットして、GitHub に送る）',
            '<b>プルリクエストを作る</b>（変更を見てもらい、マージを頼む）',
            '<b>レビューに応える</b>（この回は一人なので、飛ばします）',
            '<b>マージする</b>（GitHub の画面で）',
            '<b>ブランチを消す</b>']
  },
  expect:'6つの手順の順番が分かれば大丈夫です。第9回のブランチとマージを、<b>GitHub の画面の上で</b>行うのが違いです。',
  note:'<b>プルリクエストは、あなたのフォークの中だけで出します。</b>本家（aq35/trainer）には届けません。',
  ask:'流れが分かりましたか？',
  ref:[gh.flow],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. ブランチで変える',
  title:'ブランチを作って、移ります',
  why:'GitHub フローの1つ目、<b>ブランチを作る</b>です。',
  pre:[['git switch -c add-about', '<code>add-about</code> というブランチを作って、移ります']],
  cmd:'git switch -c add-about',
  cmdlabel:'打つコマンド',
  out:'11-switch-c',
  expect:'<code>Switched to a new branch \'add-about\'</code> と出ます。',
  after:'第9回と同じ操作です。',
  ask:'add-about に移りましたか？',
  ref:[pg.newBranch, ref.switch],
  tb:[]
},
{
  icon:'icon-vscode.svg', phase:'2. ブランチで変える',
  title:'新しいファイル about.md を作ります',
  why:'プルリクエストで見てもらう変更です。',
  todo:{
    common:['practice フォルダに <code>about.md</code> を作ります',
            '下の枠の中身を貼り付けて、保存します']
  },
  textBox:true,
  cmdMulti:{ common:[paste(T.about11)] },
  cmdlabel:'about.md の中身',
  expect:'practice フォルダに about.md があり、保存できています。',
  ask:'about.md を作れましたか？',
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. ブランチで変える',
  title:'ブランチでコミットします',
  why:'GitHub フローの2つ目、<b>変更する</b>です。',
  pre:[
    ['git add practice/about.md', 'about.md をステージングエリアに載せます'],
    ['git commit -m "このリポジトリについての説明を足した"', 'add-about にコミットします']
  ],
  cmdMulti:{ common:['git add practice/about.md', 'git commit -m "このリポジトリについての説明を足した"'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['11-add', '11-commit'],
  expect:'<code>[add-about 英数字]</code> と <code>create mode 100644 practice/about.md</code> が出ます。',
  after:'コミットは add-about にだけあります。',
  ask:'[add-about …] と出ましたか？',
  ref:[pg.commit, ref.commit],
  tb:[]
},
{
  icon:'icon-github.svg', phase:'2. ブランチで変える',
  title:'ブランチを、フォークに送ります',
  why:'プルリクエストは GitHub の上で作るので、<b>ブランチを GitHub に送って</b>おきます。',
  pre:[['git push -u origin add-about', 'add-about ブランチを、<code>origin</code>（あなたのフォーク）に送ります。<code>-u</code> ＝次から <code>git push</code> と <code>git pull</code> だけで、このブランチの送り先・取り込み元が決まるようにする']],
  cmd:'git push -u origin add-about',
  cmdlabel:'打つコマンド',
  out:'11-push-u',
  expect:'<code>* [new branch]      add-about -&gt; add-about</code> と出ます。',
  after:'<code>[new branch]</code> は「フォークに、新しいブランチができた」という意味です。<code>set up to track</code> の行が、<code>-u</code> の効き目です。<br>GitHub に送ったときは、このほかに <code>remote:</code> で始まる行が出ることがあります（GitHub からの案内です）。',
  ask:'[new branch] と出ましたか？',
  ref:[pg.push, ref.push],
  tb:[]
},
{
  icon:'icon-github.svg', phase:'3. プルリクエスト',
  title:'あなたのフォークの中で、プルリクエストを作ります',
  why:'GitHub フローの3つ目です。「add-about を main にマージしてください」という依頼を、GitHub の上に作ります。',
  todo:{
    common:['ブラウザで <b>https://github.com/あなたのユーザー名/trainer/compare</b> を開きます',
            '<b>base</b> を <code>main</code>、<b>compare</b> を <code>add-about</code> にします',
            '<b>base repository</b> の欄が出ていて <code>aq35/trainer</code> になっていたら、<b>あなたのユーザー名/trainer</b> に選び直します（本家に届けないため）',
            '「Create pull request」を押し、題名はそのままで、もう一度「Create pull request」を押します']
  },
  expect:'あなたのフォークに、プルリクエストの画面ができます。画面の上のほうに、<b>あなたのユーザー名/trainer</b> の main に add-about をマージする、という形で出ています。',
  note:'画面の写真つきの手順は、根拠の GitHub Docs にあります。',
  ask:'あなたのフォークの中に、プルリクエストができましたか？',
  ref:[gh.compare, gh.createPr, gh.forks],
  tb:[
    { q:'aq35/trainer にプルリクエストを作ってしまった',
      a:'作ったプルリクエストの画面のいちばん下にある「Close pull request」で閉じてください。そのあと、この画面の手順で、base repository を<b>あなたのフォーク</b>にして作り直します。' },
    { q:'compare に add-about が出てこない',
      a:'前の画面の <code>git push -u origin add-about</code> で <code>[new branch]</code> が出たか確かめてください。' }
  ]
},
{
  icon:'icon-github.svg', phase:'4. マージする',
  title:'GitHub の画面で、マージします',
  why:'GitHub フローの5つ目です（4つ目のレビューは、一人なので飛ばします）。',
  todo:{
    common:['プルリクエストの画面の下のほうにある「<b>Merge pull request</b>」を押します',
            '「<b>Confirm merge</b>」を押します',
            'そのあとに出る「Delete branch」は、<b>押さずに</b>そのままにします（ブランチは、このあとコマンドで消します）']
  },
  expect:'プルリクエストの画面に「Merged」と出ます。',
  note:'「Merge pull request」は、<b>マージコミット</b>を作ってマージします（第9回の、両方が進んでいたときと同じ形。根拠: GitHub Docs）。いまマージされたのは、<b>GitHub の上の main</b> だけです。あなたのパソコンの main は、まだ前のままです。',
  ask:'Merged と出ましたか？',
  ref:[gh.mergePr, gh.mergeMethods],
  tb:[
    { q:'Merge pull request の横に、別のボタン名が出ている',
      a:'ボタンの右の ▼ を押して「Create a merge commit」を選んでから、押してください（根拠の GitHub Docs を参照）。' }
  ]
},
{
  icon:'icon-git.svg', phase:'5. 手元にそろえる',
  title:'main に戻って、GitHub のマージを取り込みます',
  why:'GitHub でのマージを、<b>あなたのパソコンの main にも</b>そろえます。',
  pre:[
    ['git switch main', 'main に移ります'],
    ['git pull', 'フォーク（origin）の main を取ってきて、手元の main に取り込みます']
  ],
  cmdMulti:{ common:['git switch main', 'git pull'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['11-switch-main', '11-pull'],
  expect:'<code>Fast-forward</code> と、<code>practice/about.md</code> の行が出ます。',
  after:'<code>git pull</code> は、<b>取ってくる</b>（fetch）と<b>取り込む</b>（merge）を続けて行います。<br>・<code>c48cd86..e3d917e  main -&gt; origin/main</code> … フォークの main の新しいコミットを取ってきた<br>・<code>Fast-forward</code> … 手元の main は GitHub の main の1つ前にそのまま並んでいたので、先に進めただけ（第9回と同じ）<br>この出力を記録したときは、GitHub の「Merge pull request」の代わりに、同じ形のマージコミットを <code>git merge --no-ff</code> で作っています。',
  ask:'Fast-forward と出ましたか？',
  ref:[pg.pull, ref.pull],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'5. 手元にそろえる',
  title:'GitHub で作られたマージコミットを、履歴で見ます',
  why:'第9回で見た枝分かれと、同じ形になっているかを確かめます。',
  pre:[['git log --oneline --graph -4', '履歴を4件、枝分かれの線つきで表示します']],
  cmd:'git log --oneline --graph -4',
  cmdlabel:'打つコマンド',
  out:'11-graph',
  expect:'いちばん上がマージコミットで、その下に <code>|\\</code> と <code>|/</code> の線で、add-about のコミットが並びます。',
  after:'いちばん上の <code>e3d917e</code> が、GitHub の上で作られたマージコミットです。<b>あなたの画面では、メッセージが GitHub の付けたもの</b>（プルリクエストの番号などが入ったもの）になり、下の出力とは違います。<br><code>(HEAD -&gt; main, origin/main, …)</code> が同じ行にあるので、手元の main とフォークの main がそろっています。',
  ask:'マージコミットと枝分かれの線が出ましたか？',
  ref:[pg.log, ref.log, gh.mergeMethods],
  tb:[]
},
{
  icon:'icon-github.svg', phase:'6. ブランチを消す',
  title:'使い終わったブランチを、手元とフォークの両方から消します',
  why:'GitHub フローの6つ目です。',
  pre:[
    ['git branch -d add-about', '手元の add-about の名前を消します（マージが済んでいるので消せます）'],
    ['git push origin --delete add-about', 'フォークの add-about を消します']
  ],
  cmdMulti:{ common:['git branch -d add-about', 'git push origin --delete add-about'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['11-branch-d', '11-push-delete'],
  expect:'<code>Deleted branch add-about</code> と <code>- [deleted]         add-about</code> が出ます。',
  after:'手元とフォークの両方から、add-about の名前が消えました。コミットは main の履歴に取り込まれているので、残っています。',
  ask:'2つとも消えましたか？',
  ref:[pg.branchMgmt, ref.branch, ref.push],
  tb:[
    { q:'remote ref does not exist と出た',
      a:'GitHub の画面の「Delete branch」を押していたので、フォークの add-about はもう消えています。問題ありません。' }
  ]
},
{
  kind:'fin',
  title:'GitHub フローを一周しました',
  lead:'ブランチで変え、プルリクエストを作り、GitHub の画面でマージし、手元にそろえて、ブランチを消しました。',
  gained:'GitHub フローは、第9回のブランチとマージを、<b>GitHub の上で、プルリクエストを通して</b>行う形です。マージしたあとは <code>git pull</code> で手元にそろえます。',
  criteria:[
    'あなたのフォークのプルリクエストの一覧（Pull requests → Closed）に、マージしたプルリクエストがある',
    '<code>git log --oneline -1</code> のいちばん上の行に <code>origin/main</code> と <code>HEAD -&gt; main</code> が並んでいる'
  ],
  deepenWhy:'なぜ main を直接変えずに、プルリクエストを通すのかを、自分の言葉で説明して、AI に直してもらいます。',
  deepen:'私の理解を書きます。間違っているところだけ、理由と一緒に直してください。\n\n（ここに書く。例: main を直接変えないのは〇〇のため。プルリクエストがあると〇〇ができる。一人の練習でも〇〇の意味がある）\n\n最後に、GitHub Docs の「GitHub flow」のページと比べて、ずれている所があれば教えてください。',
  ref:[gh.flow],
  nextHref:'12-release.html',
  nextLabel:'第12回 リリースとタグ へ'
}
]};
