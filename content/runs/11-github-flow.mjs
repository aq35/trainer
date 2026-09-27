// 第11回「GitHub フロー」。プルリクエストは、自分のフォークの中だけで出してマージする
import { T } from './_texts.mjs';
export default [
  { id: '11-switch-c', run: 'git switch -c add-about' },
  { write: { 'practice/about.md': T.about11 } },
  { id: '11-add', run: 'git add practice/about.md' },
  { id: '11-commit', run: 'git commit -m "このリポジトリについての説明を足した"' },
  { id: '11-push-u', run: 'git push -u origin add-about' },
  // GitHub の画面で、プルリクエストを作って「Merge pull request」を押す操作の代わり（マージコミットを作る形）
  { github: ['git fetch -q origin', 'git branch add-about origin/add-about', 'git merge --no-ff --no-edit add-about', 'git push -q origin HEAD:main'] },
  { id: '11-switch-main', run: 'git switch main' },
  { id: '11-pull', run: 'git pull' },
  { id: '11-graph', run: 'git log --oneline --graph -4' },
  { id: '11-branch-d', run: 'git branch -d add-about' },
  { id: '11-push-delete', run: 'git push origin --delete add-about' },
];
