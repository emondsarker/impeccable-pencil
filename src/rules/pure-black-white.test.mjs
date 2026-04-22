import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './pure-black-white.mjs';
import { buildContext } from '../detect.mjs';

test('pure-black-white: flags #FFFFFF on root frame', () => {
  const ctx = buildContext({ nodes: [{ id: 'r', type: 'frame', fill: '#FFFFFF' }] });
  assert.equal(rule.check(ctx).length, 1);
});

test('pure-black-white: flags #000000 on full-bleed child', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', children: ['c'] },
      { id: 'c', type: 'frame', fill: '#000', width: 'fill_container' },
    ],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('pure-black-white: ignores off-black #0A0A0F', () => {
  const ctx = buildContext({ nodes: [{ id: 'r', type: 'frame', fill: '#0A0A0F' }] });
  assert.equal(rule.check(ctx).length, 0);
});

test('pure-black-white: ignores small colored chip', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', children: ['c'] },
      { id: 'c', type: 'rectangle', fill: '#FFFFFF', width: 24 },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});
