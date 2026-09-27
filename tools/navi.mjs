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

// 根拠リンク [[名前, URL], ...] を検査して返す
// pre を OS ごとに取り出す（配列ならどの OS でも同じ）
function preFor(pre, os) {
  if (!pre) return null;
  if (Array.isArray(pre)) return pre;
  return pre.common || pre[os] || null;
}

function refsOf(ref, where) {
  if (!ref) return [];
  if (!Array.isArray(ref) || ref.some((r) => !Array.isArray(r) || r.length !== 2 || !/^https:\/\//.test(r[1]))) {
    throw new Error(`${where}: ref は [['名前', 'https://…'], …] の形で書いてください`);
  }
  return ref.map(([label, url]) => ({ label, url }));
}

// 使わない言葉（content/terms.js）が文字列に入っていないか
function checkTerms(value, banned, where) {
  const walk = (v, path) => {
    if (typeof v === 'string') {
      for (const b of banned) if (v.includes(b.word)) throw new Error(`${where}${path}: 「${b.word}」は使いません。${b.use}（${b.why}）`);
    } else if (Array.isArray(v)) v.forEach((x, k) => walk(x, `${path}[${k}]`));
    else if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], `${path}.${k}`);
  };
  walk(value, '');
}

export function buildNavi(name, mod, { firstAid, recorded = null, banned = [] }) {
  const nav = mod.default;
  const where = `content/navi/${name}.js`;
  checkTerms(nav, banned, where);
  // 実際に打って得た出力（tools/record.mjs）。{{FORK}} は受講者のフォークの URL に戻す
  const FORK_URL = 'https://github.com/あなたのユーザー名/trainer.git';
  const outOf = (ids, at, shown) => [].concat(ids || []).map((id) => {
    const r = recorded && recorded.outputs[id];
    if (!r) throw new Error(`${where} ${at}: out「${id}」の出力がありません。content/runs/ の台本に書いて、node tools/record.mjs を打ってください`);
    const cmd = r.cmd.split('{{FORK}}').join(FORK_URL);
    // 画面で打たせるコマンドと、出力を得たコマンドが同じであること（違う出力を載せない）
    if (!shown.includes(cmd)) throw new Error(`${where} ${at}: out「${id}」は「${cmd}」の出力ですが、この画面ではそのコマンドを打たせていません`);
    return { cmd, out: r.out.split('{{FORK}}').join(FORK_URL), replaced: r.cmd.includes('{{FORK}}') || r.out.includes('{{FORK}}') };
  });
  // 本文に書いたコミットの番号（英数字7文字）が、その画面の出力に本当に出ていること
  const checkHashes = (outs, s, at) => {
    const text = strip([s.after, s.expect, s.note].join(' '));
    const shown = outs.map((o) => o.out).join('\n');
    for (const h of text.match(/\b[0-9a-f]{7}\b/g) || []) {
      if (!shown.includes(h)) throw new Error(`${where} ${at}: 本文の「${h}」が、この画面の出力にありません（出力を撮り直したら、本文の番号も直してください）`);
    }
    return outs;
  };
  const areasOf = (id, at) => {
    if (!id) return null;
    const a = recorded && recorded.areas[id];
    if (!a) throw new Error(`${where} ${at}: areas「${id}」の記録がありません`);
    return { id, ...a };
  };
  // ブラウザでの練習（ダミーの環境）で、打つ順に [{ cmd, out, fork }]。
  // 答えは記録した出力だけ。1つでも記録が無いコマンドがあれば false（その回はブラウザで練習できない）
  const webOf = (s, at) => {
    if (s.textBox || !(s.cmd || s.cmdMulti)) return null;
    if (s.cmdMulti && !s.cmdMulti.common) return false; // OS で打つものが違う画面は、ダミーでは再現しない
    const outs = outOf(s.out, at, [].concat(s.cmd || [], (s.cmdMulti && s.cmdMulti.common) || []));
    const list = [];
    for (const c of [].concat(s.cmd || [], (s.cmdMulti && s.cmdMulti.common) || [])) {
      const o = outs.find((x) => x.cmd === c);
      if (!o) return false;
      list.push({ cmd: c, out: o.out, fork: c.includes(FORK_URL) });
    }
    return list;
  };
  const R = (html, at) => (html == null ? null : parseHtml(html, { profile: 'inline', where: `${where} ${at}` }));
  const qa = (it, at) => ({ os: it.os || null, q: R(it.q, at + '.q'), a: R(it.a, at + '.a'), qText: strip(it.q), find: textOf(R(it.q, at) .concat(' ', R(it.a, at))).toLowerCase() });
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
        deepen: s.deepen || null, deepenWhy: R(s.deepenWhy, at), ref: refsOf(s.ref, `${where} ${at}`),
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
    // コマンドを打たせる画面は、打つ前の説明（1行ずつ）・打った後の説明・根拠がそろっていること
    const variants = s.cmdMulti ? osList(s.cmdMulti).map((k) => s.cmdMulti[k]) : [[]];
    const shownCmds = [...new Set([].concat(s.cmd || [], ...variants))];
    if (s.cmd || s.cmdMulti) {
      if (s.textBox !== true) {
        // pre は配列（どの OS でも同じ）か、cmdMulti と同じく { win, mac } / { common }
        for (const k of s.cmdMulti ? osList(s.cmdMulti) : ['common']) {
          const lines = (s.cmdMulti ? s.cmdMulti[k].length : 0) + (s.cmd ? 1 : 0);
          const p = preFor(s.pre, k);
          if (!p || p.length !== lines) throw new Error(`${where} ${at}: コマンドが ${lines} 行あるので、pre（打つ前に、1行ずつの説明）も ${lines} 個要ります（いま ${p ? p.length : 0} 個）`);
          p.forEach(([dt], n) => {
            const c = (s.cmdMulti ? s.cmdMulti[k] : []).concat(s.cmd || [])[n];
            if (dt !== c) throw new Error(`${where} ${at}: pre の ${n + 1} 行目「${dt}」は、打たせるコマンド「${c}」と同じ文字にしてください`);
          });
        }
        if (!s.after) throw new Error(`${where} ${at}: コマンドを打つ画面には after（いま、何が起きたのか）が要ります`);
      }
      if (!s.ref && s.textBox !== true) throw new Error(`${where} ${at}: コマンドを打つ画面には ref（根拠のリンク）が要ります`);
    }
    return {
      ...out,
      phase: R(s.phase, at), icon: s.icon || null, title: R(s.title, at), titleText: strip(s.title),
      why: R(s.why, at), skip: R(s.skip, at), todo,
      visual: s.visual || null, visualAlt: s.visualAlt || null, visual2: s.visual2 || null, visual2Alt: s.visual2Alt || null,
      pre: s.pre ? Object.fromEntries((Array.isArray(s.pre) ? ['common'] : osList(s.pre)).map((k) => [k, preFor(s.pre, k)
        .map((p, n) => ({ dt: R(p[0], `${at}.pre.${k}[${n}]`), dd: R(p[1], `${at}.pre.${k}[${n}]`) }))])) : null,
      cmd: s.cmd || null, cmdlabel: R(s.cmdlabel, at),
      cmdMulti: s.cmdMulti ? Object.fromEntries(osList(s.cmdMulti).map((k) => [k, s.cmdMulti[k]])) : null,
      expect: R(s.expect, at), expectText: strip(s.expect), after: R(s.after, at), note: R(s.note, at),
      ask: R(s.ask, at), askText: strip(s.ask),
      tb: (s.tb || []).map((t, k) => qa(t, `${at}.tb[${k}]`)),
      help,
      out: checkHashes(outOf(s.out, at, shownCmds), s, at),
      web: webOf(s, at),
      areas: areasOf(s.areas, at),
      // ref は配列か、OS ごとの { common, win, mac }（common は両方に出す）
      ref: Array.isArray(s.ref) || !s.ref ? refsOf(s.ref, `${where} ${at}`)
        : Object.fromEntries(['win', 'mac'].map((k) => [k, refsOf([...(s.ref.common || []), ...(s.ref[k] || [])], `${where} ${at}.ref.${k}`)])),
    };
  });

  // ブラウザで練習できる回か（コマンドを打つ画面が全部、記録した出力で答えられるとき）
  const web = steps.every((st, i) => st.web !== false || nav.steps[i].textBox);
  for (const st of steps) if (st.web === false) st.web = null;
  return { name, title: mod.title, git: recorded ? recorded.git : null, key: nav.key, greeting: R(nav.greeting, 'greeting'), needsOs, web, common, steps };
}
