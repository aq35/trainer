// 目次の「全体地図」と、進捗・参画の報告文。
// 進捗は各ナビと同じ localStorage を読むだけで、書き換えない。読み物だけは「開いたか」をここで記録する。
import { steps, tail } from '../../content/course.js';
import { readJSON, writeJSON, stamp } from '../lib/store.js';
import { issueRepo } from '../lib/support.js';

export const READ_KEY = 'trainer-read-v1';
export { steps, tail };

export function readings() {
  const out = [];
  for (const s of steps) {
    if (s.readBefore) out.push(s.readBefore);
    if (s.read) out.push(s.read);
  }
  return out.concat(tail);
}

// 読み物のページを開いたら「読んだ」として記録する
export function markRead(slug) {
  if (!readings().some((r) => r.md === slug)) return;
  const done = readJSON(READ_KEY, {});
  if (done[slug]) return;
  done[slug] = true;
  writeJSON(READ_KEY, done);
}
export const readDone = () => readJSON(READ_KEY, {});

// 1本のナビの進み具合
export function stateOf(s) {
  const v = readJSON(s.key, {});
  if (typeof v.i !== 'number' || v.i === 0) return { pct: 0, txt: 'これから' };
  if (v.i >= s.total) return { pct: 100, txt: '完了' };
  return { pct: Math.round((v.i / s.total) * 100), txt: v.i + ' / ' + s.total };
}

function checklist(lines) {
  let done = 0;
  steps.forEach((s, i) => {
    const st = stateOf(s);
    if (st.pct >= 100) done++;
    lines.push('- [' + (st.pct >= 100 ? 'x' : ' ') + '] ' + (i + 1) + '. ' + s.label + ' — ' + st.txt);
  });
  return done;
}

export function reportText() {
  const lines = ['いまの進捗', ''];
  const done = checklist(lines);
  const rdone = readDone();
  const rs = readings().filter((r) => !r.badge);
  lines.push('', '読み物（任意）: ' + rs.filter((r) => rdone[r.md]).length + ' / ' + rs.length + ' 読了');
  for (const t of tail) if (rdone[t.md]) lines.push(t.label + ': ' + (t.done || '済'));
  lines.push('', '報告日時: ' + stamp(), '', '困っていること・聞きたいことがあれば、ここに書いてください（空のままでも大丈夫です）。');
  return { text: lines.join('\n'), done };
}

export function joinText() {
  const lines = ['参画の準備ができました', '', '研修を終えたので、案件への参画を相談させてください。', '', '### 到達状況（自動）', ''];
  const done = checklist(lines);
  const rdone = readDone();
  for (const t of tail) if (rdone[t.md]) lines.push('', t.label + ': ' + (t.done || '済'));
  lines.push('', '報告日時: ' + stamp(), '',
    '### 見てもらえる成果物', '', '- 公開ページ: ', '- 練習リポジトリのPR一覧: ', '- 自分のテーマのリポジトリ: ', '',
    '### いま自信が無いところ（正直に）', '', '- ', '',
    '### 希望・相談したいこと', '', '- 働ける時間帯や開始時期など、あれば書いてください');
  return { text: lines.join('\n'), done };
}

// 連絡先が GitHub のリポジトリなら、中身を入れた状態で Issue を開ける
function issueUrl(label, title, text) {
  const r = issueRepo();
  if (!r) return '';
  return 'https://github.com/' + r + '/issues/new?labels=' + encodeURIComponent(label) +
    '&title=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(text);
}
export function reportUrl() {
  const t = reportText();
  return issueUrl('進捗', '[進捗] ' + t.done + ' / ' + steps.length + ' まで進みました', t.text);
}
export function joinUrl() {
  const t = joinText();
  return issueUrl('参画', '[参画] 準備ができました（' + t.done + ' / ' + steps.length + ' 完了）', t.text);
}
