/* 研修の運営側が編集する設定ファイル。
 * 受講者が詰まったときの連絡先を、ここに1回だけ書いてください。
 *
 * 未記入のままでも研修は進められますが、受講者の画面には
 * 「研修の担当者に連絡してください」としか出ません。
 * 具体的な窓口を書いておくと、詰まった人がすぐ相談できます。
 *
 * 記入例:
 *   name:    '研修サポート担当'
 *   channel: 'Slack の #engineer-training'
 *   url:     'https://example.slack.com/archives/C0123456789'
 *
 * url は次のようなものが使えます。
 *   Slack   : チャンネルを開いて「リンクをコピー」
 *   Teams   : チャンネルの「…」→「チャネルへのリンクを取得」
 *   メール   : 'mailto:support@example.com'
 *   GitHub  : 'https://github.com/aq35/trainer/issues/new'
 */
window.TRAINER_SUPPORT = {
  name: '',      // 担当者名や窓口の名前
  channel: '',   // どこで聞けるか（受講者向けの説明）
  url: ''        // 押したら飛べる先。無ければ空のままでOK
};
