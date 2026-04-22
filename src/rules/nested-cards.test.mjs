import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './nested-cards.mjs';
import { buildContext } from '../detect.mjs';

test('nested-cards: flags a 3-deep filled chain', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'a', type: 'frame', fill: '$surface', children: ['b'] },
      { id: 'b', type: 'frame', fill: '$canvas', children: ['c'] },
      { id: 'c', type: 'frame', fill: '#eee', children: [] },
    ],
  });
  const f = rule.check(ctx);
  assert.ok(f.length >= 1, 'expected at least one finding at depth 3');
  assert.ok(f.some(x => x.nodeId === 'c'), 'deepest node should be reported');
});

test('nested-cards: does not flag a 2-deep filled chain', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'a', type: 'frame', fill: '$surface', children: ['b'] },
      { id: 'b', type: 'frame', fill: '#eee', children: [] },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('nested-cards: ignores a chain where ancestor is unfilled', () => {
  // root > frame (no fill) > card > card — filled depth is only 2
  const ctx = buildContext({
    nodes: [
      { id: 'a', type: 'frame', children: ['b'] },
      { id: 'b', type: 'frame', fill: '$surface', children: ['c'] },
      { id: 'c', type: 'frame', fill: '#eee', children: [] },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('nested-cards: treats "transparent" and "none" as unfilled', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'a', type: 'frame', fill: 'transparent', children: ['b'] },
      { id: 'b', type: 'frame', fill: 'none', children: ['c'] },
      { id: 'c', type: 'frame', fill: '#eee', children: [] },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});
