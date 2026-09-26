// 逆算プランナーの計算と、AIに渡す文章の組み立て（元の plan.js から、画面以外をそのまま移したもの）。
import { fields, levels, levelOrder, hours, skills } from '../../../content/plan.js';
import { readJSON } from '../../lib/store.js';

// その到達度までに身についている項目を、カテゴリごとにまとめて返す
function skillsFor(level) {
  var max = levelOrder.indexOf(level);
  if (max < 0) max = 0;
  var by = {}, order = [];
  skills.forEach(function (g) {
    if (levelOrder.indexOf(g.from) > max) return;
    if (!by[g.cat]) { by[g.cat] = []; order.push(g.cat); }
    by[g.cat] = by[g.cat].concat(g.items);
  });
  return order.map(function (c) { return { cat: c, items: by[c] }; });
}


// 研修の進捗（各ナビが localStorage に残しているもの）から、到達度を推定する。
// 手で選び直せるので、あくまで初期値。
export function guessLevel() {
  var done = function (key, total) {
    var v = readJSON(key, {});
    return typeof v.i === 'number' && v.i >= total;
  };
  if (done('trainer-api-v1', 8) && done('trainer-perf-v1', 9)) return 'full';
  if (done('trainer-mcp-v1', 8) || done('trainer-ask-v1', 7)) return 'trained';
  if (done('trainer-aidlc-v1', 12)) return 'theme';
  if (done('trainer-work-v1', 15)) return 'work';
  if (done('trainer-publish-v1', 8)) return 'base';
  return 'early';
}

// その到達度までに積み上がっている「できること」を、全部つなげて返す
function canList(level) {
  var out = [];
  for (var i = 0; i < levelOrder.length; i++) {
    out = out.concat(levels[levelOrder[i]].can);
    if (levelOrder[i] === level) break;
  }
  return out;
}


export function weeksLeft(dateStr) {
  if (!dateStr) return null;
  var start = new Date(dateStr + 'T00:00:00');
  if (isNaN(start.getTime())) return null;
  var now = new Date(); now.setHours(0, 0, 0, 0);
  var days = Math.ceil((start - now) / 86400000);
  return { days: days, weeks: Math.max(0, Math.ceil(days / 7)) };
}

// 残り週数と到達度から、ざっくりの配分を決める（AIに渡す「たたき台」）
export function shape(weeks, level) {
  if (weeks <= 0) return [];
  var idx = levelOrder.indexOf(level);
  var plan = [];
  // 研修が残っているほど、前半を「土台」に厚く割く
  var baseRatio = [0.6, 0.45, 0.3, 0.2, 0.1, 0][idx < 0 ? 0 : idx];
  var base = Math.min(weeks - 1, Math.round(weeks * baseRatio));
  if (base < 0) base = 0;
  for (var i = 1; i <= weeks; i++) {
    if (i <= base) {
      plan.push({ w: i, t: '土台を終わらせる',
        d: '研修の残りのステップを進める。ここを飛ばすと、あとが全部効かなくなります' });
    } else if (i === weeks) {
      plan.push({ w: i, t: '仕上げ・調整',
        d: '弱いところの復習と、初日に聞くことの整理。新しいことは始めない' });
    } else if (i === weeks - 1 && weeks >= 3) {
      plan.push({ w: i, t: '案件に寄せる',
        d: '案件で使う技術で、小さいものを1つ作って動かす（読むだけにしない）' });
    } else {
      plan.push({ w: i, t: '上乗せを1つずつ',
        d: '案件で使う道具を、手を動かしながら1つずつ。同時に2つ始めない' });
    }
  }
  return plan;
}

// 時間が足りているか、正直に見る
export function reality(v) {
  if (!v.left || v.left.days < 0) return null;
  var total = v.left.weeks * Number(v.hours);
  var need = (levels[v.level] || levels.early).need;
  if (need === 0) return { ok: true, total: total, need: need };
  if (total >= need * 1.6) return { ok: true, total: total, need: need };
  if (total >= need) return { ok: true, tight: true, total: total, need: need };
  return { ok: false, total: total, need: need };
}

