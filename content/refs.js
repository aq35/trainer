// 根拠のリンク（design/curriculum.md 3.2）。教材の ref: に並べて使う。
// URL は、それぞれの公式サイトの元データ（git/git-scm.com・github/docs・microsoft/vscode-docs）で
// ページとアンカーが実在することを確かめてから書く。推測で書かない。
// 確かめた日: 2026-09-26
const PG = 'https://git-scm.com/book/ja/v2/';
const DOC = 'https://git-scm.com/docs/';
const GH = 'https://docs.github.com/ja/';
const VS = 'https://code.visualstudio.com/docs/';

// Pro Git 日本語版（git-scm.com。CC BY-NC-SA 3.0 なので、本文や図は写さずリンクで案内する）
export const pg = {
  states: ['Pro Git 1.3「三つの状態」', PG + '使い始める-Gitの基本.html#_三つの状態'],
  install: ['Pro Git 1.5「Gitのインストール」', PG + '使い始める-Gitのインストール.html'],
  identity: ['Pro Git 1.6「個人の識別情報」', PG + '使い始める-最初のGitの構成.html#_個人の識別情報'],
  help: ['Pro Git 1.7「ヘルプを見る」', PG + '使い始める-ヘルプを見る.html'],
  clone: ['Pro Git 2.1「既存のリポジトリのクローン」', PG + 'Git-の基本-Git-リポジトリの取得.html#r_git_cloning'],
  status: ['Pro Git 2.2「ファイルの状態の確認」', PG + 'Git-の基本-変更内容のリポジトリへの記録.html#r_checking_status'],
  track: ['Pro Git 2.2「新しいファイルの追跡」', PG + 'Git-の基本-変更内容のリポジトリへの記録.html#r_tracking_files'],
  commit: ['Pro Git 2.2「変更のコミット」', PG + 'Git-の基本-変更内容のリポジトリへの記録.html#r_committing_changes'],
  log: ['Pro Git 2.3「コミット履歴の閲覧」', PG + 'Git-の基本-コミット履歴の閲覧.html'],
  remotes: ['Pro Git 2.5「リモートの表示」', PG + 'Git-の基本-リモートでの作業.html#_リモートの表示'],
  push: ['Pro Git 2.5「リモートへのプッシュ」', PG + 'Git-の基本-リモートでの作業.html#r_pushing_remotes'],
  // 第4〜10回（元データ git/git-scm.com の external/book/content/book/ja/v2 で見出しの id を確かめた。2026-09-27）
  staging: ['Pro Git 2.2「変更したファイルのステージング」', PG + 'Git-の基本-変更内容のリポジトリへの記録.html#_変更したファイルのステージング'],
  diff: ['Pro Git 2.2「ステージされている変更 / されていない変更の閲覧」', PG + 'Git-の基本-変更内容のリポジトリへの記録.html#r_git_diff_staged'],
  ignoring: ['Pro Git 2.2「ファイルの無視」', PG + 'Git-の基本-変更内容のリポジトリへの記録.html#r_ignoring'],
  removing: ['Pro Git 2.2「ファイルの削除」', PG + 'Git-の基本-変更内容のリポジトリへの記録.html#r_removing_files'],
  limitLog: ['Pro Git 2.3「ログ出力の制限」', PG + 'Git-の基本-コミット履歴の閲覧.html#_ログ出力の制限'],
  undoing: ['Pro Git 2.4「作業のやり直し」', PG + 'Git-の基本-作業のやり直し.html'],
  unstaging: ['Pro Git 2.4「ステージしたファイルの取り消し」', PG + 'Git-の基本-作業のやり直し.html#r_unstaging'],
  unmodifying: ['Pro Git 2.4「ファイルへの変更の取り消し」', PG + 'Git-の基本-作業のやり直し.html#_ファイルへの変更の取り消し'],
  branches: ['Pro Git 3.1「ブランチとは」', PG + 'Git-のブランチ機能-ブランチとは.html'],
  newBranch: ['Pro Git 3.1「新しいブランチの作成」', PG + 'Git-のブランチ機能-ブランチとは.html#r_create_new_branch'],
  switching: ['Pro Git 3.1「ブランチの切り替え」', PG + 'Git-のブランチ機能-ブランチとは.html#r_switching_branches'],
  basicBranching: ['Pro Git 3.2「ブランチの基本」', PG + 'Git-のブランチ機能-ブランチとマージの基本.html#r_basic_branching'],
  merging: ['Pro Git 3.2「マージの基本」', PG + 'Git-のブランチ機能-ブランチとマージの基本.html#r_basic_merging'],
  conflicts: ['Pro Git 3.2「マージ時のコンフリクト」', PG + 'Git-のブランチ機能-ブランチとマージの基本.html#r_basic_merge_conflicts'],
  branchMgmt: ['Pro Git 3.3「ブランチの管理」', PG + 'Git-のブランチ機能-ブランチの管理.html'],
  // 第11〜13回（元データで見出しの id を確かめた。2026-09-27）
  pull: ['Pro Git 2.5「リモートからのフェッチ、そしてプル」', PG + 'Git-の基本-リモートでの作業.html#r_fetching_and_pulling'],
  tagging: ['Pro Git 2.6「タグ」', PG + 'Git-の基本-タグ.html'],
  annotatedTags: ['Pro Git 2.6「注釈付きのタグ」', PG + 'Git-の基本-タグ.html#r_annotated_tags'],
  sharingTags: ['Pro Git 2.6「タグの共有」（git push はタグを送らない）', PG + 'Git-の基本-タグ.html#r_sharing_tags'],
  submodules: ['Pro Git 7.11「サブモジュール」', PG + 'Git-のさまざまなツール-サブモジュール.html'],
  startSubmodules: ['Pro Git 7.11「サブモジュールの作り方」', PG + 'Git-のさまざまなツール-サブモジュール.html#r_starting_submodules'],
  cloneSubmodules: ['Pro Git 7.11「サブモジュールを含むプロジェクトのクローン」', PG + 'Git-のさまざまなツール-サブモジュール.html#r_cloning_submodules'],
};

