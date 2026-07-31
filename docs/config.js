/* 研修の運営側が編集する設定ファイル。
 * 受講者が詰まったときの連絡先を、ここに1回だけ書いてください。
 *
 * ◆ 連絡手段は何でも構いません（LINE・Slack・メール・チャットなど）。
 *   教材側は「進捗や状況を文章にしてコピー」まで面倒を見るので、
 *   受講者はそれを貼って送るだけです。特別な準備は要りません。
 *
 * ◆ url に GitHub の issues/new を指定した場合だけ、
 *   コピーではなく「Issueを開く」ボタンに変わります（任意）。
 *
 * 未記入のままでも研修は進められますが、受講者の画面には
 * 「研修の担当者に連絡してください」としか出ません。
 * 具体的な窓口を書いておくと、詰まった人がすぐ相談できます。
 *
 * 記入例:
 *   name:    '研修サポート担当'
 *   channel: 'Slack の #engineer-training'
 *   url:     'https://example.slack.com/archives/C0123456789'
 *   note:    '（任意）連絡先の下に小さく表示される補足'
 *
 * url は次のようなものが使えます。
 *   Slack   : チャンネルを開いて「リンクをコピー」
 *   Teams   : チャンネルの「…」→「チャネルへのリンクを取得」
 *   メール   : 'mailto:support@example.com'
 *   GitHub  : 'https://github.com/aq35/trainer-support/issues/new'（非公開リポジトリを推奨）
 */
window.TRAINER_SUPPORT = {

  name: '研修サポート窓口',
  channel: 'LINE（研修のグループ）',
  url: '',
  // 補足（任意）。連絡先の下に小さく表示されます。
  note: '連絡先が分からないときは、この研修を案内してくれた人に聞いてください。'
};

/* 任意: 教材の維持に対する寄付（コーヒー1杯）の受け口。
 *
 * url を空のままにすると、寄付の案内は<b>どこにも表示されません</b>。
 * この教材は無料で、寄付は完全な任意です。受講者に見せたくない場合は、
 * 空のままにしておいてください。
 *
 * url に使えるもの（どれか1つ）:
 *   Buy Me a Coffee : 'https://buymeacoffee.com/ユーザー名'
 *   GitHub Sponsors : 'https://github.com/sponsors/ユーザー名'
 *   Ko-fi           : 'https://ko-fi.com/ユーザー名'
 *   OFUSE           : 'https://ofuse.me/ユーザー名'
 *   PayPal.Me       : 'https://paypal.me/ユーザー名'
 */
window.TRAINER_COFFEE = {
  url: 'https://github.com/sponsors/aq35',
  // ボタンの文字（任意）
  label: '☕ コーヒーを1杯おごる',
  // ボタンの下に小さく出る補足（任意）
  note: '受け取ったぶんは、この教材の維持と改善に使います。何を直したかは「改訂履歴」に書いていきます。'
};
