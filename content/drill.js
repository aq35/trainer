// コマンド練習（drill.html）の問題。第1〜10回で扱ったものだけ。
// scene / ask / why / choices の中の HTML は、ナビと同じくビルド時に許可したタグだけ通します。
//   type:"choice" … choices のうち answer 番目が正解
//   type:"input"  … expect のどれかと一致すれば正解（大文字小文字・前後の空白・連続空白は無視）
// 用語は Pro Git 日本語版にそろえる（content/terms.js で検査する）。
export const questions = [
  // --- ターミナル ---
  { cat:'move', type:'input', scene:'ターミナルで、いまどこにいるか分からなくなりました。',
    ask:'いまいる場所を表示するコマンドは？（Windows の PowerShell でも Mac でも同じ）',
    expect:['pwd'], why:'<code>pwd</code> は print working directory の略です。PowerShell でも <code>pwd</code> が使えます（Get-Location の別名）。' },
  { cat:'move', type:'input', scene:'1つ上のフォルダに移りたい。',
    ask:'打つコマンドは？',
    expect:['cd ..'], why:'<code>..</code> は「1つ上」を表します。Windows も Mac も同じです。' },
  { cat:'move', type:'input', scene:'ホーム（あなたのユーザーのフォルダ）に移りたい。',
    ask:'打つコマンドは？（第2回で使いました）',
    expect:['cd ~'], why:'<code>~</code> はホームを表します。' },

  // --- 第1回 ---
  { cat:'setup', type:'input', scene:'Git が入っているか、どの版かを確かめたい。',
    ask:'打つコマンドは？',
    expect:['git --version'], why:'何も変えずに、Git の版を表示します。' },
  { cat:'setup', type:'choice', scene:'<code>git config --global user.name</code> を、値を付けずに打ちました。',
    ask:'何が起きる？',
    choices:['いま設定されている名前が表示される', '名前が消える', 'エラーになる', '名前を入力する画面が出る'],
    answer:0, why:'値を付けると「設定」、付けないと「表示」になります。' },
  { cat:'setup', type:'choice', scene:'公開のリポジトリにプッシュする予定です。',
    ask:'コミットに書き込むメールアドレスについて、正しいのは？',
    choices:['コミットに書き込まれ、公開される。GitHub の noreply のアドレスも使える', 'GitHub の中だけで使われ、誰にも見えない', 'パスワードと一緒に暗号化される', 'メールアドレスは書き込まれない'],
    answer:0, why:'Git はコミットに名前とメールアドレスを書き込みます。公開したくなければ、GitHub が用意する <code>…@users.noreply.github.com</code> を使えます。' },

  // --- 第2回 ---
  { cat:'fork', type:'choice', scene:'この教材で練習する準備をします。',
    ask:'フォークとクローンの違いは？',
    choices:['フォークは GitHub の上で自分のアカウントにコピーすること。クローンはパソコンに持ってくること', 'どちらも同じ意味', 'フォークはパソコンに、クローンは GitHub に作る', 'フォークは読むだけ、クローンは書き込める'],
    answer:0, why:'フォークは GitHub の画面で行い、クローンは <code>git clone</code> で行います。' },
  { cat:'fork', type:'input', scene:'状態を知りたい。迷ったら、まずこれ。',
    ask:'打つコマンドは？',
    expect:['git status'], why:'いまのブランチ、変更したファイル、次にやることの案内を出します。何も変えません。' },
  { cat:'fork', type:'input', scene:'コミットの履歴を、1件1行で5件だけ見たい。',
    ask:'打つコマンドは？',
    expect:['git log --oneline -5', 'git log -5 --oneline'], why:'<code>--oneline</code> で1件1行、<code>-5</code> で5件に絞ります。' },
  { cat:'fork', type:'input', scene:'プッシュする先の URL を確かめたい。',
    ask:'打つコマンドは？',
    expect:['git remote -v'], why:'リモートの名前（origin）と URL を表示します。URL にあなたのユーザー名が入っていれば、あなたのフォークです。' },

  // --- 第3回 ---
  { cat:'commit', type:'choice', scene:'<code>git status</code> に <code>Untracked files:</code> と出ました。',
    ask:'どういう意味？',
    choices:['Git がまだ追跡していないファイルがある', 'ファイルが壊れている', 'コミットが済んでいる', 'GitHub に送られた'],
    answer:0, why:'「追跡されていない」ファイルです。<code>git add</code> すると、ステージングエリアに載ります。' },
  { cat:'commit', type:'choice', scene:'practice/hello.md を直しました。',
    ask:'コミットするまでの正しい順番は？',
    choices:['git add → git commit', 'git commit → git add', 'git push → git commit', 'git status → git push'],
    answer:0, why:'<code>git add</code> でステージングエリアに載せ、<code>git commit</code> でその中身をコミットします。' },
  { cat:'commit', type:'input', scene:'practice/hello.md を、ステージングエリアに載せたい。',
    ask:'打つコマンドは？',
    expect:['git add practice/hello.md'], why:'ファイルのいまの中身が、次のコミットに入る候補になります。コミットはまだされていません。' },
  { cat:'commit', type:'input', scene:'「練習用のファイルを作った」という説明でコミットしたい。',
    ask:'打つコマンドは？（-m を使って）',
    expect:['git commit -m "練習用のファイルを作った"', "git commit -m '練習用のファイルを作った'"],
    why:'<code>-m</code> のあとに、コミットメッセージを引用符で囲んで書きます。' },
  { cat:'commit', type:'choice', scene:'<code>git status</code> に <code>Your branch is ahead of \'origin/main\' by 1 commit.</code> と出ました。',
    ask:'どういう意味？',
    choices:['手元に、まだ GitHub に送っていないコミットが1つある', 'GitHub のほうが1つ進んでいる', 'コミットに失敗した', 'ブランチが1つ増えた'],
    answer:0, why:'<code>git push</code> で送ると、<code>up to date</code> に戻ります。' },
  { cat:'commit', type:'input', scene:'手元のコミットを、あなたのフォークに送りたい。',
    ask:'打つコマンドは？',
    expect:['git push'], why:'送る先は <code>origin</code>（あなたのフォーク）です。本家には届きません。' },

  // --- 第4回 ---
  { cat:'staging', type:'input', scene:'practice/todo.md を、うっかりステージングエリアに載せてしまった。作業ディレクトリの中身は残したい。',
    ask:'下ろすコマンドは？',
    expect:['git restore --staged practice/todo.md'], why:'<code>--staged</code> を付けると、ステージングエリアから下ろすだけです。作業ディレクトリのファイルは変わりません。' },
  { cat:'staging', type:'choice', scene:'hello.md を add したあと、もう1行足して保存しました。いま <code>git commit</code> すると？',
    ask:'コミットに入るのは？',
    choices:['add したときの中身（足した1行は入らない）', '保存したいまの中身', '何も入らない', 'エラーになる'],
    answer:0, why:'ステージングエリアに載るのは、add したときの中身です。足した1行は、もう一度 add すると載ります。' },

  // --- 第5回 ---
  { cat:'diff', type:'input', scene:'次のコミットに入る変更（ステージした変更）を、差分で見たい。',
    ask:'打つコマンドは？',
    expect:['git diff --staged', 'git diff --cached'], why:'<code>git diff</code> だけだと、まだ add していない変更を見せます。' },
  { cat:'diff', type:'choice', scene:'差分の中に <code>-ステージングエリアの練習をしています。</code> という行がありました。',
    ask:'どういう意味？',
    choices:['この行が消えた（前にはあって、後には無い）', 'この行が増えた', 'この行は変わっていない', 'この行でエラーが起きた'],
    answer:0, why:'<code>-</code> は消えた行、<code>+</code> は増えた行です。1行を書き換えると、<code>-</code> と <code>+</code> の組で表されます。' },

  // --- 第6回 ---
  { cat:'log', type:'input', scene:'practice/hello.md を変えたコミットだけを、1件1行で見たい。',
    ask:'打つコマンドは？',
    expect:['git log --oneline -- practice/hello.md'], why:'<code>--</code> のあとにファイルやフォルダを書くと、そこを変えたコミットだけに絞れます。' },
  { cat:'log', type:'choice', scene:'<code>git log --grep="Git-Flow"</code> を打ちました。',
    ask:'何を探している？',
    choices:['コミットメッセージに Git-Flow を含むコミット', 'ファイルの中身に Git-Flow を含むファイル', 'Git-Flow という名前のブランチ', 'Git-Flow という名前の人のコミット'],
    answer:0, why:'<code>--grep</code> はコミットメッセージを探します。1行目だけでなく、2行目以降も探します。' },

  // --- 第7回 ---
  { cat:'undo', type:'choice', scene:'プッシュ済みのコミットを取り消したい。',
    ask:'この教材で使った方法は？',
    choices:['git revert で、打ち消すコミットを足す', 'git commit --amend で置き換える', 'git restore でファイルを戻す', 'GitHub の画面でコミットを消す'],
    answer:0, why:'revert は履歴を書き換えないので、そのまま <code>git push</code> で送れます。amend はプッシュ前だけに使います。' },
  { cat:'undo', type:'choice', scene:'一度も add していない変更を <code>git restore practice/hello.md</code> で捨てました。',
    ask:'捨てた中身は？',
    choices:['Git からは戻せない', 'git revert で戻せる', 'ステージングエリアに残っている', 'GitHub に残っている'],
    answer:0, why:'add もコミットもしていない中身は、Git のどこにも入っていません。捨てる前に <code>git diff</code> で確かめます。' },

  // --- 第8回 ---
  { cat:'ignore', type:'choice', scene:'コミット済みの settings.local を、あとから .gitignore に書きました。',
    ask:'どうなる？',
    choices:['追跡は続く（.gitignore は追跡されていないファイルにだけ効く）', 'すぐに追跡されなくなる', 'ファイルが消える', 'エラーになる'],
    answer:0, why:'追跡をやめるには <code>git rm --cached</code> を使います。前のコミットの中身は残ります。' },
  { cat:'ignore', type:'input', scene:'practice/app.log が、どの決まりで無視されているかを知りたい。',
    ask:'打つコマンドは？',
    expect:['git check-ignore -v practice/app.log'], why:'どのファイルの何行目の決まりで無視されているかを表示します。' },

  // --- 第9回 ---
  { cat:'branch', type:'input', scene:'try-greeting というブランチを作って、そこへ移りたい。',
    ask:'打つコマンドは？',
    expect:['git switch -c try-greeting'], why:'<code>-c</code> は create。作って、移ります。' },
  { cat:'branch', type:'choice', scene:'<code>git merge</code> の出力に <code>Fast-forward</code> と出ました。',
    ask:'どういう意味？',
    choices:['main の指す先を先に進めただけ。新しいコミットは作られていない', 'マージコミットが作られた', 'コンフリクトが起きた', 'ブランチが消えた'],
    answer:0, why:'main が先に進んでいなかったときのマージです。両方が進んでいると、マージコミットができます。' },

  // --- 第10回 ---
  { cat:'conflict', type:'input', scene:'コンフリクトの途中で分からなくなった。マージを始める前に戻りたい。',
    ask:'打つコマンドは？',
    expect:['git merge --abort'], why:'途中のマージをやめて、始める前の状態に戻します。どちらのブランチのコミットも消えません。' },
  { cat:'conflict', type:'choice', scene:'コンフリクトした hello.md の印を消して、残したい中身にして保存しました。',
    ask:'次にすることは？',
    choices:['git add practice/hello.md（解決したと伝える）→ git commit', 'git push', 'git merge --abort', 'git restore practice/hello.md'],
    answer:0, why:'add が「解決した」の合図です。<code>git status</code> が <code>All conflicts fixed</code> を出したら、commit でマージを終えます。' }
];

export const categories = [
  { id:'all',    label:'全部' },
  { id:'move',   label:'ターミナル' },
  { id:'setup',  label:'第1回 道具' },
  { id:'fork',   label:'第2回 フォークとクローン' },
  { id:'commit', label:'第3回 コミット' },
  { id:'staging', label:'第4回 ステージングエリア' },
  { id:'diff',   label:'第5回 差分' },
  { id:'log',    label:'第6回 履歴' },
  { id:'undo',   label:'第7回 取り消す' },
  { id:'ignore', label:'第8回 追跡しないもの' },
  { id:'branch', label:'第9回 ブランチとマージ' },
  { id:'conflict', label:'第10回 コンフリクト' }
];
