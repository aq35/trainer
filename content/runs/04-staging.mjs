// 第4回「ステージングエリア」。practice/ の中だけを触る
import { T } from './_texts.mjs';
const H = 'practice/hello.md', D = 'practice/todo.md';
export default [
  { write: { [H]: T.hello4a } },
  { areas: 'a4-modified', paths: [H] },
  { id: '4-status-modified', run: 'git status' },
  { id: '4-add', run: 'git add practice/hello.md' },
  { id: '4-status-staged', run: 'git status' },
  { areas: 'a4-staged', paths: [H] },
  { write: { [H]: T.hello4b } },
  { areas: 'a4-both', paths: [H] },
  { id: '4-status-both', run: 'git status' },
  { id: '4-add-again', run: 'git add practice/hello.md' },
  { id: '4-status-staged-again', run: 'git status' },
  { areas: 'a4-staged-again', paths: [H] },
  { write: { [D]: T.todo4 } },
  { id: '4-add-todo', run: 'git add practice/todo.md' },
  { id: '4-status-two', run: 'git status' },
  { areas: 'a4-two', paths: [H, D] },
  { id: '4-restore-staged', run: 'git restore --staged practice/todo.md' },
  { id: '4-status-unstaged', run: 'git status' },
  { areas: 'a4-unstaged', paths: [H, D] },
  { id: '4-commit', run: 'git commit -m "hello.md に2行足した"' },
  { id: '4-status-end', run: 'git status' },
  { areas: 'a4-end', paths: [H, D] },
];
