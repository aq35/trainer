# 自分のリポジトリにも、自動チェックを入れる

<div class="lead">
研修で使った<b>自動チェックは、練習用の仕掛けではありません。</b><br>
2つのファイルをコピーするだけで、<b>あなたの個人開発でも、同じものが動きます</b>。<br>
研修が終わったあと、これが<b>「一人でも作法が崩れない」ための道具</b>になります。
</div>

## 何が起きるようになるか

自分のリポジトリでプルリクエストを出すたびに、**毎回この表がコメントされます。**

| 見るところ | | 内容 |
| --- | --- | --- |
| ブランチ名 | ◯ | `fix/12-login-error` |
| PRの説明 | △ | 未記入: 動作確認したこと |
| 変更の大きさ | ◯ | 48 行 |
| **秘密の情報** | **×** | **鍵やトークンらしき文字列が含まれています** |
| 消し忘れ | △ | `console.log` が 2 行 |
| コミットの説明 | ◯ | 5 件とも具体的です |

**テストがあれば、それも走ります。** 無くても動きます（作法の部分だけを見ます）。

<div class="note">
とくに効くのが<b>「秘密の情報」</b>です。個人開発でいちばん怖い事故は、APIキーを公開リポジトリに上げてしまうこと。<b>push した瞬間に、機械が見つけて教えてくれます。</b>
</div>

## なぜ、一人なのにレビューが要るのか

<div class="qa">
<div class="q">一人で作っているのに、プルリクエストを出す意味はありますか？</div>
<div class="a"><b>あります。</b>一人だと「動いたからいいや」で終わり、説明を書かず、巨大な変更をまとめて突っ込むようになります。それが3か月続くと、<b>自分でも読めないコードが残ります</b>。<br>PRを出すと、その手前で必ず一度立ち止まります。<b>相手がいなくても、作法は保てます。</b></div>
</div>

<div class="qa">
<div class="q">自分でマージするだけなら、意味が無いのでは？</div>
<div class="a">自分の差分を、<b>他人の目で読み直す時間</b>が生まれます。ここで気づけることは、驚くほど多いです。<br>そして案件に入ったとき、<b>すでに毎日やっていること</b>になります。習慣は、必要になってからでは間に合いません。</div>
</div>

## 入れ方（5分）

<div class="note">
<b>「仕事の一周」で使った練習リポジトリが手元にあれば、そこからコピーするのが一番早いです。</b>
</div>

### 1. 2つのファイルをコピーする

自分のリポジトリのフォルダに、次の形で置きます。

```
あなたのリポジトリ/
  .github/
    workflows/
      check.yml          ← コピーする
    scripts/
      grade.mjs          ← コピーする
    PULL_REQUEST_TEMPLATE.md   ← これも入れておくと便利
```

<details>
<summary>ファイルはどこから取る？</summary>

**手元の練習リポジトリからコピー**するのが確実です。

- `trainer-practice/.github/workflows/check.yml`
- `trainer-practice/.github/scripts/grade.mjs`
- `trainer-practice/.github/PULL_REQUEST_TEMPLATE.md`

手元に無ければ、[GitHub の練習リポジトリ](https://github.com/aq35/trainer-practice/tree/main/.github)から、ファイルを開いて右上のコピーボタンで取れます。

**Claude に頼んでも構いません。**

> trainer-practice の .github フォルダにある check.yml と grade.mjs を、このリポジトリの同じ場所にコピーして

</details>

### 2. commit して push する

```
git add .github
git commit -m "自動チェックを追加した"
git push
```

### 3. 試しに1回、プルリクエストを出す

```
git switch -c chore/1-check
```

何か1行だけ直して commit → push → GitHub でプルリクエストを作ります。
**1〜2分で、結果のコメントが入ります。**

<div class="checkpoint">
<strong>表がコメントされれば成功です。</strong> これ以降、あなたのリポジトリでは、PRを出すたびに毎回これが動きます。
</div>

## つまずいたら

<details>
<summary>コメントが入らない</summary>

- リポジトリの **Actions** タブを開いて、実行されているか確認してください
- 「I understand my workflows, go ahead and enable them」という緑のボタンが出ていたら押します
- **非公開リポジトリの場合**、Actions の無料枠に上限があります（公開リポジトリは無制限）。上限に達すると動きません
</details>

<details>
<summary>「Resource not accessible by integration」と出る</summary>

コメントを書く権限が足りていません。`check.yml` の中に、この3行が入っているか確認してください。

```yaml
permissions:
  contents: read
  pull-requests: write
```
</details>

<details>
<summary>テストが無いのに赤くなる</summary>

なりません。`test/` フォルダが無ければ、テストの表は出ずに作法だけを見ます。
それでも赤くなる場合は、`check.yml` を貼り間違えている可能性があります。
</details>

<details>
<summary>チェックの中身を変えたい</summary>

`.github/scripts/grade.mjs` は**あなたのファイル**です。自由に変えてください。

たとえば「差分200行以内」を厳しくしたり、自分がよくやる消し忘れ（`debugger` や `TODO`）を足したり。
**自分に必要なチェックを足していくのが、この道具の正しい育て方です。**
</details>

## この道具の、本当の使いどころ

研修中は、赤や△を「直すべきもの」と感じるかもしれません。**そう思わなくて構いません。**

これは**採点ではなく、鏡**です。一人で長く作り続けると、必ず作法が崩れます。
鏡があれば、崩れたことに自分で気づけます。**それだけで、3か月後のコードがまったく違うものになります。**

<div class="note">
<b>独立して仕事を受けるようになったときも、同じです。</b>一人で受けて、一人で作って、一人で納める。<b>チェックしてくれる人はいません。</b>そのときに効くのが、自分で用意した鏡です。
</div>

---

- 練習リポジトリ → [aq35/trainer-practice](https://github.com/aq35/trainer-practice)
- 自分のテーマで回す → [自分のテーマで回す](theme.html ':ignore target=_blank')
- 全体を見る → [トップページ](/)
