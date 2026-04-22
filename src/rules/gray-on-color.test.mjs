import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './gray-on-color.mjs';
import { buildContext } from '../detect.mjs';

test('gray-on-color: flags gray text on saturated red parent', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', fill: '#E53935', children: ['t'] }, // sat ~0.77
      { id: 't', type: 'text', fill: '#888888' }, // sat 0
    ],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('gray-on-color: passes gray text on neutral surface', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', fill: '#FAFAFA', children: ['t'] },
      { id: 't', type: 'text', fill: '#888888' },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('gray-on-color: passes colored text on colored parent', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', fill: '#E53935', children: ['t'] },
      { id: 't', type: 'text', fill: '#FFD54F' }, // saturated yellow
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});