// Git 本体の説明（英語。git help <コマンド> で出るものと同じ）
export const ref = {
  install: ['Git 公式「Install for Windows」（英語）', 'https://git-scm.com/install/windows.html'],
  installMac: ['Git 公式「Install for macOS」（英語）', 'https://git-scm.com/install/mac.html'],
  // Microsoft Learn（元データ MicrosoftDocs/windows-dev-docs の hub/package-manager/winget/ で確かめた。2026-09-27）
  // Homebrew（元データ Homebrew/install の README で確かめた。2026-09-27）
  brew: ['Homebrew 公式「Install Homebrew」（英語）', 'https://github.com/Homebrew/install#install-homebrew-on-macos-or-linux'],
  winget: ['Microsoft Learn「winget install」', 'https://learn.microsoft.com/ja-jp/windows/package-manager/winget/install'],
  wingetAbout: ['Microsoft Learn「WinGet」— 入っている Windows と、見つからないとき', 'https://learn.microsoft.com/ja-jp/windows/package-manager/winget/'],
  config: ['git config（英語）', DOC + 'git-config'],
  clone: ['git clone（英語）', DOC + 'git-clone'],
  status: ['git status（英語）', DOC + 'git-status'],
  add: ['git add（英語）', DOC + 'git-add'],
  commit: ['git commit（英語）', DOC + 'git-commit'],
  log: ['git log（英語）', DOC + 'git-log'],
  remote: ['git remote（英語）', DOC + 'git-remote'],
  push: ['git push（英語）', DOC + 'git-push'],
  restore: ['git restore（英語）', DOC + 'git-restore'],
  diff: ['git diff（英語）', DOC + 'git-diff'],
  show: ['git show（英語）', DOC + 'git-show'],
  revert: ['git revert（英語）', DOC + 'git-revert'],
  rm: ['git rm（英語）', DOC + 'git-rm'],
  gitignore: ['gitignore（英語）', DOC + 'gitignore'],
  checkIgnore: ['git check-ignore（英語）', DOC + 'git-check-ignore'],
  branch: ['git branch（英語）', DOC + 'git-branch'],
  switch: ['git switch（英語）', DOC + 'git-switch'],
  merge: ['git merge（英語）', DOC + 'git-merge'],
  pull: ['git pull（英語）', DOC + 'git-pull'],
  tag: ['git tag（英語）', DOC + 'git-tag'],
  revList: ['git rev-list（英語）', DOC + 'git-rev-list'],
  revParse: ['git rev-parse（英語）', DOC + 'git-rev-parse'],
  catFile: ['git cat-file（英語）', DOC + 'git-cat-file'],
  lsRemote: ['git ls-remote（英語）', DOC + 'git-ls-remote'],
  lsTree: ['git ls-tree（英語）', DOC + 'git-ls-tree'],
  submodule: ['git submodule（英語）', DOC + 'git-submodule'],
  // リリースノート（Pro Git 日本語版が古いコマンドで書かれている所の根拠）
  rel223: ['Git 2.23 のリリースノート（git switch・git restore が加わった。英語）', 'https://github.com/git/git/blob/master/Documentation/RelNotes/2.23.0.adoc'],
  rel234: ['Git 2.34 のリリースノート（マージの既定の方法が ort になった。英語）', 'https://github.com/git/git/blob/master/Documentation/RelNotes/2.34.0.adoc'],
};

