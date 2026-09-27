// 第5回「差分を読む」
import { T } from './_texts.mjs';
export default [
  { id: '5-diff-none', run: 'git diff' },
  { write: { 'practice/hello.md': T.hello5 } },
  { id: '5-diff', run: 'git diff' },
  { id: '5-add', run: 'git add practice/hello.md' },
  { id: '5-diff-after-add', run: 'git diff' },
  { id: '5-diff-staged', run: 'git diff --staged' },
  { id: '5-add-todo', run: 'git add practice/todo.md' },
  { id: '5-diff-stat', run: 'git diff --staged --stat' },
  { id: '5-commit', run: 'git commit -m "hello.md の説明を直し、todo.md を足した"' },
  { id: '5-push', run: 'git push' },
  { id: '5-status', run: 'git status' },
];
