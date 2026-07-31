# trainer

未経験者向けエンジニア育成カリキュラム。Claude Code / VS Code を使い、git や開発の進め方を段階的に学ぶ。

公開サイト: https://aq35.github.io/trainer/

## 受講者が進む順番

1. **[環境構築ナビ](docs/setup.html)** — VS Code / Git / Claude Code / Bedrock接続
2. [git の基本](docs/step2-git.md) — 記録する・戻す（読み物・10分）
3. **[GitHubナビ](docs/github.html)** — アカウント作成から push まで
4. **[差分を読む](docs/diff.html)** — AIの提案を読んで判断するための土台
5. **[AIと一緒に直す](docs/ai.html)** — 権限モード・承認・拒否・取り消し・頼み方
6. **[はじめてのプログラム](docs/code.html)** — HTML/JavaScript を書く・動かす・エラーを読んで直す・自力課題
7. **[ブランチと安全な進め方](docs/branch.html)** — ブランチ / merge / .gitignore / プルリクエスト（一人で一周）
8. **[世界に公開する](docs/publish.html)** — GitHub Pages で自分のページを公開し、デプロイを体験する

いつでも: **[コマンド練習](docs/drill.html)** — 20問のクイズ形式ドリル（分野別・成績保存・間違いだけ再挑戦）

読み物（寄り道）: [なぜ VS Code なのか？](docs/why-vscode.md) / [なぜ git が生まれたのか](docs/why-git.md) / [AIはなぜ間違えるのか](docs/why-ai-mistakes.md) / [サービスって何？](docs/what-is-service.md)

補足資料: [用語集](docs/glossary.md) / [Step 0: ターミナル入門](docs/step0-terminal.md) / [環境構築でやっていること](docs/step1-setup.md)

トップページには全体の進捗マップが出ます（各ナビの進み具合をブラウザから読み取って表示）。

### 相談・進捗用の非公開リポジトリ（推奨）

この教材リポジトリは GitHub Pages のため**公開**です。ここに進捗や質問の Issue を立てると、**誰でも読めて、誰でも書けます**。受講者の「どこで詰まったか」が外部に残り、荒らしも防げません。

そこで、相談と進捗の受け口は**別の非公開リポジトリ**に分けます。

1. 非公開リポジトリを作る（**作成済み: `aq35/trainer-support`**）
2. この教材リポジトリ側は `Settings → Features → Issues` の**チェックを外す**
3. `docs/config.js` の `url` を、非公開リポジトリの `issues/new` に向ける（**設定済み**）
4. `docs/config.js` の `inviteEmail` に、参加申請を受け取るメールアドレスを書く（**設定済み**）

受講者は GitHubナビの「研修グループへの参加を申請します」で、自分の GitHub ユーザー名を送ってきます。届いたら、非公開リポジトリの `Settings → Collaborators → Add people` でそのユーザー名を招待してください。**無料プランでも、非公開リポジトリのコラボレーターは人数制限なく追加できます。**

招待が届くまでの間も研修は進められます（報告ボタンだけが 404 になり、その旨は画面に説明しています）。

### 進捗の把握

受講者の進み具合はブラウザ内（localStorage）にあり、サーバーには送られません。運営側が把握する手段として、**GitHub Issue での報告**を用意しています。

- トップの進捗マップの下と、各ナビの完了画面に「報告する」ボタンがある
- 押すと、進捗が入力済みの状態で Issue 作成画面が開く。受講者は送信を押すだけ
- Issue には `進捗` ラベルが付くので、`label:進捗` で絞り込めば全員の状況が一覧できる
- 宛先のリポジトリは `docs/config.js` の `url`（または `repo`）から決まる。**非公開リポジトリに向けてください**

**自動送信はしていません。** 静的サイトから GitHub に書き込むには書き込み権限のあるトークンが必要で、それをページに置くと誰でも悪用できてしまうためです。「ログイン済みなら1クリック」が、追加のサーバーを持たずに実現できる上限です。

## 運営側のセットアップ

### 1. サポート窓口を設定する（必須）

`docs/config.js` に連絡先を記入してください。未設定だと、受講者向けの案内に「連絡先が未設定です」と表示されます。

```js
window.TRAINER_SUPPORT = {
  name: '研修サポート担当',
  channel: 'Slack の #engineer-training',
  url: 'https://example.slack.com/archives/xxxxx'
};
```

### 2. Bedrock の接続情報を配布する

受講者には次の2つを渡します。値そのものは、このリポジトリには置かないでください。

- **Amazon Bedrock の APIキー**（`AWS_BEARER_TOKEN_BEDROCK` に入る値）
- AWS リージョン

アクセスキーとシークレットキーの2つを配る方式ではなく、**APIキー1つ**にしています。受講者に渡す値が減り、AWSの認証情報の概念を説明せずに済むためです。APIキーは Amazon Bedrock のコンソールで発行できます。

受講者側は VS Code の `Disable Login Prompt` をオンにし、`~/.claude/settings.json` の `env` に書き込む流れです（ナビが誘導します）。ターミナルの環境変数では VS Code 拡張機能に反映されないため、この方式にしています。

### 3. GitHub Pages

`Settings > Pages > Build and deployment > Source` を `Deploy from a branch`、Branch を `main`、フォルダを `/docs` に設定します。

`docs/.nojekyll` が必要です（Jekyll がアンダースコア始まりのファイルを除外し、`_sidebar.md` が配信されなくなるため）。

ローカル確認: `npx serve docs`

## 構成

| パス | 役割 |
| --- | --- |
| `docs/index.html` | docsify のエントリ（Markdown をサイト表示） |
| `docs/setup.html`, `docs/github.html` | 対話式ナビ（独立した静的HTML） |
| `docs/navi.js`, `docs/navi.css` | ナビ共通エンジン。ページ側は手順データのみ持つ。ヘルプの3段構え（初手チェック／症状検索／AI・人への相談）もここ |
| `docs/config.js` | 運営側が編集する設定（サポート窓口） |
| `docs/progress.js` | トップの進捗マップと Step 2 のチェックリスト |
| `docs/drill.html`, `docs/drill.js` | コマンド練習ドリル（設問は drill.js の Q 配列） |
| `docs/media/` | 図版（SVG） |

新しいナビを増やす場合は、`navi.css` / `navi.js` / `config.js` を読み込み、`window.NAVI = { key, steps, common }` を定義した HTML を追加してください。

### キャッシュについて

各HTMLは `config.js?v=2` のようにバージョンを付けて読み込んでいます。**`config.js` や `navi.js` を変更したら、全HTMLの `?v=` の数字を1つ上げてください。** 上げないと、受講者のブラウザが古いファイルを使い続け、連絡先を変えても反映されません。

```
grep -rl '?v=2' docs/*.html | xargs sed -i '' 's/?v=2/?v=3/g'   # Mac
```

## ライセンス

未定です。公開リポジトリのため、方針を決めて `LICENSE` を追加してください（社外利用を許すなら MIT や CC BY、社内限定にしたいなら記載なし＋リポジトリを非公開に戻す、など）。
