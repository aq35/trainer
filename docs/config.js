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
 *   note:    '（任意）連絡先の下に小さく表示される補足'
 *
 * url は次のようなものが使えます。
 *   Slack   : チャンネルを開いて「リンクをコピー」
 *   Teams   : チャンネルの「…」→「チャネルへのリンクを取得」
 *   メール   : 'mailto:support@example.com'
 *   GitHub  : 'https://github.com/aq35/trainer-support/issues/new'（非公開リポジトリを推奨）
 */
window.TRAINER_SUPPORT = {
  /* 参加申請のあて先メールアドレス。
   * 受講者が GitHub のユーザー名を送ってくるので、届いたら
   * 相談用リポジトリの Settings → Collaborators → Add people で招待してください。
   * 例: 'training@example.com'                                     */
  inviteEmail: 'nagaresteller+trainer@gmail.com',

  name: '研修サポート窓口',
  channel: '研修グループの GitHub Issue に書いてください',
  url: 'https://github.com/aq35/trainer-support/issues/new',
  // 補足（任意）。連絡先の下に小さく表示されます。
  note: 'ページが開けない（404）ときは、まだ研修グループに招待されていません。GitHub のアカウントがまだの場合も含め、この研修を案内してくれた人に直接連絡してください。'
};
