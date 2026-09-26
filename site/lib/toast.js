// 画面下に一瞬だけ出す知らせ（「コピーしました」など）。どの部品からでも呼べる。
import { signal } from 'sunao';

export const toastText = signal('');
export const toastOn = signal(false);
let timer = 0;

export function toast(msg, ms = 1600) {
  toastText.set(msg);
  toastOn.set(true);
  clearTimeout(timer);
  timer = setTimeout(() => toastOn.set(false), ms);
}

// クリップボードに入れる。使えない環境（http・古いブラウザ）では textarea 経由で試す。
export function copy(text, msg = 'コピーしました') {
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast(msg); } catch (e) { toast('コピーできませんでした'); }
    document.body.removeChild(ta);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => toast(msg), fallback);
  else fallback();
}
