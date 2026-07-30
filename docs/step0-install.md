# Step 0: 環境構築（Claude Code のインストール）

対象: PC操作はできるが、ターミナル・git・APIキーの概念に触れたことがない人。

## ゴール

- 自分のPCで `claude` コマンドが動く状態にする
- 詰まったときに「自分で調べる」のではなく「Claudeに聞く」を体験する
- 15分以上詰まったら一人で粘らず、代替手段に切り替える判断ができる

## 進め方の原則

- 手順書を読んで黙々と進めるのではなく、**エラーが出たらそのままコピペしてClaudeに聞く**ことを最初のルールにする。
- 質問先は最初は https://claude.ai （ブラウザ版、インストール不要）でよい。ここでのやり取りが「AIと一緒に問題を解決する」最初の練習になる。
- サポート役の人間は手順を代わりにやらない。「今何が表示されてる？」「それをClaudeに貼ってみて」と聞き返すだけに徹する。

## 事前に用意するもの

- AWS Bedrock 経由のアクセス情報（担当者から配布済みのもの一式）
- 会社/個人のPC（管理者権限でソフトをインストールできること）

## 手順

### 1. ターミナルを開く

- Mac: `Spotlight検索`（Cmd + Space）→ `ターミナル`
- Windows: スタートメニュー → `PowerShell`

ここで「ターミナルって何？」となるのは正常。真っ黒い画面に文字を打ち込む場所、という説明だけで先に進んでよい。

### 2. Node.js を入れる

Claude Code は Node.js 上で動く。

- Mac: https://nodejs.org からLTS版をダウンロードしてインストーラを実行
- Windows: 同上、Windows用インストーラを実行

確認:

```
node -v
```

バージョン番号が出れば成功。`command not found` 等が出たら、そのままの文言をclaude.aiに貼って聞く。

### 3. git を入れる

- Mac: 多くの場合プリインストール済み。`git --version` を実行し、なければ案内に従ってインストール。
- Windows: https://git-scm.com からインストーラを実行（オプションは基本デフォルトのままでよい）

確認:

```
git --version
```

### 4. Claude Code をインストール

```
npm install -g @anthropic-ai/claude-code
```

確認:

```
claude --version
```

### 5. Bedrock 経由でのAPI接続を設定

配布された値を使って環境変数を設定する（値は担当者から個別に受け取る）。

```
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=<配布されたリージョン>
export AWS_ACCESS_KEY_ID=<配布された値>
export AWS_SECRET_ACCESS_KEY=<配布された値>
```

Windows(PowerShell)の場合は `export` の代わりに `$env:` を使う。

```
$env:CLAUDE_CODE_USE_BEDROCK="1"
$env:AWS_REGION="<配布されたリージョン>"
$env:AWS_ACCESS_KEY_ID="<配布された値>"
$env:AWS_SECRET_ACCESS_KEY="<配布された値>"
```

### 6. 動作確認

適当な空フォルダを作って移動し、`claude` を起動する。

```
mkdir hello-claude
cd hello-claude
claude
```

Claude Codeが起動して対話できれば Step 0 完了。

## 詰まったときのルール

1. まずエラーメッセージをそのままclaude.aiに貼って聞いてみる。
2. **15分**取り組んでも解決しなければ、一人で抱えずサポート役に声をかける。
3. それでも解決しない、あるいはPCの制約（管理者権限がない等）で詰まった場合は、ローカルインストールを一旦保留し、**ブラウザ完結の代替環境**（Claude Code on the web）に切り替えてStep 1以降を先に進める。インストールは後回しにしてよい。

インストールの成否を「その人ができるかどうか」の判定にしない。詰まったら退避、が正しい進め方。

## 次のステップ

Step 1: 空リポジトリで `git init` から始める（別ドキュメント）。
