// コマンド練習（drill.html）の問題。scene / ask / why / choices の中の HTML は、
// ナビと同じくビルド時に許可したタグだけ通します。
//   type:"choice" … choices のうち answer 番目が正解
//   type:"input"  … expect のどれかと一致すれば正解（大文字小文字・前後の空白・連続空白は無視）
export const questions = [
  // --- 場所を動く ---
  { cat:'move', type:'choice', scene:'今どこにいるか分からなくなりました。',
    ask:'現在地を表示するには？',
    choices:['pwd（Macの場合）／cd（Windowsの場合）', 'ls', 'cd ..', 'mkdir'],
    answer:0, why:'Mac は pwd、Windows は cd だけを打つと現在地が出ます。迷ったらまずこれです。' },

  { cat:'move', type:'choice', scene:'今いるフォルダに何が入っているか見たい。',
    ask:'中身を一覧表示するには？',
    choices:['ls（Mac）／dir（Windows）', 'cd', 'git status', 'open'],
    answer:0, why:'フォルダをダブルクリックして中を見るのと同じ操作です。' },

  { cat:'move', type:'input', scene:'Desktop フォルダの中に入りたい。',
    ask:'打つコマンドは？（フォルダ名は Desktop）',
    expect:['cd desktop'], why:'cd は change directory の略。「そのフォルダに入る」という意味です。' },

  { cat:'move', type:'input', scene:'1つ上のフォルダに戻りたい。',
    ask:'打つコマンドは？',
    expect:['cd ..'], why:'点を2つで「1つ上」。Windows も Mac も同じです。' },

  { cat:'move', type:'input', scene:'practice という名前のフォルダを新しく作りたい。',
    ask:'打つコマンドは？',
    expect:['mkdir practice'], why:'mkdir は make directory の略。「作って」＋「何を」の形です。' },

  // --- git の基本 ---
  { cat:'git', type:'input', scene:'今どのファイルを変更したか確認したい。',
    ask:'打つコマンドは？',
    expect:['git status'], why:'迷ったら git status。今の状況を教えてくれる、いちばん使うコマンドです。' },

  { cat:'git', type:'choice', scene:'index.html を直しました。これを記録に残したい。',
    ask:'正しい順番はどれ？',
    choices:['git add → git commit', 'git commit → git add', 'git log → git commit', 'git restore → git add'],
    answer:0, why:'add で「記録するものを台に載せ」、commit で「シャッターを切る」。この順番です。' },

  { cat:'git', type:'input', scene:'index.html を、記録する対象に加えたい。',
    ask:'打つコマンドは？（ファイル名を指定して）',
    expect:['git add index.html'], why:'ステージ（台）に載せる操作です。まだ記録はされていません。' },

  { cat:'git', type:'input', scene:'「文章を直した」という説明を付けて記録したい。',
    ask:'打つコマンドは？（-m を使って）',
    expect:['git commit -m "文章を直した"', "git commit -m '文章を直した'"],
    why:'-m の後ろに説明を書きます。引用符で囲むのを忘れがちです。' },

  { cat:'git', type:'input', scene:'これまでの記録を一覧で見たい。',
    ask:'1行ずつ短く表示するコマンドは？',
    expect:['git log --oneline'], why:'--oneline を付けると1件1行になり、ぐっと読みやすくなります。' },

  { cat:'git', type:'input', scene:'変更したところだけを文字で確認したい。',
    ask:'打つコマンドは？',
    expect:['git diff'], why:'緑の + が増えた行、赤の − が消えた行です。' },

  { cat:'git', type:'choice', scene:'ファイルをぐちゃぐちゃにしてしまいました。最後の commit の状態に戻したい。',
    ask:'すべてのファイルを戻すには？',
    choices:['git restore .', 'git delete', 'git reset --hard origin', 'git log'],
    answer:0, why:'「.」は「全部」の意味。1つだけなら git restore ファイル名 です。' },

  { cat:'git', type:'choice', scene:'commit していない変更があります。',
    ask:'git restore . を打つとどうなる？',
    choices:['その変更は失われる', 'GitHubに保存される', '自動で commit される', '何も起きない'],
    answer:0, why:'だから「区切りがついたら commit」。commit してあるものは、いつでも戻せます。' },

  // --- ブランチ ---
  { cat:'branch', type:'input', scene:'add-color という名前で、新しいブランチを作って移動したい。',
    ask:'打つコマンドは？（-c を使って）',
    expect:['git switch -c add-color'], why:'-c は create。作ると同時に、そこへ移動します。' },

  { cat:'branch', type:'input', scene:'本線（main）に戻りたい。',
    ask:'打つコマンドは？',
    expect:['git switch main'], why:'-c を付けないと「すでにあるブランチへ移動」になります。' },

  { cat:'branch', type:'choice', scene:'ブランチを切り替えたら、書いたはずのコードが消えていました。',
    ask:'どういう状態？',
    choices:['別のブランチに残っているので、戻れば見られる', '完全に消えた', 'GitHubに移動した', 'commitが壊れた'],
    answer:0, why:'ブランチを移ると中身も切り替わります。消えたのではなく、元のブランチに残っています。' },

  { cat:'branch', type:'choice', scene:'main にいます。add-color の作業を取り込みたい。',
    ask:'打つコマンドは？',
    choices:['git merge add-color', 'git switch add-color', 'git push add-color', 'git add add-color'],
    answer:0, why:'「今いるブランチに、指定したブランチを合流させる」のが merge です。' },


  // --- チームで動く（仕事の一周・AI-DLCで出てきたもの） ---
  { cat:'team', type:'choice', scene:'GitHub にあるリポジトリを、自分のパソコンに持ってきたい。',
    ask:'使うコマンドは？（このあとに URL を続けます）',
    choices:['git clone', 'git pull', 'git push', 'git init'],
    answer:0, why:'clone は「複製」。上にあるものを、下ろしてくる操作です。案件の初日に必ず使います。' },

  { cat:'team', type:'input', scene:'作業を始める前に、他の人の変更を取り込みたい。',
    ask:'打つコマンドは？',
    expect:['git pull'], why:'案件では毎朝これをやります。取り込まずに進めると、あとで衝突が大きくなります。' },

  { cat:'team', type:'choice', scene:'merge したら CONFLICT と表示され、ファイルに &lt;&lt;&lt;&lt;&lt;&lt;&lt; という記号が増えていました。',
    ask:'これはどういう状態？',
    choices:['壊れてはいない。どちらを残すか聞かれている', 'ファイルが壊れた', 'gitのバグ', 'もう元に戻せない'],
    answer:0, why:'同じ行を2か所で直したときに出ます。残したい行を選び、記号の3行を消して保存すれば解決です。' },

  { cat:'team', type:'input', scene:'コンフリクトの解決をやめて、merge を始める前の状態に戻したい。',
    ask:'打つコマンドは？',
    expect:['git merge --abort'], why:'これを知っていれば、いつでも仕切り直せます。あわてて手で消さないでください。' },

  { cat:'team', type:'choice', scene:'プルリクエストを出すとき、説明欄をどうする？',
    ask:'いちばん良いのは？',
    choices:['何を・なぜ直したか、どう確認したかを書く', '空のまま出す', 'コードを全部貼る', '「修正しました」だけ書く'],
    answer:0, why:'レビューする人は、コードより先に説明を読みます。ここが空だと、読む側の負担が一気に増えます。' },

  { cat:'team', type:'choice', scene:'AIにレビューを頼みます。',
    ask:'いちばん力がつく頼み方は？',
    choices:['指摘だけしてもらい、自分で直す', '全部直してもらう', '直してから報告してもらう', 'レビューは頼まない'],
    answer:0, why:'直させると速いですが、上達しません。読んで、判断して、自分の手で直す。この順番が実力になります。' },

  // --- 原因を探す ---
  { cat:'find', type:'choice', scene:'ページが真っ白で、何も表示されません。',
    ask:'まずどこを見る？',
    choices:['開発者ツールの Console', 'GitHubの画面', 'CSSファイル', 'パソコンを再起動'],
    answer:0, why:'真っ白・動かない → まず Console、次に Network。この順番で、原因にたどり着く速さが変わります。' },

  { cat:'find', type:'choice', scene:'エラーは出ていないのに、画像やデータが表示されません。',
    ask:'開発者ツールのどのタブを見る？',
    choices:['Network（404が出ていないか）', 'Console だけ見れば十分', 'Elements', 'Sources'],
    answer:0, why:'404 は「そんなファイルは無い」という意味。ファイル名の打ち間違いが、とてもよくある原因です。' },

  { cat:'find', type:'choice', scene:'直したはずなのに、テストが赤いままです。',
    ask:'最初に確認することは？',
    choices:['保存したか、記録（commit）して送ったか', 'パソコンの再起動', 'テストを消す', 'データを書き換える'],
    answer:0, why:'保存忘れと push 忘れが大半です。データを書き換えて通すのは、直したことになりません。' },

  { cat:'find', type:'choice', scene:'AIに作業を頼む前に、いちばん効くのは？',
    ask:'どれ？',
    choices:['CLAUDE.md に前提と「確かめ方のコマンド」を書いておく', '長い文章で頼む', '何度も頼み直す', '新しいAIに変える'],
    answer:0, why:'確かめ方を知らないAIは、動かないコードを「できました」と言います。知っていれば、自分で確認してから持ってきます。' },

  { cat:'find', type:'choice', scene:'あいまいな依頼を受けました。「検索できるようにして」だけ。',
    ask:'最初にやることは？',
    choices:['質問して、決まっていないことを洗い出す', 'すぐ作り始める', 'AIに全部任せる', '断る'],
    answer:0, why:'聞かずに作ると、ほぼ確実に作り直しになります。現場でいちばん多い手戻りが、これです。' },

  // --- 事故防止 ---
  { cat:'safe', type:'choice', scene:'パスワードの書かれたファイルを、うっかり commit して GitHub に上げてしまいました。',
    ask:'まずやるべきことは？',
    choices:['すぐに担当者へ連絡する', '黙ってファイルを消す', '履歴を書き換えて隠す', '様子を見る'],
    answer:0, why:'消しても履歴に残ります。鍵の無効化が必要になることも。隠さず、すぐ相談するのが正解です。' },

  { cat:'safe', type:'choice', scene:'AIが「このファイルをまとめて書き換えます」と提案してきました。',
    ask:'どうする？',
    choices:['差分を読んで、納得できなければ断る', 'とりあえず全部OKを押す', '読まずに拒否する', 'VS Codeを閉じる'],
    answer:0, why:'決めるのは常に人です。分からなければ断ってよく、断ってもやり直しがききます。' },

  { cat:'safe', type:'choice', scene:'ブラウザで確認しても、直したはずの表示が変わりません。',
    ask:'最初に疑うことは？',
    choices:['保存したか／再読み込みしたか', 'パソコンの故障', 'ネットワークの不調', 'gitの設定ミス'],
    answer:0, why:'この2つで大半が解決します。VS Code はタブに「●」があれば未保存です。' }
];

export const categories = [
  { id:'all',    label:'全部' },
  { id:'move',   label:'場所を動く' },
  { id:'git',    label:'git の基本' },
  { id:'branch', label:'ブランチ' },
  { id:'team',   label:'チームで動く' },
  { id:'find',   label:'原因を探す' },
  { id:'safe',   label:'事故を防ぐ' }
];

