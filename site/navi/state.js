// 1画面1操作のナビの状態。どの部品からも import して使う（props で回さない）。
// 画面のデータ（window.TRAINER_PAGE）は tools/navi.mjs がビルド時に作って HTML に埋め込む。
import { signal, computed } from 'sunao';
import { readJSON, writeJSON, remove } from '../lib/store.js';
import { copy } from '../lib/toast.js';

export const page = window.TRAINER_PAGE;
const STEPS = page.steps;

// 練習する場所。'pc'（自分のパソコン）か 'web'（ブラウザの中のダミーの環境）。どの回でも同じ設定を使う。
// ブラウザでの進み具合は、自分のパソコンでの進み具合（目次の地図に出る）とは別に保存する。
const MODE_KEY = 'trainer-mode';
export const web = !!page.web && readJSON(MODE_KEY, {}).mode === 'web';
export function setMode(m) {
  writeJSON(MODE_KEY, { mode: m });
  location.reload();
}
const KEY = web ? page.key + ':web' : page.key;

const saved = readJSON(KEY, {});
export const os = signal(saved && typeof saved.i === 'number' ? saved.os || null : null);
export const idx = signal(saved && typeof saved.i === 'number' && saved.i < STEPS.length ? saved.i : 0);

function save() { writeJSON(KEY, { os: os.peek(), i: idx.peek() }); }

// #restart（または ?restart）付きで開かれたら、最初の画面から始める。
// 毎週まわす回（loop.html）は完了画面から自分自身へ戻るため、
// これが無いと完了画面に着き続けて、もう一周できない。
// ハッシュを使うのは、サーバーの都合でクエリが落ちることがあるため。
// 一度読んだらURLから消す（途中で再読み込みしても位置を失わないように）。
if (location.hash.indexOf('restart') >= 0 || location.search.indexOf('restart') >= 0) {
  idx.set(0);
  save(); // 保存し直さないと、再読み込みで完了画面に戻ってしまう
  remove(KEY + ':t');
  try { history.replaceState(null, '', location.pathname); } catch (e) { /* 古いブラウザ */ }
}
if (idx.peek() > 0 && page.needsOs && !os.peek()) idx.set(0);

export const step = computed(() => STEPS[idx()]);
export const total = STEPS.length - 1;
export const osName = () => (os() === 'mac' ? 'Mac' : 'Windows');
export function pick(o) {
  if (!o) return null;
  if (o.common) return o.common;
  return os() === 'mac' ? o.mac : o.win;
}

// 「うまくいきません」の開閉と、受講者が開いて確認した項目（相談文に添える）
export const helpOpen = signal(false);
export let tried = [];
export function noteTried(q) { if (tried.indexOf(q) < 0) tried.push(q); }

// ---- 同じステップに長くとどまっている人に、こちらから声をかける ----
export const STUCK_MIN = 15; // これだけ同じステップにいたら声をかける
const AWAY_MIN = 10;         // これだけ間隔が空いたら「離席していた」とみなして測り直す
const readT = () => readJSON(KEY + ':t', {});
const writeT = (m) => writeJSON(KEY + ':t', m);

// いまのステップに「まだ居る」ことを記録し、滞在の開始時刻を返す。
// 前回の記録から離れていたら、寝ていた時間を数えないように測り直す。
export function touchStep() {
  const m = readT(), i = idx.peek(), now = Date.now();
  let e = m[i];
  if (!e || typeof e !== 'object' || !e.seen || now - e.seen > AWAY_MIN * 60000) e = { start: now, seen: now };
  else e.seen = now;
  m[i] = e;
  writeT(m);
  return e.start;
}
export function minutesHere() { return Math.floor((Date.now() - touchStep()) / 60000); }
// ステップを離れたら計測を捨てる。次に来たときは 0 から数え直す。
export function clearStep(i) { const m = readT(); delete m[i]; writeT(m); }

function moveTo(n) {
  if (n < 0) n = 0;
  if (n > STEPS.length - 1) n = STEPS.length - 1;
  if (n !== idx.peek()) { clearStep(idx.peek()); tried = []; } // 離れたステップの計測と記録は持ち越さない
  helpOpen.set(false);
  idx.set(n);
  save();
  window.scrollTo(0, 0);
}
export function move(delta) { moveTo(idx.peek() + delta); }
export function chooseOs(v) { os.set(v); moveTo(1); }
export function reset() {
  if (!confirm('最初からやり直しますか？')) return;
  writeT({});
  tried = [];
  os.set(null);
  moveTo(0);
}

// ---- 相談用の文章 ----
export function aiPrompt() {
  const s = step.peek();
  const todo = pick(s.todo);
  const lines = [
    'Git の初心者です。Git の教材の途中で詰まっています。',
    '専門用語はできるだけ避けて、次にやることを1つだけ教えてください。',
    '',
    '【やろうとしていること】',
    s.titleText,
    '',
    '【手順】',
  ];
  // 画面と同じく、ぶら下げ行には番号を振らない（AIに渡す文章でも手順数を狂わせないため）
  if (todo) {
    let no = 0;
    for (const t of todo) lines.push(t.sub ? '    ' + t.text : ++no + '. ' + t.text);
  } else lines.push('（画面の指示にしたがって操作中）');
  lines.push('', '【本来こうなるはず】', s.expectText || s.askText, '', '【実際に起きたこと】',
    '（ここに書いてください。エラーが出ていれば、全文をそのまま貼り付けてください）', '',
    '【いまの状態】（ターミナルで git status を打ち、出てきたものを全部貼ってください。フォルダの外にいるときは、そう書いてください）',
    '（ここに貼る）', '',
    '【環境】' + (page.needsOs ? osName() : 'Windows または Mac') + ' / VS Code', '',
    '消えてしまう変更がある操作を勧めるときは、先にそう言ってください。');
  copy(lines.join('\n'), 'コピーしました。Claude Code に貼って、〈実際に起きたこと〉だけ書き足してください。');
}
