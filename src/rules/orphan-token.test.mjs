import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './orphan-token.mjs';
import { buildContext } from '../detect.mjs';

test('orphan-token: flags token defined but never used', () => {
  const ctx = buildContext({
    nodes: [{ id: 'n', type: 'frame', fill: '$surface' }],
    variables: { surface: '#0A0A0F', ghostToken: '#FF6A5B' },
  });
  const f = rule.check(ctx);
  assert.equal(f.length, 1);
  assert.equal(f[0].meta.variable, 'ghostToken');
});

test('orphan-token: ignores when every token is used', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'a', type: 'frame', fill: '$surface' },
      { id: 'b', type: 'text', fontFamily: '$bodyFont' },
    ],
    variables: { surface: '#0A0A0F', bodyFont: 'DM Sans' },
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('orphan-token: finds refs inside nested stroke object', () => {
  const ctx = buildContext({
    nodes: [{ id: 'n', type: 'frame', stroke: { top: { color: '$border' } } }],
    variables: { border: '#E5E5E5' },
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('orphan-token: no variables → no findings', () => {
  const ctx = buildContext({ nodes: [{ id: 'n', type: 'frame', fill: '#000' }] });
  assert.equal(rule.check(ctx).length, 0);
});
