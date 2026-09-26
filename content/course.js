// 目次ページの「全体地図」に並ぶ順番（全10回）。進捗は各回の localStorage（key）を読むだけで、書き換えない。
// total は、その回の「完了」画面の番号（= steps の数 - 1。OS 選択がある回は OS 選択を含む）。ずれるとビルドが止まる。
// soon: true の回は、まだ書いていない（地図には「準備中」と出る）。
export const steps = [
  { key: 'trainer-v2-01', total: 8, label: '第1回 道具をそろえる', href: '01-tools.html', icon: 'icon-vscode.svg' },
  { key: 'trainer-v2-02', total: 10, label: '第2回 フォークして手元に持ってくる', href: '02-fork.html', icon: 'icon-github.svg',
    read: { md: 'why-git', label: 'なぜ Git が生まれたのか', icon: 'icon-git.svg' } },
  { key: 'trainer-v2-03', total: 8, label: '第3回 最初のコミット', href: '03-first-commit.html', icon: 'icon-git.svg',
    read: { md: 'git-research', label: 'Git を調べるコツ — AI と Git 自身を、両方使う', icon: 'icon-ai.svg' } },
  { key: 'trainer-v2-04', total: 0, label: '第4回 ステージングエリア', href: '04-staging.html', icon: 'icon-git.svg', soon: true },
  { key: 'trainer-v2-05', total: 0, label: '第5回 差分を読む', href: '05-diff.html', icon: 'icon-git.svg', soon: true },
  { key: 'trainer-v2-06', total: 0, label: '第6回 履歴をたどる', href: '06-log.html', icon: 'icon-git.svg', soon: true },
  { key: 'trainer-v2-07', total: 0, label: '第7回 取り消す', href: '07-undo.html', icon: 'icon-git.svg', soon: true },
  { key: 'trainer-v2-08', total: 0, label: '第8回 追跡しないもの', href: '08-ignore.html', icon: 'icon-git.svg', soon: true },
  { key: 'trainer-v2-09', total: 0, label: '第9回 ブランチとマージ', href: '09-branch.html', icon: 'icon-git.svg', soon: true },
  { key: 'trainer-v2-10', total: 0, label: '第10回 コンフリクト', href: '10-conflict.html', icon: 'icon-git.svg', soon: true },
];

// 全部の回のあとに続く読み物（いまは無し）
export const tail = [];