export function planPrompt(v) {
  var f = fields[v.field] || fields.unknown;
  var w = v.left ? v.left.weeks : 0;
  var r = reality(v);
  var L = [];
  L.push('あなたは、未経験からエンジニアを目指す私の学習コーチです。');
  L.push('現実的で、実行できる学習計画を作ってください。');
  L.push('');
  L.push('# 私の状況');
  L.push('- 参加する案件の開始まで: ' + (v.left ? 'あと ' + v.left.days + '日（約' + w + '週間）' : '**未定**'));
  L.push('- 学習にあてられる時間: ' + (hours[v.hours] || v.hours) +
         (v.left ? '（この期間で合計およそ ' + (w * Number(v.hours)) + '時間）' : ''));
  L.push('- いまの到達度: ' + ((levels[v.level] || {}).label || v.level));
  L.push('- 目指す方向: ' + f.label +
         (v.field === 'unknown' && v.desc && v.desc.trim()
           ? '（選んでいませんが、**下の案件内容から判断してください**）' : ''));
  L.push('');
  if (!v.left) {
    L.push('# 開始日が未定です');
    L.push('**まず4週間ぶんの計画**を作ってください。日付が決まったら、作り直します。');
    L.push('');
  }
  L.push('# すでにできること');
  canList(v.level).forEach(function (c) { L.push('- ' + c); });
  L.push('');
  L.push('（上に書いていないことは、まだできません。**できる前提で計画を立てないでください。**）');
  L.push('');
  if (v.weak && v.weak.trim()) {
    L.push('# まだ自信が無いところ');
    L.push(v.weak.trim());
    L.push('');
    L.push('（**ここを埋めることを、計画の中心にしてください。**）');
    L.push('');
  }
  if (v.desc && v.desc.trim()) {
    L.push('# 案件の内容（分かっている範囲）');
    L.push(v.desc.trim());
    L.push('');
    L.push('（この中で見てほしいのは **使う技術・稼働条件・チームの形** だけです。');
    L.push('　単価・商流・他人の感想は、計画には関係しないので**無視してください**。）');
    L.push('');
  }
  if (r && !r.ok) {
    L.push('# 時間が足りていません');
    L.push('使える時間は約' + r.total + '時間ですが、私の到達度からすると' + r.need + '時間ほど欲しい状況です。');
    L.push('**足りない前提で、何を捨てるかを先に決めた計画にしてください。**');
    L.push('全部やろうとする計画は作らないでください。');
    L.push('');
  } else if (r && r.tight) {
    L.push('# 時間に余裕がありません');
    L.push('使える時間は約' + r.total + '時間で、ぎりぎりです。**詰め込まず、優先順位をはっきりさせてください。**');
    L.push('');
  }
  L.push('# 作ってほしいもの');
  L.push('1. **週ごとの計画**（' + (w ? w + '週間ぶん' : 'まず4週間ぶん') + '）。各週について次を書いてください。');
  L.push('   - その週のゴール（1つだけ。欲張らない）');
  L.push('   - 具体的にやること（手を動かす作業。読むだけの項目は入れない）');
  L.push('   - 終わったと判断する方法（何が動けばOKか）');
  L.push('2. **最初の1つ**。明日いちばん最初に着手する作業を、1つだけ具体的に。');
  L.push('3. **捨てるもの**。この期間では手を出さないほうがよいものと、その理由。');
  L.push('4. **初日に聞くこと**。案件の初日に確認すべきことのリスト。');
  L.push('5. **危ないサイン**。「この計画が崩れ始めている」と判断できる目印を3つ。');
  L.push('6. **この時間で足りるかの評価**。上の学習時間で間に合いそうか、**正直に**書いてください。');
  L.push('   足りないなら「足りない」と言い、**何を捨てるか**を示してください。');
  L.push('');
  L.push('# 条件');
  L.push('- 私は初心者です。専門用語には短い説明を付けてください。');
  L.push('- **本や動画を「見る」だけの計画にしないでください。** 毎週、手元で動くものが1つ増える形にしてください。');
  L.push('- 使えるのは上に書いた時間だけです。**詰め込みすぎないでください。** 守れない計画は意味がありません。');
  L.push('- **休む日を計画に入れてください。** 毎日やる前提の計画は、必ず折れます。');
  L.push('- **参画したあとは、学習にあてられる時間が大きく減ります。**（案件の稼働時間があるためです）');
  L.push('  だから「**参画前に、自分でやっておくべきこと**」と「**参画後に、仕事の中で覚えられること**」を');
  L.push('  分けてください。**後者を、参画前の計画に入れないでください。**');
  L.push('- 私はAIと一緒に作業します。「AIにこう頼む」という具体例も添えてください。');
  L.push('- 分からない前提があれば、計画を作る前に質問してください。');
  return L.join('\n');
}

