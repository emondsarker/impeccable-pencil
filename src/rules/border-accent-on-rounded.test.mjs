import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './border-accent-on-rounded.mjs';
import { buildContext } from '../detect.mjs';

test('border-accent-on-rounded: flags left stroke with cornerRadius 12', () => {
  const ctx = buildContext({
    nodes: [{ id: 'a', type: 'frame', stroke: { left: 4, right: 0, top: 0, bottom: 0 }, cornerRadius: 12 }],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('border-accent-on-rounded: flags asymmetric radius array', () => {
  const ctx = buildContext({
    nodes: [{ id: 'a', type: 'frame', stroke: { top: 4, right: 0, bottom: 0, left: 0 }, cornerRadius: [6, 20, 20, 20] }],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('border-accent-on-rounded: ignores square one-sided stroke (no radius)', () => {
  const ctx = buildContext({
    nodes: [{ id: 'a', type: 'frame', stroke: { left: 4 }, cornerRadius: 0 }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('border-accent-on-rounded: ignores symmetric stroke with rounded corner', () => {
  const ctx = buildContext({
    nodes: [{ id: 'a', type: 'frame', stroke: { left: 2, right: 2, top: 2, bottom: 2 }, cornerRadius: 12 }],
  });
  assert.equal(rule.check(ctx).length, 0);
});
