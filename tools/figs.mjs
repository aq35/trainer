// 実行記録から、図を機械で描く（design/curriculum.md 3.3 の 2 番）。
// 手で描かないので、図と、同じ画面に載せた出力が食い違わない。
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const MARK = ['', '①', '②', '③', '④', '⑤'];

// 作業ディレクトリ・ステージングエリア・リポジトリ（最新のコミット）に、ファイルのどの中身があるか。
// 同じ番号は同じ中身。「なし」は、その場所にそのファイルが無いこと。
export function areasSvg(a) {
  const cols = [
    { key: 'work', title: '作業ディレクトリ', sub: 'いま編集しているファイル' },
    { key: 'stage', title: 'ステージングエリア', sub: '次のコミットに入れるもの' },
    { key: 'repo', title: 'リポジトリ', sub: '最新のコミット' },
  ];
  const W = 720, colW = 200, gap = 40, x0 = 20, top = 64, rowH = 54;
  const bottom = top + a.rows.length * rowH;
  const H = bottom + 30;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="sans-serif">`;
  s += `<rect width="${W}" height="${H}" fill="#fff"/>`;
  cols.forEach((c, k) => {
    const x = x0 + k * (colW + gap);
    s += `<rect x="${x}" y="8" width="${colW}" height="${bottom - 8}" rx="10" fill="#f5f7fb" stroke="#c7cede"/>`;
    s += `<text x="${x + colW / 2}" y="32" font-size="14" font-weight="700" fill="#26456f" text-anchor="middle">${c.title}</text>`;
    s += `<text x="${x + colW / 2}" y="50" font-size="11" fill="#6b7482" text-anchor="middle">${c.sub}</text>`;
    if (k < 2) {
      const ax = x + colW + 4;
      s += `<path d="M${ax} 36 L${ax + gap - 10} 36" stroke="#8892a0" stroke-width="2" marker-end="url(#h)"/>`;
      s += `<text x="${ax + (gap - 6) / 2}" y="28" font-size="10" fill="#6b7482" text-anchor="middle">${k === 0 ? 'add' : 'commit'}</text>`;
    }
  });
  s += `<defs><marker id="h" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#8892a0"/></marker></defs>`;
  a.rows.forEach((r, i) => {
    const y = top + i * rowH;
    cols.forEach((c, k) => {
      const x = x0 + k * (colW + gap) + 10;
      const v = r[c.key];
      const on = v > 0;
      s += `<rect x="${x}" y="${y}" width="${colW - 20}" height="${rowH - 10}" rx="7" fill="${on ? '#eef3ff' : '#fff'}" stroke="${on ? '#2f6fed' : '#d5dae4'}" ${on ? '' : 'stroke-dasharray="4 3"'}/>`;
      s += `<text x="${x + 10}" y="${y + 19}" font-size="12" font-family="monospace" fill="${on ? '#1c2431' : '#a0a8b5'}">${esc(r.path)}</text>`;
      s += `<text x="${x + 10}" y="${y + 36}" font-size="12" font-weight="700" fill="${on ? '#2f6fed' : '#a0a8b5'}">${on ? '中身' + MARK[v] : 'なし'}</text>`;
    });
  });
  s += `<text x="${x0}" y="${H - 9}" font-size="10.5" fill="#6b7482">同じ番号は、同じ中身です（Git に問い合わせて描いた図）</text>`;
  return s + '</svg>\n';
}

// 読み上げ用の説明文
export function areasAlt(a) {
  const say = (v) => (v > 0 ? `中身${MARK[v]}` : 'なし');
  return a.rows.map((r) => `${r.path} は、作業ディレクトリに${say(r.work)}、ステージングエリアに${say(r.stage)}、リポジトリに${say(r.repo)}`).join('。') + '。';
}

