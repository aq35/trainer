// localStorage の読み書き。シークレットウィンドウや容量切れでも落ちないよう、失敗は黙って諦める。
export function readJSON(key, fallback = {}) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || 'null');
    return v == null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}
export function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* 保存できなくても進められる */ }
}
export function remove(key) {
  try { localStorage.removeItem(key); } catch (e) { /* 同上 */ }
}
