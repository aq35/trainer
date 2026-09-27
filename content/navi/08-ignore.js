// 第8回 追跡しないもの — 1画面に1つずつ進むナビの中身。
// 書き方は design/curriculum.md の「3. 書き方の約束」。出力は content/runs/08-ignore.mjs を実際に打って得たもの。
// .gitignore も practice/ の中に置く（練習で触るのは practice/ の中だけ）。
import { pg, ref, gh } from '../refs.js';
import { T } from '../runs/_texts.mjs';

export const title = '第8回 追跡しないもの';

const paste = (t) => t.replace(/\n$/, '');

export default {
key:'trainer-v2-08',
greeting:'この回で、<b>Git に追跡させたくないファイル</b>を外します。<br>ログや、自分のパソコンだけの設定などです。一度コミットしてしまったファイルの外し方も練習します。',

common:[
  { when:'cmd', q:'fatal: not a git repository と出た',
    a:'trainer フォルダの外にいます。VS Code で trainer フォルダを開き、「ターミナル」→「新しいターミナル」で出し直してください。' },
  { q:'.gitignore が、ファイルの一覧に見当たらない',
    a:'名前が <code>.</code>（ドット）で始まるファイルです。<code>practice</code> フォルダの中に、<code>.gitignore</code> という名前（拡張子なし）で作ってあるか確かめてください。' }
],

steps:[
{
  icon:'icon-vscode.svg', phase:'1. 無視する',
  title:'ログのファイルを作ります',
  why:'動かすたびに増える<b>ログ</b>は、ふつうコミットしません。',
  todo:{
    common:['practice フォルダに、<code>app.log</code> という名前のファイルを作ります',
            '下の枠の中身を貼り付けて、保存します']
  },
  textBox:true,
  cmdMulti:{ common:[paste(T.log8)] },
  cmdlabel:'app.log の中身',
  expect:'practice フォルダに app.log があり、保存できています。',
  ask:'app.log を作れましたか？',
  tb:[]
},
{
  icon:'icon-git.svg', phase:'1. 無視する',
  title:'Git は、ログのファイルにも気づいています',
  why:'このままだと、<code>git add</code> のときに混ざってしまいます。',
  pre:[['git status', 'いまの状態を表示します']],
  cmd:'git status',
  cmdlabel:'打つコマンド',
  out:'8-status-log',
  expect:'<code>Untracked files:</code> の下に <code>practice/app.log</code> が出ます。',
  after:'追跡されていないファイルとして、毎回ここに出続けます。',
  ask:'practice/app.log が出ましたか？',
  ref:[pg.status, ref.status],
  tb:[]
},
{
  icon:'icon-vscode.svg', phase:'1. 無視する',
  title:'無視するファイルを、.gitignore に書きます',
  why:'<b>.gitignore</b> は、「追跡しないファイル」の名前の形を書いておくファイルです。',
  todo:{
    common:['practice フォルダに、<code>.gitignore</code> という名前のファイルを作ります（最初のドットを忘れずに）',
            '下の枠の中身を貼り付けて、保存します']
  },
  textBox:true,
  cmdMulti:{ common:[paste(T.ignore8a)] },
  cmdlabel:'.gitignore の中身',
  expect:'practice フォルダに .gitignore があり、中身は <code>*.log</code> の1行です。',
  note:'<code>*.log</code> の <code>*</code> は「何でもよい」という意味です。名前が <code>.log</code> で終わるファイルを、全部無視します。',
  ask:'.gitignore を作れましたか？',
  tb:[]
},
{
  icon:'icon-git.svg', phase:'1. 無視する',
  title:'app.log が、一覧から消えます',
  why:'.gitignore が効いているかを確かめます。',
  pre:[['git status', 'いまの状態を表示します']],
  cmd:'git status',
  cmdlabel:'打つコマンド',
  out:'8-status-ignored',
  expect:'<code>Untracked files:</code> の下が <code>practice/.gitignore</code> だけになり、app.log は出ません。',
  after:'app.log は消えたのではなく、<b>Git が見ないことにした</b>だけです。practice フォルダには残っています。<br>.gitignore そのものは、ほかのファイルと同じように追跡されていません。コミットして、無視のしかたも履歴に残します。',
  ask:'app.log が出なくなりましたか？',
  ref:[pg.ignoring, ref.gitignore],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'1. 無視する',
  title:'なぜ無視されているのかを、Git に聞きます',
  why:'無視のしかたが複雑になったとき、<b>どの行が効いているか</b>を調べる方法です。',
  pre:[['git check-ignore -v practice/app.log', 'app.log が無視されているなら、<b>どのファイルの何行目の決まりで</b>無視されているかを表示します。何も変えません']],
  cmd:'git check-ignore -v practice/app.log',
  cmdlabel:'打つコマンド',
  out:'8-check-ignore',
  expect:'<code>practice/.gitignore:1:*.log</code> と <code>practice/app.log</code> が1行に出ます。',
  after:'「practice/.gitignore の<b>1行目</b>の <code>*.log</code> によって、practice/app.log は無視されている」という意味です。無視されていないファイルを聞くと、何も表示しません。',
  ask:'practice/.gitignore:1:*.log と出ましたか？',
  ref:[ref.checkIgnore],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'1. 無視する',
  title:'.gitignore をコミットします',
  why:'.gitignore もコミットしておくと、フォークやクローンした先でも、同じものが無視されます。',
  pre:[
    ['git add practice/.gitignore', '.gitignore をステージングエリアに載せます'],
    ['git commit -m "ログのファイルを追跡しないようにした"', 'コミットします']
  ],
  cmdMulti:{ common:['git add practice/.gitignore', 'git commit -m "ログのファイルを追跡しないようにした"'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['8-add-ignore', '8-commit-ignore'],
  expect:'<code>create mode 100644 practice/.gitignore</code> と出ます。',
  after:'app.log は入っていません（<code>1 file changed</code>）。',
  ask:'コミットできましたか？',
  ref:[pg.ignoring, ref.commit],
  tb:[]
},
{
  icon:'icon-vscode.svg', phase:'2. コミットしてしまったもの',
  title:'自分のパソコンだけの設定ファイルを作ります',
  why:'次は「<b>うっかりコミットしてしまった</b>」場合です。',
  todo:{
    common:['practice フォルダに、<code>settings.local</code> という名前のファイルを作ります',
            '下の枠の中身を貼り付けて、保存します']
  },
  textBox:true,
  cmdMulti:{ common:[paste(T.local8a)] },
  cmdlabel:'settings.local の中身',
  expect:'practice フォルダに settings.local があり、保存できています。',
  ask:'settings.local を作れましたか？',
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. コミットしてしまったもの',
  title:'うっかり、コミットしてしまいます',
  why:'よくある間違いを、わざと起こします。',
  pre:[
    ['git add practice/settings.local', 'settings.local をステージングエリアに載せます'],
    ['git commit -m "手元だけの設定ファイルを足した"', 'コミットします']
  ],
  cmdMulti:{ common:['git add practice/settings.local', 'git commit -m "手元だけの設定ファイルを足した"'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['8-add-local', '8-commit-local'],
  expect:'<code>create mode 100644 practice/settings.local</code> と出ます。',
  after:'settings.local は、これで<b>追跡されている</b>ファイルになりました。',
  ask:'コミットできましたか？',
  ref:[pg.commit, ref.commit],
  tb:[]
},
{
  icon:'icon-vscode.svg', phase:'2. コミットしてしまったもの',
  title:'.gitignore に足し、設定も変えます',
  why:'あとから .gitignore に書いたら、どうなるかを試します。',
  todo:{
    common:['<b>.gitignore</b> の中身を、下の1つ目の枠の中身にして保存します（2行目が増えます）',
            '<b>settings.local</b> の中身を、下の2つ目の枠の中身にして保存します（dark を light に）']
  },
  textBox:true,
  cmdMulti:{ common:[paste(T.ignore8b), paste(T.local8b)] },
  cmdlabel:'1つ目: .gitignore の中身／2つ目: settings.local の中身',
  expect:'2つのファイルを保存できています。',
  ask:'2つとも保存できましたか？',
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. コミットしてしまったもの',
  title:'追跡しているファイルは、.gitignore に書いても無視されません',
  why:'この回でいちばん大事な画面です。',
  pre:[['git status', 'いまの状態を表示します']],
  cmd:'git status',
  cmdlabel:'打つコマンド',
  out:'8-status-tracked',
  expect:'<code>modified:</code> の行が2つ出ます。<code>practice/.gitignore</code> と <code>practice/settings.local</code> です。',
  after:'settings.local は <code>*.local</code> に当てはまるのに、変更が出続けています。<b>.gitignore が効くのは、追跡されていないファイルだけ</b>だからです（根拠: gitignore の説明の最初の段落）。',
  ask:'settings.local が modified で出ましたか？',
  ref:[pg.ignoring, ref.gitignore],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. コミットしてしまったもの',
  title:'★ 追跡だけをやめます（ファイルは残します）',
  why:'打つ前に確かめます。<b>消えるのは「次のコミットでの追跡」だけ</b>で、作業ディレクトリの settings.local は残します。',
  pre:[
    ['git rm --cached practice/settings.local', 'settings.local を<b>ステージングエリアから外します</b>。<code>--cached</code> を付けると、作業ディレクトリのファイルは消しません'],
    ['git status', '確かめます']
  ],
  cmdMulti:{ common:['git rm --cached practice/settings.local', 'git status'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['8-rm-cached', '8-status-rm'],
  expect:'<code>Changes to be committed:</code> の下に <code>deleted:    practice/settings.local</code> が出ます。',
  after:'Git の目から見ると「次のコミットで、settings.local を<b>リポジトリから消す</b>」になります。VS Code の一覧には、settings.local が残っています。<br><code>Untracked files</code> に出てこないのは、<code>*.local</code> で無視されるようになったからです。',
  ask:'deleted: practice/settings.local と出ましたか？',
  ref:[pg.removing, ref.rm],
  tb:[
    { q:'--cached を付けずに打ってしまった',
      a:'<code>--cached</code> の無い <code>git rm</code> は、<b>作業ディレクトリのファイルも消します</b>。今回は、コミット済の中身から戻せます。<code>git restore --staged practice/settings.local</code> のあと <code>git restore practice/settings.local</code> を打つと、最後にコミットした中身（theme = dark）に戻ります。' }
  ]
},
{
  icon:'icon-git.svg', phase:'2. コミットしてしまったもの',
  title:'コミットして、無視されていることを確かめます',
  why:'.gitignore の変更も、同じコミットに入れます。',
  pre:[
    ['git add practice/.gitignore', '.gitignore をステージングエリアに載せます'],
    ['git commit -m "settings.local を追跡しないようにした"', 'コミットします'],
    ['git check-ignore -v practice/settings.local', 'settings.local が、どの決まりで無視されているかを表示します']
  ],
  cmdMulti:{ common:['git add practice/.gitignore', 'git commit -m "settings.local を追跡しないようにした"', 'git check-ignore -v practice/settings.local'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['8-add-ignore2', '8-commit-rm', '8-check-local'],
  expect:'<code>delete mode 100644 practice/settings.local</code> と、<code>practice/.gitignore:2:*.local</code> が出ます。',
  after:'これから先のコミットに、settings.local は入りません。<br><b>ただし、前のコミットには残っています。</b>第6回の <code>git log</code> や <code>git show</code> で、誰でも見られます。',
  ask:'practice/.gitignore:2:*.local と出ましたか？',
  ref:[pg.removing, ref.checkIgnore],
  tb:[]
},
{
  icon:'icon-github.svg', phase:'3. 送る',
  title:'フォークに送ります',
  why:'この回のコミットを、あなたのフォークにそろえます。',
  pre:[
    ['git push', 'まだ送っていないコミットを、あなたのフォークに送ります'],
    ['git status', '確かめます']
  ],
  cmdMulti:{ common:['git push', 'git status'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['8-push', '8-status'],
  expect:'<code>main -&gt; main</code> と出て、<code>git status</code> が <code>up to date</code> と <code>working tree clean</code> を出します。',
  after:'フォークにも、settings.local を足したコミットと、外したコミットの<b>両方</b>が入りました。',
  note:'<b>パスワードや鍵を、うっかりコミットしてプッシュしたとき</b>は、追跡をやめるだけでは足りません。フォークは公開されていて、前のコミットから誰でも見られるからです。GitHub Docs は、<b>まずそのパスワードや鍵を無効にして、作り直す</b>ことを最初の手順にしています（根拠のリンクを参照）。',
  ask:'up to date と working tree clean が出ましたか？',
  ref:[pg.push, gh.sensitive, gh.forks],
  tb:[]
},
{
  kind:'fin',
  title:'追跡しないものを、外しました',
  lead:'無視するファイルを .gitignore に書き、コミット済のファイルの追跡をやめました。',
  gained:'<b>.gitignore が効くのは、追跡されていないファイルだけ</b>です。追跡しているものは <code>git rm --cached</code> で追跡をやめます。前のコミットの中身は、消えずに残ります。',
  criteria:[
    '<code>git check-ignore -v practice/app.log</code> が <code>practice/.gitignore:1:*.log</code> を出す',
    '<code>git status</code> が <code>working tree clean</code> を出す（app.log と settings.local は出てこない）'
  ],
  deepenWhy:'.gitignore の書き方を、AI に聞いて、<b>git check-ignore で確かめます</b>。',
  deepen:'.gitignore で、次の2つを無視する書き方を教えてください。\n\n1. practice/tmp フォルダの中身全部\n2. 名前が .bak で終わるファイル全部\n\nあわせて、書き方が合っているかを git check-ignore -v で確かめるときの、打つコマンドも教えてください。私はそのコマンドを打って、答えを確かめます。',
  ref:[pg.ignoring, ref.gitignore],
  nextHref:'09-branch.html',
  nextLabel:'第9回 ブランチとマージ へ'
}
]};
