// 第6回「履歴をたどる」。何も変えない（読むだけ）。
// この教材の本物の履歴は、受講者のフォークでは先に進んでいる。画面の出力が誰でも同じになるよう、
// 決まったコミット（c68c135）から数える書き方だけを使う。
export default [
  { id: '6-log-3', run: 'git log -3' },
  { id: '6-log-practice', run: 'git log --oneline -- practice/' },
  { id: '6-log-p', run: 'git log -p -1 -- practice/hello.md' },
  { id: '6-log-base', run: 'git log --oneline -3 c68c135' },
  { id: '6-show-base', run: 'git show --stat --oneline c68c135' },
  { id: '6-log-file', run: 'git log --oneline -3 c68c135 -- README.md' },
  { id: '6-log-grep', run: 'git log --oneline --grep="Git-Flow" c68c135' },
];
