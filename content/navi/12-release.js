// 第12回 リリースとタグ — 1画面に1つずつ進むナビの中身。
// 書き方は design/curriculum.md の「3. 書き方の約束」。出力と図は content/runs/12-release.mjs を実際に打って得たもの。
// 「本番リリース」は Git の範囲まで（どのコミットを出したかを、タグで決めて、誰でも取り出せるようにする）。
import { pg, ref, gh } from '../refs.js';

export const title = '第12回 リリースとタグ';

export default {
key:'trainer-v2-12',
greeting:'この回で、<b>本番に出すコミット</b>に<b>リリースタグ</b>を付けます。<br>そして「そのタグは、<b>どのコミット</b>を指しているのか」を Git に聞き、手元と GitHub で<b>同じ番号か</b>を図で確かめます。',

common:[
  { when:'cmd', q:'fatal: not a git repository と出た',
    a:'trainer フォルダの外にいます。VS Code で trainer フォルダを開き、「ターミナル」→「新しいターミナル」で出し直してください。' },
  { when:'cmd', q:'画面の下に : や (END) が出て、打てなくなった',
    a:'出力が長いので、Git が<b>1画面ずつ見せる道具</b>（ページャ）で開いています。<span class="k">q</span> を押すと戻ります。' },
  { when:'cmd', q:'fatal: tag \'v1.0.0\' already exists と出た',
    a:'同じ名前のタグが、もうあります。<code>git tag</code> で一覧を見て、前の画面の操作が済んでいるなら、そのまま次に進んでください。' }
],

steps:[
{
  icon:'icon-git.svg', phase:'1. 考え方',
  title:'本番リリースは「どのコミットを出したか」を決めることです',
  why:'Git の範囲でいうと、本番リリースでやることは2つです。',
  readonly:true,
  todo:{
    common:['<b>出すコミットを決めて、タグを付ける</b>（例: <code>v1.0.0</code>）',
            '<b>タグを GitHub に送る</b>（誰でも同じコミットを取り出せるようにする）']
  },
  expect:'タグは、<b>1つのコミットに付ける、動かない名前</b>です。ブランチ（コミットを重ねると先に進む名前）とは、ここが違います。',
  note:'GitHub の「リリース」も、<b>Git のタグにもとづいて</b>作られます（根拠: GitHub Docs）。この回では、その土台のタグまでを扱います。',
  ask:'タグとブランチの違いが分かりましたか？',
  ref:[pg.tagging, gh.releases],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. タグを付ける',
  title:'いまのコミットに、リリースタグを付けます',
  why:'第11回でマージした main を、最初のリリース <code>v1.0.0</code> にします。',
  pre:[
    ['git tag -a v1.0.0 -m "最初のリリース"', 'いまのコミット（HEAD）に、<code>v1.0.0</code> という<b>注釈付きのタグ</b>を付けます。<code>-a</code> ＝注釈付き（付けた人・日時・メッセージも残す）、<code>-m</code> ＝タグのメッセージ'],
    ['git tag', 'タグの一覧を表示します']
  ],
  cmdMulti:{ common:['git tag -a v1.0.0 -m "最初のリリース"', 'git tag'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['12-tag', '12-tag-list'],
  expect:'<code>git tag</code> が <code>v1.0.0</code> を出します。',
  after:'<code>git tag -a</code> は、うまくいくと何も表示しません。<br>Pro Git 2.6 には「一般的には、これらの情報を含められる注釈付きのタグを使うことをおすすめします」とあります（「これらの情報」は、付けた人・日時・メッセージなど）。',
  ask:'v1.0.0 と出ましたか？',
  ref:[pg.annotatedTags, ref.tag],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'2. タグを付ける',
  title:'タグの中身を見ます',
  why:'注釈付きのタグには、何が書かれているかを確かめます。',
  pre:[['git show --stat v1.0.0', 'タグ v1.0.0 の情報と、そのタグが指すコミットを表示します']],
  cmd:'git show --stat v1.0.0',
  cmdlabel:'打つコマンド',
  out:'12-show',
  expect:'上半分に <code>tag v1.0.0</code>・<code>Tagger:</code>・<code>最初のリリース</code>、下半分に <code>commit</code> から始まるコミットが出ます。',
  after:'上半分が<b>タグそのもの</b>（付けた人・日時・メッセージ）、下半分が<b>タグが指すコミット</b>です。<br>コミットの行に <code>tag: v1.0.0</code> が付いています。このコミットが、最初のリリースで本番に出すものです。',
  ask:'tag v1.0.0 と commit の両方が出ましたか？',
  ref:[pg.annotatedTags, ref.show],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'3. コミットの番号を取る',
  title:'タグが指すコミットの番号を、Git に聞きます',
  why:'「v1.0.0 で本番に出したのは、どのコミットか」を、<b>番号（40文字）で</b>取り出します。',
  pre:[
    ['git rev-list -n 1 v1.0.0', 'タグ v1.0.0 から、<b>コミットの番号を1つだけ</b>表示します（<code>-n 1</code> ＝1件）'],
    ['git rev-parse HEAD', 'いまいるコミット（HEAD）の番号を表示します。見比べるためです']
  ],
  cmdMulti:{ common:['git rev-list -n 1 v1.0.0', 'git rev-parse HEAD'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['12-rev-list', '12-rev-parse-head'],
  chain:'c12-local',
  expect:'2行とも、<b>同じ40文字</b>が出ます。',
  after:'タグ v1.0.0 は、いまいるコミット <code>e3d917e</code> を指しています。前の画面の <code>git show</code> の <code>commit</code> の行とも同じ番号です。<br>図は、この画面の答えから描いています。',
  ask:'2行が同じ40文字でしたか？',
  ref:[ref.revList, ref.revParse, pg.annotatedTags],
  tb:[]
},
{
  icon:'icon-git.svg', phase:'3. コミットの番号を取る',
  title:'★ 見間違いやすい番号があります',
  why:'<b>注釈付きのタグには、タグ自身の番号もあります。</b>コミットの番号と取り違えないよう、わざと出して見比べます。',
  pre:[
    ['git rev-parse v1.0.0', 'タグ v1.0.0 <b>そのもの</b>の番号を表示します'],
    ['git cat-file -t v1.0.0', 'その番号が指すものの種類を表示します（<code>-t</code> ＝ type）']
  ],
  cmdMulti:{ common:['git rev-parse v1.0.0', 'git cat-file -t v1.0.0'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['12-rev-parse-tag', '12-cat-file'],
  chain:'c12-local',
  expect:'前の画面とは<b>違う</b>40文字と、<code>tag</code> が出ます。',
  after:'<code>f295544…</code> は<b>タグ自身</b>の番号で、種類は <code>tag</code> です。コミットの番号ではありません。図の左の箱がこれで、右の箱（<code>e3d917e</code>）が、タグが指すコミットです。<br><b>「本番に出したコミット」を聞かれたら、答えは右の箱</b>です。前の画面の <code>git rev-list -n 1 タグ</code> で取り出します。',
  ask:'違う番号と tag が出ましたか？',
  ref:[ref.revParse, ref.catFile, pg.annotatedTags],
  tb:[]
},
{
  icon:'icon-github.svg', phase:'4. GitHub に送る',
  title:'タグを GitHub に送って、向こうの番号を確かめます',
  why:'<b><code>git push</code> だけでは、タグは送られません。</b>タグの名前を付けて送ります（根拠: Pro Git 2.6「タグの共有」）。',
  pre:[
    ['git push origin v1.0.0', 'タグ v1.0.0 を、あなたのフォークに送ります'],
    ['git ls-remote --tags origin', 'フォーク（origin）にあるタグと、その番号を表示します。<b>GitHub に聞いた答え</b>です']
  ],
  cmdMulti:{ common:['git push origin v1.0.0', 'git ls-remote --tags origin'] },
  cmdlabel:'1行ずつ打つコマンド',
  out:['12-push-tag', '12-ls-remote'],
  chain:'c12-remote',
  expect:'<code>* [new tag]         v1.0.0 -&gt; v1.0.0</code> と、<code>refs/tags/v1.0.0</code> の行が2つ出ます。',
  after:'2つの行の読み方です。<br>・<code>refs/tags/v1.0.0</code> … タグ自身の番号（<code>f295544…</code>）<br>・<code>refs/tags/v1.0.0^{}</code> … <b>タグが指すコミットの番号</b>（<code>e3d917e…</code>）。<code>^{}</code> は「タグをたどった先」という意味です<br>図の上の段が手元、下の段が GitHub です。2つとも同じ番号なので、<b>GitHub の v1.0.0 は、手元で決めたのと同じコミットを指している</b>と確かめられました。',
  ask:'^{} の行の番号が、前の画面のコミットの番号と同じでしたか？',
  ref:[pg.sharingTags, ref.lsRemote, ref.revParse],
  tb:[]
},
{
  icon:'icon-github.svg', phase:'5. 画面でも確かめる',
  title:'GitHub の画面で、タグを見ます',
  why:'同じことを、GitHub の画面でも確かめます。',
  todo:{
    common:['ブラウザで <b>https://github.com/あなたのユーザー名/trainer/tags</b> を開きます',
            '<code>v1.0.0</code> があることを確かめます',
            'そこに出ているコミットの番号（先頭の数文字）が、前の画面の <code>^{}</code> の行の番号の先頭と同じかを見比べます']
  },
  expect:'タグの一覧に v1.0.0 があり、コミットの番号の先頭が、手元で取り出した番号と同じです。',
  note:'画面の見方は、根拠の GitHub Docs（写真つき）を見てください。GitHub の「Releases」で、このタグからリリースのページを作ることもできます（この教材では作らなくて構いません）。',
  ask:'GitHub の画面で v1.0.0 が見えましたか？',
  ref:[gh.viewTags, gh.releases],
  tb:[]
},
{
  kind:'fin',
  title:'リリースタグを付けて、そのコミットの番号を取り出しました',
  lead:'手元と GitHub の両方で、v1.0.0 が同じコミットを指していることを、番号で確かめました。',
  gained:'<code>git tag -a</code> でタグを付け、<code>git push origin タグ</code> で送ります。タグが指すコミットの番号は <code>git rev-list -n 1 タグ</code>。<code>git rev-parse タグ</code> は<b>タグ自身</b>の番号なので、取り違えないようにします。',
  criteria:[
    '<code>git rev-list -n 1 v1.0.0</code> の答えと、<code>git ls-remote --tags origin</code> の <code>refs/tags/v1.0.0^{}</code> の番号が同じ',
    'GitHub のタグの一覧に v1.0.0 がある'
  ],
  deepenWhy:'この回で使わなかったタグの操作を、<b>打たずに</b>調べます。',
  deepen:'Git のタグについて、次の2つを教えてください。\n\n1. 一度 push したタグを、別のコミットに付け直すと、何が困るか\n2. 注釈付きのタグと軽量版のタグで、git rev-parse タグ の答えがどう違うか\n\n答えには、Pro Git 日本語版 2.6「タグ」か git help tag の該当する箇所を示してください。私は git help tag で確かめます。',
  ref:[pg.tagging, ref.tag],
  nextHref:'13-submodule.html',
  nextLabel:'第13回 サブモジュール へ'
}
]};
