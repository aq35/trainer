// 第3回「最初のコミット」。practice/ の中だけを触る
export default [
  { write: { 'practice/hello.md': '# はじめての Git\n\nこのファイルは、Git の練習のために作りました。\n' } },
  { areas: 'a3-untracked', paths: ['practice/hello.md'] },
  { id: 'status-untracked', run: 'git status' },
  { id: 'add', run: 'git add practice/hello.md' },
  { areas: 'a3-staged', paths: ['practice/hello.md'] },
  { id: 'status-staged', run: 'git status' },
  { id: 'commit', run: 'git commit -m "練習用のファイルを作った"' },
  { areas: 'a3-committed', paths: ['practice/hello.md'] },
  { id: 'log-3', run: 'git log --oneline -3' },
  { id: 'status-ahead', run: 'git status' },
  { id: 'push', run: 'git push' },
  { id: 'status-pushed', run: 'git status' },
];
