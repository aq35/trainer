# Git トレーナー

**Git だけを、一人で使えるところまで。** 黒い画面が初めての人が、自分の作業を Git でコミットし、取り消し、ブランチで試し、コンフリクトを自分で直せるようになるまでの、全10回の教材です。

公開サイト: https://aq35.github.io/trainer/

> いまは**第1〜3回**を公開しています。第4〜10回は準備中です。設計は [design/curriculum.md](design/curriculum.md)。

---

## この教材の約束

詳しくは [design/curriculum.md の「3. 書き方の約束」](design/curriculum.md)。

| 約束 | どう守っているか |
| --- | --- |
| **用語は Pro Git 日本語版にそろえる** | 作業ディレクトリ・ステージングエリア・リポジトリ・コンフリクト など。独自の呼び名（「作業フォルダ」「セーブポイント」など）は [`content/terms.js`](content/terms.js) に並べ、**本文に入っていたらビルドが止まる** |
| **コマンドの画面には根拠のリンク** | Git 本体の説明・Pro Git・GitHub Docs のどれか（[`content/refs.js`](content/refs.js)）。**根拠の無い画面があるとビルドが止まる** |
| **出力は、実際に打ったものだけ** | 各回の手順を台本（[`content/runs/`](content/runs/)）にし、[`tools/record.mjs`](tools/record.mjs) が**本物の Git で実行して**出力を保存する。画面の出力と、打たせるコマンドが食い違うとビルドが止まる |
| **図は、信頼できる順に** | ① 実行した出力 → ② **実行したあとのリポジトリから機械で描いた図**（[`tools/figs.mjs`](tools/figs.mjs)）→ ③ 手描き（根拠つき）→ ④ 画面写真は載せず、公式の説明（写真つき）へのリンク |
| **全コマンドに「打つ前」と「打った後」の説明** | 行数と説明の数が合わないとビルドが止まる |
| **AI は「調べる道具」** | 各回の終わりに「AI で深める」を1問。答えは Git で確かめる（読み物 [Git を調べるコツ](content/read/git-research.md)） |

## 練習のしかた

受講者は、**このリポジトリを自分の GitHub のアカウントにフォーク**して練習します（第2回）。

- 練習で触るのは **`practice/` フォルダの中だけ**
- プッシュする先は**自分のフォークだけ**（本家にはプルリクエストを出さない）
- **フォークは公開される**ので、`practice/` に個人情報を書かない（[GitHub Docs: フォークの公開範囲](https://docs.github.com/ja/pull-requests/reference/forks)）
- このリポジトリの Actions は、**フォークでは動かない**ように条件を付けています（`if: github.repository == 'aq35/trainer'`）

## 構成

| パス | 役割 |
| --- | --- |
| `content/navi/*.js` | 各回の中身（手順・根拠・「うまくいきません」）。`01-tools.js` → `01-tools.html` |
| `content/runs/*.mjs` | 各回で打つコマンドの台本。`recorded.json` は、それを本物の Git で打った出力 |
| `content/refs.js` | 根拠のリンクの一覧（公式サイトの元データで、ページとアンカーの実在を確かめたもの） |
| `content/terms.js` | 教材で使わない言葉（用語ゆれの検査） |
| `content/read/*.md` | 読み物。目次の並びは `_sidebar.md` |
| `content/course.js` | トップの地図（全10回）。まだ書いていない回は `soon: true` |
| `content/drill.js` | コマンド練習の問題 |
| `content/config.js` | 運営側が編集する設定（詰まったときの連絡先） |
| `public/media/` | 図版。ビルドせずにそのまま公開される |
| `site/` | 画面の部品（[sunao](sunao/README.md) の `.sunao`） |
| `tools/` | ビルド（`build.mjs`）・出力の記録（`record.mjs`）・図（`figs.mjs`）・変換（`html.mjs` `md.mjs` `navi.mjs` `doc.mjs`） |
| `docs/` | **ビルドの出力**（GitHub Pages が配信する）。手で直さない |
| `design/` | 教材の設計 |

## 教材を直すとき

```bash
npm install
npm run record       # content/runs/ を本物の Git で打ち直し、出力を保存する（台本を変えたとき）
npm run dev          # http://localhost:8000/ 。保存するたびに作り直す
npm test             # 変換・ビルド・出力の記録のテスト（Playwright があれば、ブラウザでの操作も）
```

- **コマンドを打たせる画面**には、`pre`（打つ前の説明を1行ずつ）・`after`（打った後の説明）・`ref`（根拠）が要ります。無いとビルドが止まります
- **出力を載せる**ときは、台本（`content/runs/NN-*.mjs`）に `{ id, run }` を足し、`npm run record` を打ってから、画面に `out: 'id'` と書きます
- **図を載せる**ときは、台本に `{ areas: 'id', paths: [...] }` を足し、画面に `areas: 'id'` と書くと、その時点のリポジトリから図を描きます
- **本文にコミットの番号（7文字）を書いた**ら、その画面の出力に同じ番号が無いとビルドが止まります（出力を撮り直したときの書き忘れを防ぐ）

## 公開

`main` に push すると、[`.github/workflows/pages.yml`](.github/workflows/pages.yml) がテストとビルドを走らせ、`docs/` が変わっていれば自動でコミットします。GitHub Pages は `main` の `/docs` を配信しています（Settings → Pages）。

## 運営側の設定

詰まったときの連絡先を [`content/config.js`](content/config.js) の `support` に書きます。未設定なら、受講者には「研修の担当者に連絡してください」とだけ出ます。`url` を GitHub の `issues/new` にすると、トップの地図の「進捗を報告する」が Issue を開く形になります。

## ライセンス

| 対象 | ライセンス |
| --- | --- |
| コード（`.html` / `.js` / `.mjs` / `.sunao` / `.css`） | [MIT](LICENSE) |
| 教材（`content/read/**/*.md`、`public/media/**`） | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.ja) |

詳しくは [LICENSE-docs.md](LICENSE-docs.md)。**Pro Git の本文と図は CC BY-NC-SA 3.0 なので、この教材には取り込まず、リンクで案内しています。**

改訂履歴（間違えていたことも含めて）: [content/read/changelog.md](content/read/changelog.md)
