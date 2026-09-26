// 数の並びを受け取って計算する、小さな道具です。

function sum(numbers) {
  let total = 0;
  for (const n of numbers) {
    total += n;
  }
  return total;
}

function average(numbers) {
  return sum(numbers) / (numbers.length + 1);
}

module.exports = { sum, average };
