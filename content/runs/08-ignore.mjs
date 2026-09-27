// 第8回「追跡しないもの」。.gitignore も practice/ の中に置く
import { T } from './_texts.mjs';
export default [
  { write: { 'practice/app.log': T.log8 } },
  { id: '8-status-log', run: 'git status' },
  { write: { 'practice/.gitignore': T.ignore8a } },
  { id: '8-status-ignored', run: 'git status' },
  { id: '8-check-ignore', run: 'git check-ignore -v practice/app.log' },
  { id: '8-add-ignore', run: 'git add practice/.gitignore' },
  { id: '8-commit-ignore', run: 'git commit -m "ログのファイルを追跡しないようにした"' },
  { write: { 'practice/settings.local': T.local8a } },
  { id: '8-add-local', run: 'git add practice/settings.local' },
  { id: '8-commit-local', run: 'git commit -m "手元だけの設定ファイルを足した"' },
  { write: { 'practice/.gitignore': T.ignore8b, 'practice/settings.local': T.local8b } },
  { id: '8-status-tracked', run: 'git status' },
  { id: '8-rm-cached', run: 'git rm --cached practice/settings.local' },
  { id: '8-status-rm', run: 'git status' },
  { id: '8-add-ignore2', run: 'git add practice/.gitignore' },
  { id: '8-commit-rm', run: 'git commit -m "settings.local を追跡しないようにした"' },
  { id: '8-check-local', run: 'git check-ignore -v practice/settings.local' },
  { id: '8-push', run: 'git push' },
  { id: '8-status', run: 'git status' },
];
