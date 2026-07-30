# trainer

未経験者向けエンジニア育成カリキュラム。Claude Code / VS Code を使い、git や開発の進め方を段階的に学ぶ。

## 受講者向け公開サイト

読みやすい形式（Docsify）で `docs/` 以下を公開しています。

- GitHub Pages を有効化すると `https://<org>.github.io/trainer/` で閲覧できます。
  - リポジトリの `Settings > Pages > Build and deployment > Source` を `Deploy from a branch` にし、Branch を `claude/engineer-training-beginners-sx74q6`（または main）・フォルダを `/docs` に設定してください。
- ローカルで確認する場合は `docs/` を静的サーバーで配信してください（例: `npx serve docs`）。

## カリキュラム

- **[環境構築ナビ](docs/setup.html)** — 未経験者向けの対話式セットアップ案内（1画面1操作・つまずき対応つき）
- [Step 0: ターミナル入門](docs/step0-terminal.md)
- [Step 1: 環境構築（VS Code + Claude Code）](docs/step1-setup.md)
- [Step 2: git の基本](docs/step2-git.md)
