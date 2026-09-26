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
