// 詰まったときの連絡先（content/config.js で運営側が設定する）。
import { support } from '../../content/config.js';

let warned = false;
export function contact() {
  const s = support || {};
  if (!s.name && !s.channel) {
    // 受講者に開発者向けの指示を見せない。運営には開発者ツールで知らせる。
    if (!warned && typeof console !== 'undefined') {
      warned = true;
      console.warn('[trainer] サポート窓口が未設定です。content/config.js の support に、担当者名・チャンネル・URL を記入してください。');
    }
    return null;
  }
  return { name: s.name || 'サポート窓口', channel: s.channel || '', url: s.url || '', note: s.note || '' };
}

// 文章に入れる連絡先の1行
export function contactLine() {
  const c = contact();
  if (!c) return '連絡先は、この研修を案内してくれた人に聞いてください。';
  return '送り先: ' + (c.channel ? `${c.name}（${c.channel}）` : c.name);
}

// 進捗報告を GitHub の Issue にできるか（連絡先が github.com/owner/repo のとき）
export function issueRepo() {
  const c = support || {};
  if (c.repo) return c.repo;
  const m = /github\.com\/([^/]+\/[^/]+)/.exec(c.url || '');
  return m ? m[1] : '';
}
