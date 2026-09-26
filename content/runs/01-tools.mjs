// 第1回「道具をそろえる」で打つコマンド。教材の画面には、ここで得た出力を載せる。
// 名前とメールは例。メールは GitHub が用意する noreply の形（ID+ユーザー名@users.noreply.github.com）
export default [
  { id: 'version', run: 'git --version' },
  { run: 'git config --global user.name "山田 花子"' },
  { run: 'git config --global user.email "12345678+hanako@users.noreply.github.com"' },
  { id: 'config-name', run: 'git config --global user.name' },
  { id: 'config-email', run: 'git config --global user.email' },
];
