// 目次ページの「全体地図」に並ぶ順番。進捗は各ナビの localStorage（key）を読むだけで、書き換えない。
// total は、そのナビの「完了」画面の番号（= steps の数 - 1。OS選択がある回は OS 選択を含む）。
// read:       そのステップの直後に挟む読み物（任意。読まなくても先に進める）
// readBefore: そのステップの手前に挟む読み物（道具の正体を先に知りたい人向け）
export const steps = [
  { key: 'trainer-setup-v1',  total: 11, label: '環境構築',      href: 'setup.html',  icon: 'icon-vscode.svg',
    readBefore: { md: 'what-is-claude', label: 'そもそも Claude って何？ Claude Code とは違うの？', icon: 'icon-ai.svg' },
    read: { md: 'why-vscode', label: 'なぜ VS Code なのか？ 拡張機能って何？', icon: 'icon-vscode.svg' } },
  { key: 'trainer-git-v1', total: 11, label: 'git の基本', href: 'git.html', icon: 'icon-git.svg',
    read: { md: 'why-git', label: 'なぜ git が生まれたのか', icon: 'icon-git.svg' } },
  { key: 'trainer-github-v1', total: 8, label: 'GitHubに上げる', href: 'github.html', icon: 'icon-github.svg' },
  { key: 'trainer-diff-v1',   total: 6, label: '差分を読む',     href: 'diff.html',   icon: 'icon-terminal.svg' },
  { key: 'trainer-ai-v1',     total: 8, label: 'AIと一緒に',     href: 'ai.html',     icon: 'icon-ai.svg',
    read: { md: 'why-ai-mistakes', label: 'AIはなぜ間違えるのか', icon: 'icon-ai.svg' } },
  { key: 'trainer-code-v1',   total: 12, label: 'はじめてのプログラム', href: 'code.html',   icon: 'icon-vscode.svg' },
  { key: 'trainer-branch-v1', total: 11, label: 'ブランチと安全な進め方', href: 'branch.html', icon: 'icon-git.svg',
    read: { md: 'what-is-service', label: 'サービスって何？ GitHubを分解してみる', icon: 'icon-github.svg' } },
  { key: 'trainer-publish-v1', total: 8, label: '世界に公開する', href: 'publish.html', icon: 'icon-github.svg',
    read: { md: 'infra', label: 'インフラの世界と、その入り口', icon: 'icon-terminal.svg' } },
  { key: 'trainer-work-v1', total: 15, label: '仕事の一周（他人のコードを直す）', href: 'work.html', icon: 'icon-github.svg',
    read: { md: 'what-to-build', label: 'AIに何を作ってもらうか — 使い捨ての仕事と、残る道具', icon: 'icon-ai.svg' } },
  { key: 'trainer-theme-v1', total: 12, label: '自分のテーマで回す', href: 'theme.html', icon: 'icon-ai.svg',
    read: { md: 'what-is-ai-dlc', label: 'AI-DLCって何？ 一人でチームになる方法', icon: 'icon-ai.svg' } },
  { key: 'trainer-aidlc-v1', total: 12, label: 'AIと回す開発の一周', href: 'ai-dlc.html', icon: 'icon-ai.svg',
    read: { md: 'estimate', label: 'どれくらいで終わる？ 工数の見積もり方', icon: 'icon-terminal.svg' } },
  // ここから「案件に入る前の修行」。立場が変わるものばかり
  { key: 'trainer-review-v1',  total: 9, label: 'レビューする側になる',       href: 'review.html',  icon: 'icon-github.svg' },
  { key: 'trainer-bug-v1',     total: 7, label: '曖昧な報告から不具合を追う', href: 'bug.html',     icon: 'icon-terminal.svg' },
  { key: 'trainer-onboard-v1', total: 7, label: '大きなコードに初日で入る',   href: 'onboard.html', icon: 'icon-vscode.svg' },
  { key: 'trainer-ask-v1',     total: 8, label: '詰まったときに、人を頼る',   href: 'ask.html',     icon: 'icon-key.svg' },
  { key: 'trainer-mcp-v1',     total: 8, label: 'AIに道具を持たせる（MCP × GitHub）', href: 'mcp.html', icon: 'icon-ai.svg',
    readBefore: { md: 'what-is-claude-service', label: 'Claudeを分解してみる — AIも、ただのサービスです', icon: 'icon-ai.svg' } },
  // ここから「動くものを、良くする」
  { key: 'trainer-perf-v1',  total: 9, label: '動くけど遅い、を直す',           href: 'perf.html',  icon: 'icon-terminal.svg' },
  { key: 'trainer-tools-v1', total: 8, label: '使い捨てをやめて、道具にする',   href: 'tools.html', icon: 'icon-vscode.svg' },
  { key: 'trainer-chart-v1', total: 8, label: '数字を、目に見えるようにする',   href: 'chart.html', icon: 'icon-vscode.svg' },
  { key: 'trainer-api-v1',   total: 8, label: 'APIと、問題の切り分け',         href: 'api.html',   icon: 'icon-github.svg' },
  { key: 'trainer-observe-v1', total: 9, label: '観測する力をつける（推測しない道具）', href: 'observe.html', icon: 'icon-terminal.svg' },
  { key: 'trainer-db-v1',    total: 7, label: '保存先を変えてみる（任意）',     href: 'db.html',    icon: 'icon-folder.svg' },
  { key: 'trainer-test-v1', total: 7, label: 'テストは4段。何を守り、何を守らないか', href: 'test.html', icon: 'icon-terminal.svg' },
  { key: 'trainer-gitflow-v1', total: 16, label: 'チームのブランチ運用（Git-Flow）', href: 'gitflow.html', icon: 'icon-git.svg' }
];

// 全ステップのあとに続く「案件の準備」。手順ではなく、使う道具と入口
export const tail = [
  { md: 'graduation', label: '案件に入る前の最終チェック', icon: 'icon-key.svg',
    badge: '🎓', undone: '準備・弱いところを見つける', done: '確認した' },
  { md: 'plan', label: '案件まで1か月。何をする？（逆算プランナー）', icon: 'icon-ai.svg',
    badge: '🗓️', undone: '準備・計画を立てる', done: '計画を作った' },
  { md: 'join', label: '案件に参画する', icon: 'icon-github.svg',
    badge: '🤝', undone: '準備・相談の入口', done: '読んだ' }
];

