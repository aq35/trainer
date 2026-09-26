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

export function stamp(d = new Date()) {
  const z = (n) => (n < 10 ? '0' : '') + n;
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}`;
}