// タグ → コミット →（サブモジュールのコミット）のつながり。番号は、Git に1つずつ聞いた答え（tools/record.mjs の tagchain）。
// 「同じ番号」の印は、手で付けずに、答え同士を比べて付ける。
const short = (h) => (h || '').slice(0, 7);
function chainRows(c) {
  const main = [
    { title: `タグ ${c.tag}`, sub: c.type === 'tag' ? '注釈付きのタグの番号' : 'タグの番号', id: c.tagObj, dim: true },
    { title: 'コミット', sub: c.entry ? 'タグが指すコミット' : 'タグが指すコミットの番号', id: c.commit },
  ];
  if (c.entry) {
    main[0].sub = '注釈付きのタグ';
    main.push({ title: c.entry.path, sub: `記録: ${c.entry.mode} ${c.entry.type}`, id: c.entry.sha });
    main.push({ title: 'サブモジュール側', sub: c.subTags && c.subTags.length ? `タグ ${c.subTags.join(', ')}` : '（タグなし）', id: c.entry.sha });
  }
  if (!c.remote) return [{ label: null, boxes: main }];
  return [
    { label: '手元', boxes: main },
    { label: 'GitHub（origin）', boxes: [
      { title: `タグ ${c.tag}`, sub: '注釈付きのタグの番号', id: c.remote.tagObj, dim: true },
      { title: 'コミット', sub: 'タグが指すコミットの番号', id: c.remote.commit },
    ] },
  ];
}
export function chainSvg(c) {
  const rows = chainRows(c);
  const W = 720, x0 = rows[0].label ? 130 : 20, gap = 34, boxH = 70, rowGap = 26, top = 16;
  const n = Math.max(...rows.map((r) => r.boxes.length));
  const bw = Math.floor((W - x0 - 20 - (n - 1) * gap) / n);
  const H = top + rows.length * (boxH + rowGap) + 24;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="sans-serif">`;
  s += `<rect width="${W}" height="${H}" fill="#fff"/>`;
  s += `<defs><marker id="h" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#8892a0"/></marker></defs>`;
  rows.forEach((r, ri) => {
    const y = top + ri * (boxH + rowGap);
    if (r.label) s += `<text x="16" y="${y + boxH / 2 + 5}" font-size="13" font-weight="700" fill="#26456f">${esc(r.label)}</text>`;
    r.boxes.forEach((b, i) => {
      const x = x0 + i * (bw + gap);
      s += `<rect x="${x}" y="${y}" width="${bw}" height="${boxH}" rx="9" fill="${b.dim ? '#f5f7fb' : '#eef3ff'}" stroke="${b.dim ? '#c7cede' : '#2f6fed'}"/>`;
      s += `<text x="${x + 10}" y="${y + 20}" font-size="12.5" font-weight="700" fill="#1c2431">${esc(b.title)}</text>`;
      s += `<text x="${x + 10}" y="${y + 37}" font-size="10.5" fill="#6b7482">${esc(b.sub)}</text>`;
      s += `<text x="${x + 10}" y="${y + 58}" font-size="15" font-weight="700" font-family="monospace" fill="${b.dim ? '#6b7482' : '#2f6fed'}">${esc(short(b.id))}</text>`;
      if (i < r.boxes.length - 1) {
        const ax = x + bw + 3;
        const same = r.boxes[i + 1].id === b.id;
        s += `<path d="M${ax} ${y + boxH / 2} L${ax + gap - 9} ${y + boxH / 2}" stroke="#8892a0" stroke-width="2" marker-end="url(#h)"/>`;
        if (same) s += `<text x="${ax + (gap - 6) / 2}" y="${y + boxH / 2 - 8}" font-size="18" font-weight="700" fill="#1f8a4c" text-anchor="middle">＝</text>`;
      }
    });
  });
  if (c.remote) {
    const ok = c.remote.commit === c.commit && c.remote.tagObj === c.tagObj;
    const y = top + 2 * (boxH + rowGap) - rowGap / 2 + 4;
    s += `<text x="${x0}" y="${y}" font-size="12.5" font-weight="700" fill="${ok ? '#1f8a4c' : '#c0392b'}">${ok ? '✓ 手元と GitHub で、タグの番号もコミットの番号も同じ' : '✗ 手元と GitHub で番号が違う'}</text>`;
  } else {
    s += `<text x="${x0}" y="${H - 9}" font-size="10.5" fill="#6b7482">番号は、Git に1つずつ聞いた答えです（下の「この図の描き方」）。＝ は、同じ番号の印です</text>`;
  }
  return s + '</svg>\n';
}
export function chainAlt(c) {
  let t = `タグ ${c.tag} の番号は ${short(c.tagObj)}、このタグが指すコミットの番号は ${short(c.commit)}。`;
  if (c.entry) t += `そのコミットの ${c.entry.path} には ${c.entry.mode} ${c.entry.type} として ${short(c.entry.sha)} が記録されていて、これはサブモジュールの${c.subTags && c.subTags.length ? 'タグ ' + c.subTags.join(', ') + ' が指す' : ''}コミット。`;
  if (c.remote) t += (c.remote.commit === c.commit && c.remote.tagObj === c.tagObj) ? 'GitHub（origin）でも、タグの番号とコミットの番号は同じ。' : 'GitHub（origin）では番号が違う。';
  return t;
}
