import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './ghost-node.mjs';
import { buildContext } from '../detect.mjs';

test('ghost-node: flags empty nested frame', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', children: ['g'] },
      { id: 'g', type: 'frame' },
    ],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('ghost-node: ignores root frames (no parent)', () => {
  const ctx = buildContext({ nodes: [{ id: 'r', type: 'frame' }] });
  assert.equal(rule.check(ctx).length, 0);
});

test('ghost-node: ignores frames with children', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', children: ['c'] },
      { id: 'c', type: 'frame', children: ['x'] },
      { id: 'x', type: 'text' },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});
