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
};

// Git 本体の説明（英語。git help <コマンド> で出るものと同じ）
export const ref = {
  install: ['Git 公式「Install for Windows」（英語）', 'https://git-scm.com/install/windows.html'],
  installMac: ['Git 公式「Install for macOS」（英語）', 'https://git-scm.com/install/mac.html'],
  // Microsoft Learn（元データ MicrosoftDocs/windows-dev-docs の hub/package-manager/winget/ で確かめた。2026-09-27）
  winget: ['Microsoft Learn「winget install」— Git を入れる例と、-e・--source の意味', 'https://learn.microsoft.com/ja-jp/windows/package-manager/winget/install'],
  wingetAbout: ['Microsoft Learn「WinGet」— 入っている Windows と、見つからないとき', 'https://learn.microsoft.com/ja-jp/windows/package-manager/winget/'],
  config: ['git config（英語）', DOC + 'git-config'],
  clone: ['git clone（英語）', DOC + 'git-clone'],
  status: ['git status（英語）', DOC + 'git-status'],
  add: ['git add（英語）', DOC + 'git-add'],
  commit: ['git commit（英語）', DOC + 'git-commit'],
  log: ['git log（英語）', DOC + 'git-log'],
  remote: ['git remote（英語）', DOC + 'git-remote'],
  push: ['git push（英語）', DOC + 'git-push'],
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
};

// VS Code（英語）
export const vs = {
  setupWin: ['VS Code「Visual Studio Code on Windows」（英語）', VS + 'setup/windows'],
  setupMac: ['VS Code「Visual Studio Code on macOS」（英語）', VS + 'setup/mac'],
  terminal: ['VS Code「Terminal basics」（英語）', VS + 'terminal/basics'],
  github: ['VS Code「Working with GitHub」（英語。プッシュのときのサインイン）', VS + 'sourcecontrol/github'],
  terminalAuth: ['VS Code の設定 git.terminalAuthentication の説明（英語・VS Code のソース）', 'https://github.com/microsoft/vscode/blob/main/extensions/git/package.nls.json'],
};
