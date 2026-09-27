// 第13回「サブモジュール」。自分のフォークを practice/lib にサブモジュールとして入れ、
// リリースタグ → そのコミット → サブモジュールのコミット の番号を Git に聞く
export default [
  { id: '13-sub-add', run: 'git submodule add {{FORK}} practice/lib' },
  { id: '13-status', run: 'git status' },
  { id: '13-gitmodules', run: 'cat .gitmodules' },
  { id: '13-commit', run: 'git commit -m "自分のフォークを、サブモジュールとして足した"' },
  { id: '13-sub-status', run: 'git submodule status' },
  { id: '13-tag', run: 'git tag -a v1.1.0 -m "サブモジュールを入れたリリース"' },
  { id: '13-rev-list', run: 'git rev-list -n 1 v1.1.0' },
  { id: '13-ls-tree', run: 'git ls-tree v1.1.0 practice/lib' },
  { id: '13-sub-tag', run: 'git -C practice/lib rev-list -n 1 v1.0.0' },
  { tagchain: 'c13', tag: 'v1.1.0', path: 'practice/lib' },
  { id: '13-push', run: 'git push' },
  { id: '13-push-tag', run: 'git push origin v1.1.0' },
  { id: '13-ls-remote', run: 'git ls-remote --tags origin' },
  { tagchain: 'c13-remote', tag: 'v1.1.0', remote: true },
];
