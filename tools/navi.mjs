// ナビ 1 本（content/navi/*.js）→ 画面に渡すデータ（ビルド時だけ使う）。
//
// 文字列の HTML は構造データに変え、「うまくいきません」でどの項目を出すかも、ここで決めておく。
// どれもステップの中身だけで決まるので、ブラウザで毎回計算する必要がない
// （ビルド時に決めれば、テストで確かめられる）。
import { parseHtml, textOf } from './html.mjs';

const strip = (h) => String(h ?? '').replace(/<[^>]*>/g, '');

// 枠の中身が「ターミナルに打つ命令」かどうか。同じ枠を、貼り付ける文章にも使っている。
const TERM = /^\s*(git|gh|code|npm|npx|node|python3?|pip3?|brew|winget|mkdir|touch|cd|ls|dir|echo|curl|New-Item|xcode-select)\b/;
const isTerm = (t) => TERM.test(String(t).split('\n')[0]);
// 手順データの行頭に全角スペースがあれば「前の行のぶら下げ」とみなす（番号を振らない）
const isSubLine = (line) => /^[　 ]/.test(strip(line));

function pick(o, os) {
  if (!o) return null;
  if (o.common) return o.common;
  return os === 'mac' ? o.mac : o.win;
}

// そのステップで実際にやることを見て、関係のある助けだけを出すためのフラグ
export function contextOf(s, os) {
  // 判定は「受講者が実際にやること」＝手順を中心に見る。
  // 説明文まで見ると「保存は不要です」のような文まで拾ってしまう。
  const raw = (pick(s.todo, os) || []).join(' ');
  const todo = strip(raw);
  const boxes = (s.cmd ? [s.cmd] : []).concat(pick(s.cmdMulti, os) || []);
  const inline = [];
  raw.replace(/<code>([\s\S]*?)<\/code>/g, (_, c) => { inline.push(strip(c)); return ''; });
  const ctx = {
    cmd: boxes.some(isTerm) || inline.some(isTerm),
    paste: boxes.some((t) => !isTerm(t)),
    save: /保存/.test(todo),
    reload: /再読み込み/.test(todo),
    // 手順が「覚えること」の箇条書きの回は readonly:true を付ける
    act: !s.readonly && !!(raw || boxes.length),
    _text: strip([s.title, s.why, s.expect, s.note, s.ask, raw].join(' ')),
  };
  ctx.wait = ctx.act && /インストール|Install|ダウンロード|Download|反映|同期|公開されます/.test(ctx._text);
  ctx.ui = ctx.act && !ctx.cmd && !ctx.paste && !ctx.save && /押し|クリック|選び|選択|ボタン|メニュー|タブ|チェック|入力|開きます/.test(todo);
  ctx.gui = ctx.act && !ctx.cmd && !ctx.paste;
  return ctx;
}

// when は ctx のフラグ名か、ステップ本文に含まれる語。配列なら「すべて満たすとき」。
export function applies(item, ctx) {
  if (!item.when) return true;
  return [].concat(item.when).every((w) => (w.charAt(0) !== '_' && w in ctx ? !!ctx[w] : ctx._text.indexOf(w) >= 0));
}

export function buildNavi(name, mod, { firstAid }) {
  const nav = mod.default;
  const where = `content/navi/${name}.js`;
  const R = (html, at) => (html == null ? null : parseHtml(html, { profile: 'inline', where: `${where} ${at}` }));
  const qa = (it, at) => ({ q: R(it.q, at + '.q'), a: R(it.a, at + '.a'), qText: strip(it.q), find: textOf(R(it.q, at) .concat(' ', R(it.a, at))).toLowerCase() });
  const osList = (o) => (o ? (o.common ? ['common'] : ['win', 'mac']) : []);
  const needsOs = nav.steps.some((s) => s.kind === 'os');

  const common = (nav.common || []).map((c, i) => qa(c, `common[${i}]`));
  const steps = nav.steps.map((s, i) => {
    const at = `${i + 1}画面目`;
    const out = { kind: s.kind || 'step' };
    if (s.kind === 'os') {
      return { ...out, phase: R(s.phase, at), title: R(s.title, at), why: R(s.why, at) };
    }
    if (s.kind === 'fin') {
      return {
        ...out,
        title: R(s.title, at), lead: R(s.lead, at), gained: R(s.gained, at),
        criteria: s.criteria ? s.criteria.map((c, k) => R(c, `${at}.criteria[${k}]`)) : null,
        transfer: R(s.transfer, at), note: R(s.note, at),
        readNext: s.readNext ? { md: s.readNext.md, label: R(s.readNext.label, at), sub: R(s.readNext.sub, at) } : null,
        nextHref: s.nextHref, nextLabel: R(s.nextLabel, at),
      };
    }
    const todo = s.todo ? Object.fromEntries(osList(s.todo).map((k) => [k, s.todo[k].map((line, n) => ({
      sub: isSubLine(line), n: R(line, `${at}.todo.${k}[${n}]`), text: strip(line).replace(/^[　 ]+/, ''),
    }))])) : null;
    // 「うまくいきません」の中身（OSで手順が違う回は、OSごとに決める）
    const own = new Set((s.tb || []).map((t) => t.q));
    const helpFor = (os) => {
      const ctx = contextOf(s, os);
      return {
        aid: firstAid.map((a, k) => (applies(a, ctx) ? k : -1)).filter((k) => k >= 0).slice(0, 3),
        gen: (nav.common || []).map((c, k) => (!own.has(c.q) && applies(c, ctx) ? k : -1)).filter((k) => k >= 0),
      };
    };
    const help = { win: helpFor('win') };
    if (needsOs) help.mac = helpFor('mac');
    return {
      ...out,
      phase: R(s.phase, at), icon: s.icon || null, title: R(s.title, at), titleText: strip(s.title),
      why: R(s.why, at), skip: R(s.skip, at), todo,
      visual: s.visual || null, visualAlt: s.visualAlt || null, visual2: s.visual2 || null, visual2Alt: s.visual2Alt || null,
      pre: s.pre ? s.pre.map((p, k) => ({ dt: R(p[0], `${at}.pre[${k}]`), dd: R(p[1], `${at}.pre[${k}]`) })) : null,
      cmd: s.cmd || null, cmdlabel: R(s.cmdlabel, at),
      cmdMulti: s.cmdMulti ? Object.fromEntries(osList(s.cmdMulti).map((k) => [k, s.cmdMulti[k]])) : null,
      expect: R(s.expect, at), expectText: strip(s.expect), after: R(s.after, at), note: R(s.note, at),
      ask: R(s.ask, at), askText: strip(s.ask),
      tb: (s.tb || []).map((t, k) => qa(t, `${at}.tb[${k}]`)),
      help,
    };
  });

  return { name, title: mod.title, key: nav.key, greeting: R(nav.greeting, 'greeting'), needsOs, common, steps };
}
