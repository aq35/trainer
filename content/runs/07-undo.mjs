// 第7回「取り消す」
import { T } from './_texts.mjs';
const H = 'practice/hello.md';
export default [
  { write: { [H]: T.hello7 } },
  { id: '7-diff', run: 'git diff' },
  { areas: 'a7-mistake', paths: [H] },
  { id: '7-restore', run: 'git restore practice/hello.md' },
  { id: '7-status-clean', run: 'git status' },
  { areas: 'a7-restored', paths: [H] },
  { write: { 'practice/todo.md': T.todo7 } },
  { id: '7-add', run: 'git add practice/todo.md' },
  { id: '7-commit-typo', run: 'git commit -m "todo.md に項目をたs"' },
  { id: '7-amend', run: 'git commit --amend -m "todo.md に項目を足した"' },
  { id: '7-log-amend', run: 'git log --oneline -2' },
  { id: '7-push', run: 'git push' },
  { id: '7-revert', run: 'git revert --no-edit HEAD' },
  { id: '7-log-revert', run: 'git log --oneline -3' },
  { id: '7-push-revert', run: 'git push' },
  { id: '7-status', run: 'git status' },
];