// GitHub Docs 日本語版（GitHub 側の操作。画面写真は、こちらの公式ページにあるものを見てもらう）
// 名前は、このリポジトリで付けた説明（公式の日本語の見出しとは一字一句同じではない）
export const gh = {
  account: ['GitHub Docs: アカウントを作る', GH + 'account-and-profile/how-tos/account-management/creating-an-account-on-github'],
  commitEmail: ['GitHub Docs: コミットに使うメールアドレスの設定', GH + 'account-and-profile/how-tos/email-preferences/setting-your-commit-email-address'],
  noreply: ['GitHub Docs: noreply のメールアドレス', GH + 'account-and-profile/reference/email-addresses-reference'],
  fork: ['GitHub Docs: リポジトリをフォークする（画面の写真つき）', GH + 'pull-requests/how-tos/work-with-forks/fork-a-repo'],
  forks: ['GitHub Docs: フォークの公開範囲', GH + 'pull-requests/reference/forks'],
  clone: ['GitHub Docs: リポジトリをクローンする（画面の写真つき）', GH + 'repositories/creating-and-managing-repositories/cloning-a-repository'],
  push: ['GitHub Docs: コミットをプッシュする', GH + 'get-started/using-git/pushing-commits-to-a-remote-repository'],
  // 元データ github/docs の content/ で確かめた（2026-09-27）
  amend: ['GitHub Docs: コミットメッセージの変更（プッシュ済みなら履歴の書き換えになる）', GH + 'pull-requests/how-tos/commit-changes/changing-a-commit-message'],
  ignoring: ['GitHub Docs: ファイルを無視する', GH + 'get-started/git-basics/ignoring-files'],
  sensitive: ['GitHub Docs: リポジトリから機密データを削除する', GH + 'authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository'],
  conflictCli: ['GitHub Docs: コマンドラインでマージコンフリクトを解決する', GH + 'pull-requests/how-tos/merge-and-close-pull-requests/resolving-a-merge-conflict-using-the-command-line'],
  commits: ['GitHub Docs: コミット', GH + 'pull-requests/reference/commits'],
  flow: ['GitHub Docs: GitHub フロー（ブランチ → 変更 → プルリクエスト → マージ → ブランチを消す）', GH + 'get-started/using-github/github-flow'],
  compare: ['GitHub Docs: コミットの比較（compare の画面）', GH + 'pull-requests/how-tos/commit-changes/comparing-commits'],
  createPr: ['GitHub Docs: プルリクエストの作成（画面の写真つき）', GH + 'pull-requests/how-tos/create-pull-requests/creating-a-pull-request'],
  mergePr: ['GitHub Docs: プルリクエストのマージ（画面の写真つき）', GH + 'pull-requests/how-tos/merge-and-close-pull-requests/merging-a-pull-request'],
  mergeMethods: ['GitHub Docs: プルリクエストのマージの方法（マージコミット）', GH + 'pull-requests/reference/pull-request-merges'],
  releases: ['GitHub Docs: リリースについて（リリースは Git のタグにもとづく）', GH + 'repositories/releasing-projects-on-github/about-releases'],
  viewTags: ['GitHub Docs: リリースとタグを見る', GH + 'repositories/releasing-projects-on-github/viewing-your-repositorys-releases-and-tags'],
};

// VS Code（英語）
export const vs = {
  setupWin: ['VS Code「Visual Studio Code on Windows」（英語）', VS + 'setup/windows'],
  setupMac: ['VS Code「Visual Studio Code on macOS」（英語）', VS + 'setup/mac'],
  terminal: ['VS Code「Terminal basics」（英語）', VS + 'terminal/basics'],
  github: ['VS Code「Working with GitHub」（英語。プッシュのときのサインイン）', VS + 'sourcecontrol/github'],
  terminalAuth: ['VS Code の設定 git.terminalAuthentication の説明（英語・VS Code のソース）', 'https://github.com/microsoft/vscode/blob/main/extensions/git/package.nls.json'],
  // 元データ microsoft/vscode-docs の docs/sourcecontrol/merge-conflicts.md で確かめた（2026-09-27）
  conflicts: ['VS Code「Resolve merge conflicts」（英語。Accept Current Change などのボタン）', VS + 'sourcecontrol/merge-conflicts'],
};
