// 目次の「全体地図」の進み具合。
// 進捗は各ナビと同じ localStorage を読むだけで、書き換えない。読み物だけは「開いたか」をここで記録する。
import { steps, tail } from '../../content/course.js';
import { readJSON, writeJSON } from '../lib/store.js';

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
