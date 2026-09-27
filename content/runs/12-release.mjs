// 第12回「リリースとタグ」。本番に出すコミットにタグを付け、タグが指すコミットの番号を Git に聞く
export default [
  { id: '12-tag', run: 'git tag -a v1.0.0 -m "最初のリリース"' },
  { id: '12-tag-list', run: 'git tag' },
  { id: '12-show', run: 'git show --stat v1.0.0' },
  { id: '12-rev-list', run: 'git rev-list -n 1 v1.0.0' },
  { id: '12-rev-parse-head', run: 'git rev-parse HEAD' },
  { tagchain: 'c12-local', tag: 'v1.0.0' },
  { id: '12-rev-parse-tag', run: 'git rev-parse v1.0.0' },
  { id: '12-cat-file', run: 'git cat-file -t v1.0.0' },
  { id: '12-push-tag', run: 'git push origin v1.0.0' },
  { id: '12-ls-remote', run: 'git ls-remote --tags origin' },
  { tagchain: 'c12-remote', tag: 'v1.0.0', remote: true },
];
