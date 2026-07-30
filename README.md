# trainer

未経験者向けエンジニア育成カリキュラム。Claude Code / VS Code を使い、git や開発の進め方を段階的に学ぶ。

公開サイト: https://aq35.github.io/trainer/

## 受講者が進む順番

1. **[環境構築ナビ](docs/setup.html)** — 1画面1操作の対話式セットアップ（VS Code / Git / Claude Code / Bedrock接続）
2. [Step 2: git の基本](docs/step2-git.md) — 手を動かしながら10分
3. **[GitHubナビ](docs/github.html)** — アカウント作成から push まで

補足資料: [Step 0: ターミナル入門](docs/step0-terminal.md) / [環境構築でやっていること](docs/step1-setup.md)

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

受講者には次の3つを渡します。値そのものは、このリポジトリには置かないでください。

- AWS リージョン
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

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
| `docs/navi.js`, `docs/navi.css` | ナビ共通エンジン。ページ側は手順データのみ持つ |
| `docs/config.js` | 運営側が編集する設定（サポート窓口） |
| `docs/media/` | 図版（SVG） |

新しいナビを増やす場合は、`navi.css` / `navi.js` を読み込み、`window.NAVI = { key, steps, common }` を定義した HTML を追加してください。

## ライセンス

未定です。公開リポジトリのため、方針を決めて `LICENSE` を追加してください（社外利用を許すなら MIT や CC BY、社内限定にしたいなら記載なし＋リポジトリを非公開に戻す、など）。
