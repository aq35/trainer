// 第2回「フォークして手元に持ってくる」。{{FORK}} は受講者のフォークの URL（手元では、見立てたリポジトリ）
export default [
  { cd: '~' },
  { id: 'cd-home', run: 'cd ~' },
  { id: 'clone', run: 'git clone {{FORK}}' },
  { cd: 'trainer' },
  { id: 'status-clean', run: 'git status' },
  { id: 'log-5', run: 'git log --oneline -5' },
  { id: 'remote', run: 'git remote -v' },
];
