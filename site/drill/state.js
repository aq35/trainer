// コマンド練習の状態。画面（menu / ask / done）と、いま解いている問題の並び。
import { signal } from 'sunao';
import { readJSON, writeJSON } from '../lib/store.js';

const KEY = 'trainer-drill-v1';
export const data = window.TRAINER_DRILL;

export const mode = signal('menu');
export const pos = signal(0);        // 何問目か（list の添字）
export const qid = signal(0);        // 出題のたびに増える番号（画面を作り直す合図）
export let list = [];                // 出題する問題
export let cat = 'all';
export let ok = 0;
export let wrong = [];

export const records = () => readJSON(KEY, {});
export const catLabel = (id) => (data.categories.find((c) => c.id === id) || { label: id }).label;
export const countOf = (id) => data.questions.filter((q) => id === 'all' || q.cat === id).length;

function begin(qs) {
  list = qs;
  ok = 0;
  wrong = [];
  pos.set(0);
  qid.set(qid.peek() + 1);
  mode.set('ask');
  window.scrollTo(0, 0);
}
export function start(id) {
  cat = id;
  begin(data.questions.filter((q) => id === 'all' || q.cat === id));
}
export function retryWrong() { if (wrong.length) begin(wrong.slice()); }
export function menu() { mode.set('menu'); }

// 答え合わせ。入力は大文字小文字・引用符の種類・前後や連続の空白を気にしない
const norm = (s) => String(s).trim().toLowerCase().replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ');
export function judge(q, val) {
  const correct = q.type === 'choice' ? val === q.answer : q.expect.some((e) => norm(e) === norm(val));
  if (correct) ok++; else wrong.push(q);
  return correct;
}
export function next() {
  if (pos.peek() + 1 < list.length) { pos.set(pos.peek() + 1); qid.set(qid.peek() + 1); window.scrollTo(0, 0); return; }
  // 終わり: この分野のベストを残す
  const rec = records();
  rec[cat] = Math.max(rec[cat] || 0, Math.round((ok / list.length) * 100));
  writeJSON(KEY, rec);
  mode.set('done');
}