// 案件の技術領域と、研修で身につけたものが、どれだけ噛み合うかを測る
export function matchPrompt(v) {
  var f = fields[v.field] || fields.unknown;
  var L = [];
  L.push('私は未経験からエンジニアを目指していて、ある研修を進めてきました。');
  L.push('これから参加する案件で、**学んだことがどれだけ通用するか**を判定してください。');
  L.push('');
  L.push('# 研修で、実際に手を動かしたこと');
  L.push('（読んだだけのものは含めていません。すべて自分で動かしたものです）');
  L.push('');
  skillsFor(v.level).forEach(function (g) {
    L.push('## ' + g.cat);
    g.items.forEach(function (i) { L.push('- ' + i); });
    L.push('');
  });
  L.push('# これから参加する案件');
  if (v.desc && v.desc.trim()) {
    L.push(v.desc.trim());
    L.push('');
    L.push('（見てほしいのは **使う技術・稼働条件・チームの形** だけです。単価や他人の感想は無視してください。）');
  } else {
    L.push('（まだ詳しく分かっていません。分かっているのは「' + f.label + '」の方向であることだけです）');
  }
  L.push('');
  if (v.left) {
    L.push('参加まで あと ' + v.left.days + '日（約' + v.left.weeks + '週間）。');
    L.push('学習にあてられるのは ' + (hours[v.hours] || v.hours) + ' です。');
    L.push('');
  }
  L.push('# 判定してほしいこと');
  L.push('1. **そのまま通用するもの**。上の項目のうち、この案件で初日から使えるものを挙げてください。');
  L.push('2. **形を変えれば通用するもの**。考え方は同じだが、道具や言語が違うもの。');
  L.push('   「研修での◯◯は、この案件での△△にあたる」という形で対応づけてください。');
  L.push('3. **足りないもの**。案件で必要なのに、上の一覧に無いもの。**優先度の高い順に、5つまで**。');
  L.push('   それぞれについて「なぜ必要か」と「研修のどの経験の延長で学べるか」も書いてください。');
  L.push('4. **マッチ度**。全体として何割くらい通用しそうか、**根拠つき**で。');
  L.push('   楽観的に言わないでください。**低いなら低いと言ってください。**');
  L.push('5. **最初に埋めるべき1つ**。参加までに、いちばん先に手を付けるべきものを1つだけ。');
  L.push('6. **初日に確認すべきこと**。この案件特有の、聞いておかないと詰まることを3つ。');
  L.push('');
  L.push('# 条件');
  L.push('- 私は初心者です。専門用語には短い説明を付けてください。');
  L.push('- **上の一覧に無いことは、できません。** できる前提で判定しないでください。');
  L.push('- **足りないものを並べて終わりにしないでください。** 通用するものを先に、具体的に挙げてください。');
  L.push('  「何が通用するか」が分からないと、初日に何も出せません。');
  L.push('- 案件の情報が足りずに判定できない部分があれば、**何が分かれば判定できるか**を教えてください。');
  return L.join('\n');
}

export function weeklyPrompt() {
  return [
    'いまの学習計画について、今週の振り返りをします。',
    '',
    '# 今週やったこと',
    '（ここに書く。できなかったことも正直に書く）',
    '',
    '# 詰まったこと',
    '（ここに書く）',
    '',
    '# お願い',
    '1. 進み具合を見て、来週の計画を調整してください。遅れていれば、**減らす方向で**調整してください。',
    '2. 詰まったところについて、次にとるべき手を1つだけ教えてください。',
    '3. このペースで、案件の開始までに間に合いそうか、正直に評価してください。',
    '   間に合わない場合は、**何を捨てるべきか**を教えてください。'
  ].join('\n');
}

