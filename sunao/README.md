# sunao（vendored）

このディレクトリは [aq35/lab-kaihatu-mock](https://github.com/aq35/lab-kaihatu-mock) の
`frontendlab/sunao/` から**必要な 4 ファイルだけ**をコピーしたものです。

| ファイル | 役割 |
| --- | --- |
| `compile.mjs` | `.sunao` を JS モジュールへコンパイル（ビルド時のみ） |
| `expr.mjs` | テンプレート式の自前パーサ（ビルド時のみ） |
| `runtime.mjs` | signal と DOM 描画の極小ランタイム（受講者のブラウザに届くのはこれだけ） |
| `esbuild-plugin.mjs` | esbuild に `.sunao` を読ませるプラグイン（theme / recipe の解決は削った） |

- 取り込み元: `lab-kaihatu-mock` の `main`（コミット `9330f4f`）
- **ここを直接直さないでください。** 不具合は取り込み元で直し、テストを通してから、もう一度コピーします。
  （このリポジトリ側で直すと、次にコピーしたときに黙って消えます）
