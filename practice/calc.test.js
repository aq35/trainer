const test = require('node:test');
const assert = require('node:assert');
const { sum } = require('./calc.js');

test('sum は合計を返す', () => {
  assert.strictEqual(sum([1, 2, 3]), 6);
});
