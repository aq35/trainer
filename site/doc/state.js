// 読み物（index.html）の状態。URL は docsify と同じ #/名前?id=見出し なので、これまでのリンクがそのまま開ける。
import { signal, computed, effect, useRoute } from 'sunao';
import { readJSON, writeJSON } from '../lib/store.js';
import { markRead } from './progress.js';

export const SITE = window.TRAINER_SITE;
const SITE_NAME = 'エンジニア育成トレーナー';

const route = useRoute();
export const where = computed(() => {
  const [path, query = ''] = route().split('?');
  const slug = decodeURIComponent(path.replace(/^\/+/, '').replace(/\.md$/, '').replace(/^README$/, ''));
  const m = /(?:^|&)id=([^&]*)/.exec(query);
  return { slug, id: m ? decodeURIComponent(m[1]) : null };
});

export const doc = signal(null);          // いま出している読み物（ビルド時に作ったデータ）
export const status = signal('loading');  // loading / ok / missing / error
export const navOpen = signal(false);     // 狭い画面での目次の開閉

const cache = {};
window.__trainerDoc = (d) => {
  cache[d.route] = d;
  if (where.peek().slug === d.route) show(d);
};

function show(d) {
  doc.set(d);
  status.set('ok');
  document.title = d.route === '' ? SITE_NAME : `${d.title} - ${SITE_NAME}`;
  markRead(d.route);
  loadChecks(d.route);
  scrollToId(where.peek().id);
}

// 見出しへ移動する。docsify の id と一字一句同じでなくても、記号を除いて一致すれば移動する
// （全角の括弧を省いて書かれたリンクが実在するため）
const loose = (s) => String(s).toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
export function scrollToId(id) {
  requestAnimationFrame(() => {
    let el = null;
    if (id) {
      el = document.getElementById(id);
      if (!el) {
        const want = loose(id);
        el = [...document.querySelectorAll('.doc [id]')].find((e) => loose(e.id) === want) || null;
      }
    }
    if (el) el.scrollIntoView();
    else window.scrollTo(0, 0);
  });
}

function load() {
  const { slug, id } = where();
  navOpen.set(false);
  // ナビ（*.html）が docsify のハッシュ経路に入ってしまった場合は、実ファイルへ戻す
  if (/\.html$/.test(slug)) { location.replace(location.pathname.replace(/[^/]*$/, '') + slug); return; }
  if (!(slug in SITE.pages)) { doc.set(null); status.set('missing'); document.title = `見つかりません - ${SITE_NAME}`; return; }
  const cur = doc.peek();
  if (cur && cur.route === slug) { scrollToId(id); return; } // 同じページの中の移動
  if (cache[slug]) { show(cache[slug]); return; }
  status.set('loading');
  const s = document.createElement('script');
  s.src = `assets/read/${slug || 'README'}.js?v=${SITE.pages[slug].v}`;
  s.onerror = () => { if (where.peek().slug === slug) status.set('error'); s.remove(); };
  document.head.appendChild(s);
}
effect(load);

// ---- チェックリスト（- [ ] の行）。ページごとに保存先を分ける ----
export const checks = signal({});
let checkKey = '';
function loadChecks(slug) {
  // 最終チェックのページは、以前の保存先（trainer-step2-check）をそのまま使う
  checkKey = slug === 'step2-git' || slug === '' ? 'trainer-step2-check' : 'trainer-check-' + slug;
  checks.set(readJSON(checkKey, {}));
}
export function setCheck(i, on) {
  const m = { ...checks.peek(), [i]: on };
  checks.set(m);
  writeJSON(checkKey, m);
}

// ---- タブ（Windows / Mac）。一度選んだほうを、どのページでも先に出す ----
export const tabPref = signal(readJSON('trainer-tab', null));
export function chooseTab(label) { tabPref.set(label); writeJSON('trainer-tab', label); }

// ---- 検索。最初に検索欄を触ったときだけ、索引を読み込む ----
export const query = signal('');
export const index = signal(null);
let asked = false;
window.__trainerSearch = (d) => index.set(d);
export function loadSearch() {
  if (asked) return;
  asked = true;
  const s = document.createElement('script');
  s.src = SITE.search;
  document.head.appendChild(s);
}
export const results = computed(() => {
  const q = query().trim().toLowerCase();
  const idx = index();
  if (!q || !idx) return [];
  const words = q.split(/\s+/);
  const out = [];
  for (const s of idx) {
    const hay = (s.h + ' ' + s.x).toLowerCase();
    if (!words.every((w) => hay.indexOf(w) >= 0)) continue;
    const at = s.x.toLowerCase().indexOf(words[0]);
    const from = Math.max(0, at - 30);
    const snip = at < 0 ? s.x.slice(0, 80) : (from ? '…' : '') + s.x.slice(from, at + 60) + '…';
    out.push({ key: s.r + '#' + s.id, href: '#/' + s.r + (s.id ? '?id=' + encodeURIComponent(s.id) : ''), page: s.p, head: s.h, snip });
    if (out.length >= 30) break;
  }
  return out;
});
