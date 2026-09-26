# git トレーナー

**GitHub の上で、本物の git を打って覚える。** まったくの初心者から、実務に入る直前まで。

- レッスンは、あなたのリポジトリに **Issue として1つずつ届きます**
- あなたは手元で `git` を打ち、push や プルリクエスト（PR）で「提出」します
- **ボット（GitHub Actions）が、あなたのリポジトリの実際の状態を見て合否を出し**、Issue や PR にコメントします。合格すると次の Issue が開きます
- コンフリクト・レビューの指摘・不具合の報告は、ボットが **チームメイト役として本当に起こします**

読むだけでは先に進めません。手を動かした結果だけが、合格になります。

---

## レッスン

| | 内容 | 使うコマンド・操作 |
| --- | --- | --- |
| 1 | 手元に持ってきて、1つ記録して、GitHub に返す | `clone` `status` `add` `commit` `push` `log` |
| 2 | 小さく、何度も記録する | `diff` `diff --staged` `commit -am` |
| 3 | 他の人の変更を取り込んで、履歴を調べる | `fetch` `pull` `log` `show` |
| 4 | 取り消す | `restore` `restore --staged` `revert` |
| 5 | ブランチで作業して、PR で取り込む | `switch -c` `push -u` `branch -d` `fetch --prune`、PR・マージ |
| 6 | コンフリクトを解決する | `pull origin main`、衝突の印を読んで直す |
| 7 | レビューの指摘に応える | 同じ PR への追加 push |
| 8 | push したコミットを直す | `commit --amend` `push --force-with-lease` |
| 9 | 仕事の一周: Issue を読んで、直して、閉じる | 全部。テスト、`Closes #番号` |

教材に載せている出力は、**すべて実際にコマンドを実行して得たもの** です。あなたの画面では、ハッシュ（`424b503` のような英数字）・日時・URL だけが変わります。

---

## 0. 準備

### 1. 道具を入れる

| | Windows | Mac |
| --- | --- | --- |
| **Git** | https://git-scm.com/download/win からインストール。以後、ターミナルは一緒に入る **Git Bash** を使います | ターミナルで `git --version` と打ち、案内が出たらインストール |
| **エディタ** | [VS Code](https://code.visualstudio.com/) | 同じ |
| **Node.js**（レッスン9で使用） | https://nodejs.org/ の LTS 版 | 同じ |
| **GitHub アカウント** | https://github.com/signup | 同じ |

入ったか確かめます。

```bash
git --version
```

実際の出力（数字はもっと新しくても構いません）:

```
git version 2.43.0
```

### 2. git に自分のことを教える（最初の1回だけ）

```bash
# 記録に残す名前（GitHub で他の人にも見えます）
git config --global user.name "あなたの名前"
# 記録に残すメール（GitHub に登録したものがおすすめ）
git config --global user.email "you@example.com"
# 最初のブランチの名前を main にする
git config --global init.defaultBranch main
# git pull で枝分かれしていたら「マージ」でまとめる
git config --global pull.rebase false
```

4行目を設定しないと、レッスン3以降の `git pull` が次のように止まります（実際の出力です）。

```
hint: You have divergent branches and need to specify how to reconcile them.
...
fatal: Need to specify how to reconcile divergent branches.
```

確かめます。

```bash
git config --global --list
```

実際の出力:

```
user.name=練習 花子
user.email=hanako@example.com
init.defaultbranch=main
pull.rebase=false
```

### 3. 自分の教室（リポジトリ）を作る

1. このページの上にある緑の **Use this template** → **Create a new repository** を押します
2. **Repository name** に `git-trainer` と入れます
3. **Public** を選びます（あなたの学習記録が、そのまま人に見せられる実績になります）
4. **Create repository** を押します

1分ほどすると、新しいリポジトリの **Issues** タブに **「1. 手元に持ってきて、1つ記録して、GitHub に返す」** が届きます。そこから始めてください。

> Issue が届かないときは、新しいリポジトリの **Actions** タブ → 左の **trainer** → **Run workflow** を押します。

### 4. GitHub にログインできるようにする（最初の push の前に）

GitHub へ push するには、あなたの PC からのログインが必要です（パスワードでは push できません）。

- **Windows:** Git for Windows に入っている仕組みが、最初の `git push` のときにブラウザを開いてくれます。案内どおり **Sign in with your browser** でログインします
- **Mac:** [GitHub CLI](https://cli.github.com/) を入れて、次を打ちます。質問には `GitHub.com` → `HTTPS` → `Yes`（git の認証に使う）→ `Login with a web browser` と答えます

  ```bash
  gh auth login
  ```

---

## しくみ（知りたい人向け）

```
あなたの PC                     あなたの GitHub リポジトリ
────────────                    ─────────────────────────
git push  ──────────────────▶  .github/workflows/trainer.yml が起動
                                  │
                                  ▼
                                .github/trainer/grade.mjs
                                  ・いま開いているレッスンの Issue を探す
                                  ・コミット、ブランチ、PR、コメントを調べる
                                  ・合格 → Issue を閉じ、次の Issue を開く
                                  ・まだ → 足りないところをコメント
```

- 合否は、届いたイベントではなく **リポジトリの状態** で決めます。何度動いても、同じ状態なら同じ結果です
- レッスンの本文は `.github/trainer/lessons/` にあります。合否の条件は `.github/trainer/lessons.mjs` にあり、各レッスンの「合格の条件」と同じことをしています
- `practice/` がレッスンで使う練習場所です

---

## この教材を直す人へ

```bash
node selftest/run.mjs
```

受講者の操作を、レッスン1から9まで **本物の git で** なぞり、ボットが正しく合否を出すかを確かめます。GitHub の API だけは `selftest/fake-github.mjs` が代わりをします。途中で「空のファイルを push する」「悪いメッセージで記録する」「PR の本文を書かない」「`Closes` を書き忘れる」などの間違いも入れ、ボットが正しく指摘するかも確かめます。
このリポジトリへの push では `.github/workflows/selftest.yml` が同じテストを動かします。

- この元リポジトリ（`aq35/trainer`）では、採点ボットは動きません（ワークフローの `if:` で止めています）
- **Use this template** を出すには、リポジトリの **Settings** → **General** → **Template repository** にチェックを入れます

旧版の教材（静的サイト版）は `archive/v1/` にあります。

## ライセンス

- プログラム: [LICENSE](LICENSE)
- 教材の文章: [LICENSE-docs.md](LICENSE-docs.md)
