// 第10回「コンフリクト」
import { T } from './_texts.mjs';
const H = 'practice/hello.md';
export default [
  { id: '10-switch-c', run: 'git switch -c change-title' },
  { write: { [H]: T.hello10branch } },
  { id: '10-add-branch', run: 'git add practice/hello.md' },
  { id: '10-commit-branch', run: 'git commit -m "題名を「Git の練習帳」にした"' },
  { id: '10-switch-main', run: 'git switch main' },
  { write: { [H]: T.hello10main } },
  { id: '10-add-main', run: 'git add practice/hello.md' },
  { id: '10-commit-main', run: 'git commit -m "題名に（練習）を足した"' },
  { id: '10-merge-conflict', run: 'git merge --no-edit change-title', fails: true },
  { id: '10-status-conflict', run: 'git status' },
  { id: '10-cat-conflict', run: 'cat practice/hello.md' },
  { id: '10-abort', run: 'git merge --abort' },
  { id: '10-status-abort', run: 'git status' },
  { id: '10-merge-again', run: 'git merge --no-edit change-title', fails: true },
  { write: { [H]: T.hello10fixed } },
  { id: '10-add-fixed', run: 'git add practice/hello.md' },
  { id: '10-status-fixed', run: 'git status' },
  { id: '10-commit-merge', run: 'git commit --no-edit' },
  { id: '10-graph', run: 'git log --oneline --graph -6' },
  { id: '10-branch-d', run: 'git branch -d change-title' },
  { id: '10-push', run: 'git push' },
  { id: '10-status', run: 'git status' },
];
