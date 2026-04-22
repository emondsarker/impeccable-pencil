import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './monotonous-spacing.mjs';
import { buildContext } from '../detect.mjs';

test('monotonous-spacing: flags when 16 dominates 10 frames', () => {
  const nodes = [];
  for (let i = 0; i < 10; i++) nodes.push({ id: `f${i}`, type: 'frame', gap: 16, padding: 16 });
  assert.equal(rule.check(buildContext({ nodes })).length, 1);
});

test('monotonous-spacing: passes with varied scale', () => {
  const nodes = [
    { id: 'a', type: 'frame', gap: 4 },
    { id: 'b', type: 'frame', gap: 8 },
    { id: 'c', type: 'frame', gap: 12, padding: 16 },
    { id: 'd', type: 'frame', gap: 24, padding: 24 },
    { id: 'e', type: 'frame', gap: 48, padding: 32 },
    { id: 'f', type: 'frame', padding: 8 },
    { id: 'g', type: 'frame', padding: 4 },
  ];
  assert.equal(rule.check(buildContext({ nodes })).length, 0);
});

test('monotonous-spacing: ignores small samples (< 10 values)', () => {
  const nodes = [];
  for (let i = 0; i < 3; i++) nodes.push({ id: `f${i}`, type: 'frame', gap: 16 });
  assert.equal(rule.check(buildContext({ nodes })).length, 0);
});
