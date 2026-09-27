// 第13回 サブモジュール — 1画面に1つずつ進むナビの中身。
// 書き方は design/curriculum.md の「3. 書き方の約束」。出力と図は content/runs/13-submodule.mjs を実際に打って得たもの。
// サブモジュールには、受講者自身のフォークを使う（ほかのリポジトリを用意しなくてよいように）。
import { pg, ref, gh } from '../refs.js';

export const title = '第13回 サブモジュール';

export default {
key:'trainer-v2-13',
greeting:'この回で、<b>サブモジュール</b>（リポジトリの中に、別のリポジトリの<b>決まったコミット</b>を入れる仕組み）を使います。<br>最後に「<b>リリースタグ v1.1.0 のときに、サブモジュールはどのコミットだったか</b>」を Git に聞き、図で確かめます。',

common:[
  { when:'cmd', q:'fatal: not a git repository と出た',
    a:'trainer フォルダの外にいます。VS Code で trainer フォルダを開き、「ターミナル」→「新しいターミナル」で出し直してください。' },
  { when:'cmd', q:'画面の下に : や (END) が出て、打てなくなった',
    a:'出力が長いので、Git が<b>1画面ずつ見せる道具</b>（ページャ）で開いています。<span class="k">q</span> を押すと戻ります。' }
],

steps:[
{
  icon:'icon-git.svg', phase:'1. 考え方',
  title:'サブモジュールは「別のリポジトリの、決まったコミット」を記録します',
  why:'ほかのリポジトリを、自分のリポジトリの中のフォルダとして使う仕組みです。',
  readonly:true,
  todo:{
    common:['入れる先のフォルダ（この回では <code>practice/lib</code>）に、別のリポジトリをクローンする',
            '自分のリポジトリには、中のファイルではなく、<b>そのリポジトリのどのコミットか</b>（番号）だけを記録する']
  },
  expect:'サブモジュールで記録されるのは「ファイル」ではなく「コミットの番号」だと分かれば大丈夫です。',
  note:'この回では、入れる「別のリポジトリ」に、<b>あなた自身のフォーク</b>を使います（ほかのリポジトリを用意しなくてよいように）。<br>サブモジュールの設定ファイル <code>.gitmodules</code> は、決まりで<b>リポジトリのいちばん上</b>にできます。practice の外にできるのは、このファイルだけです。',
  ask:'記録されるのが「コミットの番号」だと分かりましたか？',
  ref:[pg.submodules],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. サブモジュールを入れる',
  title:'あなたのフォークを、サブモジュールとして入れます',
  why:'URL は第2回でクローンしたときと同じ、<b>あなたのフォーク</b>の URL です。',
  pre:[['git submodule add https://github.com/あなたのユーザー名/trainer.git practice/lib', '指定した URL のリポジトリを <code>practice/lib</code> にクローンし、サブモジュールとして登録します']],
  cmd:'git submodule add https://github.com/あなたのユーザー名/trainer.git practice/lib',
  cmdlabel:'打つコマンド（「あなたのユーザー名」を、自分のユーザー名に置き換える）',
  out:'13-sub-add',
  expect:'<code>Cloning into \'…/practice/lib\'...</code> と出て、次の行が打てる状態に戻ります。',
  after:'practice/lib に、あなたのフォークが丸ごとクローンされました。<br>このとき、フォークの main の<b>いちばん新しいコミット</b>が、practice/lib の中身になります。第12回でタグ v1.0.0 を付けたコミットです（あとの画面で確かめます）。',
  ask:'Cloning into と出て、エラーなく終わりましたか？',
  ref:[pg.startSubmodules, ref.submodule],
  tb:[
    { q:'already exists in the index と出た',
      a:'practice/lib は、もう登録されています。<code>git status</code> で、次の画面と同じ表示になっているか確かめてください。' }
  ]
},
{
  icon:'icon-git.svg', phase:'2. サブモジュールを入れる',
  title:'増えたものを、Git に聞きます',
  why:'サブモジュールを入れると、何が変わるかを見ます。',
  pre:[['git status', 'いまの状態を表示します']],
  cmd:'git status',
  cmdlabel:'打つコマンド',
  out:'13-status',
  expect:'<code>Changes to be committed:</code> の下に、<code>.gitmodules</code> と <code>practice/lib</code> の2つが出ます。',
  after:'<code>git submodule add</code> は、この2つを<b>ステージングエリアまで</b>載せます。<br>practice/lib の中には、たくさんのファイルがありますが、1つずつは出てきません。<b>practice/lib がまるごと1つの記録</b>として扱われているからです。',
  ask:'.gitmodules と practice/lib の2つが出ましたか？',
  ref:[pg.startSubmodules, ref.status],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. サブモジュールを入れる',
  title:'.gitmodules の中身を見ます',
  why:'サブモジュールの場所と、取ってくる先の URL が書かれた設定ファイルです。',
  pre:[['cat .gitmodules', '.gitmodules の中身を表示します']],
  cmd:'cat .gitmodules',
  cmdlabel:'打つコマンド',
  out:'13-gitmodules',
  expect:'<code>path = practice/lib</code> と <code>url = …</code> の行が出ます。',
  after:'<code>path</code> が置き場所、<code>url</code> が取ってくる先です。このリポジトリをクローンした人は、この URL からサブモジュールを取ってきます（根拠: Pro Git 7.11）。<br><b>どのコミットを使うか</b>は、ここには書かれていません。それは、次の画面のコミットに記録されます。',
  ask:'path と url が出ましたか？',
  ref:[pg.startSubmodules],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. サブモジュールを入れる',
  title:'コミットして、記録のされ方を見ます',
  why:'サブモジュールが<b>何として</b>記録されるかが、出力に出ます。',
  pre:[['git commit -m "自分のフォークを、サブモジュールとして足した"', 'ステージングエリアの中身でコミットします']],
  cmd:'git commit -m "自分のフォークを、サブモジュールとして足した"',
  cmdlabel:'打つコマンド',
  out:'13-commit',
  expect:'<code>create mode 160000 practice/lib</code> の行が出ます。',
  after:'ふつうのファイルは <code>100644</code> でした。<b><code>160000</code></b> は、Pro Git 7.11 のことばで「Git における特別なモードで、サブディレクトリやファイルではなくディレクトリエントリとしてこのコミットを記録したことを意味します」。つまり practice/lib は、<b>コミットの番号</b>として記録されました。',
  ask:'create mode 160000 practice/lib と出ましたか？',
  ref:[pg.startSubmodules, ref.commit],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'3. 記録された番号',
  title:'サブモジュールが、どのコミットで記録されたかを聞きます',
  why:'記録された番号と、それに付いているタグを、1行で見られます。',
  pre:[['git submodule status', 'サブモジュールごとに、<b>記録されているコミットの番号</b>・場所・その番号に付いたタグなどを表示します']],
  cmd:'git submodule status',
  cmdlabel:'打つコマンド',
  out:'13-sub-status',
  expect:'40文字の番号と <code>practice/lib</code>、最後に <code>(v1.0.0)</code> が出ます。',
  after:'・行の頭の空白 … 記録された番号と、practice/lib の中身がそろっている（そろっていないと <code>+</code>、まだ取ってきていないと <code>-</code> が付く。根拠: git submodule の説明）<br>・<code>e3d917e…</code> … 記録されたコミットの番号<br>・<code>(v1.0.0)</code> … その番号に付いているタグ。第12回で付けたリリースタグです',
  ask:'(v1.0.0) と出ましたか？',
  ref:[ref.submodule, pg.submodules],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'4. リリースタグから、たどる',
  title:'この状態を、リリース v1.1.0 にします',
  why:'サブモジュールを入れたコミットに、2つ目のリリースタグを付けます。',
  pre:[
    ['git tag -a v1.1.0 -m "サブモジュールを入れたリリース"', 'いまのコミットに、注釈付きのタグ <code>v1.1.0</code> を付けます'],
    ['git rev-list -n 1 v1.1.0', 'タグ v1.1.0 が指すコミットの番号を表示します（第12回と同じ取り出し方）']
  ],
  cmdMulti:{ common:['git tag -a v1.1.0 -m "サブモジュールを入れたリリース"', 'git rev-list -n 1 v1.1.0'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['13-tag', '13-rev-list'],
  expect:'40文字の番号が1行出ます。',
  after:'v1.1.0 が指すのは、前の画面でサブモジュールを入れたコミット <code>ba942be</code> です。',
  ask:'番号が出ましたか？',
  ref:[pg.annotatedTags, ref.tag, ref.revList],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'4. リリースタグから、たどる',
  title:'★ v1.1.0 のとき、サブモジュールはどのコミットだったかを取り出します',
  why:'この回の本題です。<b>タグ → そのコミット → サブモジュールの番号</b>とたどり、サブモジュールの側でも同じ番号かを確かめます。',
  pre:[
    ['git ls-tree v1.1.0 practice/lib', 'タグ v1.1.0 のコミットで、<b>practice/lib に記録されているもの</b>を表示します'],
    ['git -C practice/lib rev-list -n 1 v1.0.0', '<b>practice/lib の中で</b>（<code>-C practice/lib</code>）、タグ v1.0.0 が指すコミットの番号を表示します']
  ],
  cmdMulti:{ common:['git ls-tree v1.1.0 practice/lib', 'git -C practice/lib rev-list -n 1 v1.0.0'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['13-ls-tree', '13-sub-tag'],
  chain:'c13',
  expect:'1行目の <code>160000 commit</code> のあとの番号と、2行目の番号が<b>同じ</b>です。',
  after:'1行目の読み方: <code>160000</code>（サブモジュールの記録）・<code>commit</code>（記録されているのはコミット）・<code>e3d917e…</code>（その番号）・<code>practice/lib</code>（場所）。<br>2行目で、サブモジュールの側のタグ v1.0.0 も <code>e3d917e…</code> でした。図のとおり、<br><b>リリース v1.1.0 → コミット ba942be → practice/lib に記録された e3d917e ＝ サブモジュールの v1.0.0</b><br>と、番号でつながっていることを確かめられました。',
  ask:'2つの番号が同じでしたか？',
  ref:[ref.lsTree, ref.revList, pg.submodules],
  tb:[
    { q:'-C を付けずに打ってしまった',
      a:'<code>-C practice/lib</code> が無いと、trainer（外側）のリポジトリに聞くことになります。今回は外側にも v1.0.0 があるので同じ番号が出ますが、<b>サブモジュールの側に聞く</b>ときは <code>-C</code> を付けます。' }
  ]
},
{
  icon:'icon-github.svg', phase:'5. GitHub に送る',
  title:'コミットとタグを送って、GitHub の番号を確かめます',
  why:'第12回と同じく、GitHub に聞いた番号が手元と同じかを確かめます。',
  pre:[
    ['git push', 'main のコミットを、あなたのフォークに送ります'],
    ['git push origin v1.1.0', 'タグ v1.1.0 を送ります（<code>git push</code> だけではタグは送られません）'],
    ['git ls-remote --tags origin', 'フォークにあるタグと、その番号を表示します']
  ],
  cmdMulti:{ common:['git push', 'git push origin v1.1.0', 'git ls-remote --tags origin'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['13-push', '13-push-tag', '13-ls-remote'],
  chain:'c13-remote',
  expect:'<code>refs/tags/v1.1.0^{}</code> の行の番号が、前の前の画面で取り出した v1.1.0 のコミットの番号と同じです。',
  after:'GitHub の v1.1.0 も <code>ba942be…</code> を指しています。サブモジュールの番号は、このコミットの中に記録されているので、<b>GitHub から v1.1.0 を取ってきた人も、同じ e3d917e のサブモジュールを使うことになります</b>。',
  ask:'v1.1.0^{} の番号が同じでしたか？',
  ref:[pg.sharingTags, ref.lsRemote, ref.push],
  tb:[]
},
{
  icon:'icon-github.svg', phase:'6. 画面でも確かめる',
  title:'GitHub の画面で、サブモジュールの記録を見ます',
  why:'同じことを、GitHub の画面でも確かめます。',
  todo:{
    common:['ブラウザで <b>https://github.com/あなたのユーザー名/trainer/tree/v1.1.0/practice</b> を開きます（タグ v1.1.0 のときの practice フォルダ）',
            '<code>lib</code> の行に、<b>コミットの番号</b>（先頭の数文字）が添えられていることを確かめます',
            'その番号が、前の画面の <code>e3d917e…</code>（あなたの画面では違う番号）の先頭と同じかを見比べます']
  },
  expect:'v1.1.0 の practice フォルダで、lib にコミットの番号が添えられていて、手元で取り出した番号の先頭と同じです。',
  note:'lib はふつうのフォルダではなく、<b>別のリポジトリの、決まったコミットへのつながり</b>として表示されます。',
  ask:'lib の番号が、手元の番号と同じでしたか？',
  ref:[gh.viewTags, pg.submodules],
  tb:[]
},
{
  kind:'fin',
  title:'全13回、おつかれさまでした',
  lead:'リリースタグから、そのコミット、そしてサブモジュールのコミットまで、番号でたどって確かめました。',
  gained:'サブモジュールは、別のリポジトリの<b>決まったコミットの番号</b>（<code>160000 commit</code>）として記録されます。あるリリースのときのサブモジュールの番号は <code>git ls-tree タグ サブモジュールの場所</code> で取り出せます。',
  criteria:[
    '<code>git ls-tree v1.1.0 practice/lib</code> の番号と、<code>git -C practice/lib rev-list -n 1 v1.0.0</code> の番号が同じ',
    '<code>git ls-remote --tags origin</code> に v1.0.0 と v1.1.0 がある',
    'GitHub の v1.1.0 の practice フォルダに、lib とその番号が出ている'
  ],
  deepenWhy:'サブモジュールを含むリポジトリを、<b>別の場所にクローンする</b>ときの注意を調べます。',
  deepen:'サブモジュールを含むリポジトリを git clone したとき、サブモジュールのフォルダの中身はどうなりますか。中身も取ってくるには、どのコマンドを打てばよいですか。\n\n答えには、Pro Git 日本語版 7.11「サブモジュールを含むプロジェクトのクローン」の該当する箇所を示してください。私は使い捨てのフォルダで、実際にクローンして確かめます。',
  ref:[pg.cloneSubmodules],
  nextHref:'index.html',
  nextLabel:'目次に戻る'
}
]};
