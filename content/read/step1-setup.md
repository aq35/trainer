# 環境構築でやっていること（参考）

<div class="note">
<strong>実際にセットアップする人は、こちらを使ってください →  <a href="setup.html" target="_blank" rel="noopener">環境構築ナビ</a></strong><br>
1画面に1つの操作だけが表示され、「できましたか？」に答えながら進みます。手順はナビ側にだけ書いてあります。
</div>

このページは手順書ではありません。**「何を入れているのか」「なぜ必要なのか」**を後から確認したい人と、サポートする側のための参照ページです。

## 入れるもの

| 入れるもの | 何をするもの | 無いとどうなる |
| --- | --- | --- |
| <img class="ti" width="26" height="26" src="media/icon-vscode.svg" alt="">VS Code | 文章やプログラムを書くアプリ | 何も書けない |
| <img class="ti" width="26" height="26" src="media/icon-git.svg" alt="">Git | 変更の履歴を残す道具 | このあとの git の練習が進められない |
| <img class="ti" width="26" height="26" src="media/icon-ai.svg" alt="">Claude Code 拡張機能 | VS Code の中でAIに相談できるようにする | AIが使えない |

<div class="note">
<strong>Node.js は入れません。</strong> 拡張機能は必要なものを内蔵しているため、追加のインストールは不要です。ターミナルで <code>claude</code> コマンドを直接使いたい上級者だけ、別途セットアップが必要になります。
</div>

## AIへの接続について

この研修では、個人のAnthropicアカウントではなく、**会社のAWS（Amazon Bedrock）経由**でAIを使います。そのため設定が2つ必要です。

1. **サインイン画面を出さない設定**（VS Code の設定で `Disable Login Prompt` をオン）
   これをしないと、個人アカウントのサインイン画面が出て先に進めません。
2. **APIキーを設定ファイルに書く**（`~/.claude/settings.json` の `env` に記述）

```json
{
  "env": {
    "CLAUDE_CODE_USE_BEDROCK": "1",
    "AWS_REGION": "配布されたリージョン",
    "AWS_BEARER_TOKEN_BEDROCK": "配布されたAPIキー"
  }
}
```

このファイルに書いた内容は**保存され続ける**ので、次回以降の入力は不要です。設定を反映するには VS Code の再起動が必要です。

<div class="note">
認証は <strong>Amazon Bedrock の APIキー</strong>（<code>AWS_BEARER_TOKEN_BEDROCK</code>）を使っています。アクセスキーとシークレットキーの2つを配る方式に比べ、<strong>受講者に渡す値が1つで済み</strong>、AWSの認証情報の概念を説明せずに進められます。
</div>

<div class="note">
ターミナルで <code>export</code> や <code>$env:</code> を使う方法もありますが、<strong>VS Code 拡張機能には効きません</strong>。拡張機能は別のプロセスで動くため、ターミナルで設定した内容を引き継がないためです。必ず設定ファイル側に書いてください。
</div>

## つまずいたときの対応表（サポート向け）

| 症状 | 原因 | 対応 |
| --- | --- | --- |
| 「Sign in」画面が出る | `Disable Login Prompt` が未設定 | 設定をオンにして VS Code を再起動 |
| Authentication failed | APIキーの誤り、前後の空白や改行の混入 | 配布したキーと照合。1行に収まっているか確認 |
| 設定したのに反映されない | VS Code を再起動していない | 完全に終了して開き直す |
| ターミナルで設定したが効かない | 拡張機能はターミナルの環境変数を引き継がない | 設定ファイルに移す |
| モデルが使えない旨の英語 | AWS 側の権限・モデル有効化の問題 | 受講者では解決不可。運営側で対応 |

## 関連

- [環境構築ナビ](setup.html ':ignore target=_blank')（実際の手順）
- [ターミナル入門](step0-terminal.md)（黒い画面が初めての人向け）
- [git の基本](git.html ':ignore target=_blank')
