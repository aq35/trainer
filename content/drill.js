// コマンド練習（drill.html）の問題。第1〜3回で扱ったものだけ。回が増えたら、ここにも足す。
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
    expect:['git push'], why:'送る先は <code>origin</code>（あなたのフォーク）です。本家には届きません。' }
];

export const categories = [
  { id:'all',    label:'全部' },
  { id:'move',   label:'ターミナル' },
  { id:'setup',  label:'第1回 道具' },
  { id:'fork',   label:'第2回 フォークとクローン' },
  { id:'commit', label:'第3回 コミット' }
];
