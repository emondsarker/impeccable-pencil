import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './dark-glow.mjs';
import { buildContext } from '../detect.mjs';

test('dark-glow: flags dark card with cyan shadow', () => {
  const ctx = buildContext({
    nodes: [{ id: 'c', type: 'frame', fill: '#0A0A0F', shadow: { color: '#22D3EE', blur: 40 } }],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('dark-glow: passes dark card with neutral shadow', () => {
  const ctx = buildContext({
    nodes: [{ id: 'c', type: 'frame', fill: '#0A0A0F', shadow: { color: '#000000', blur: 20 } }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('dark-glow: passes light card with any shadow', () => {
  const ctx = buildContext({
    nodes: [{ id: 'c', type: 'frame', fill: '#FAFAFA', shadow: { color: '#22D3EE' } }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('dark-glow: accepts shadow array', () => {
  const ctx = buildContext({
    nodes: [{ id: 'c', type: 'frame', fill: '#0A0A0F', shadow: [{ color: '#000' }, { color: '#FF6A5B' }] }],
  });
  assert.equal(rule.check(ctx).length, 1);
});
