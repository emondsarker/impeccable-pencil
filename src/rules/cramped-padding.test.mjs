import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './cramped-padding.mjs';
import { buildContext } from '../detect.mjs';

test('cramped-padding: flags frame with padding 4 around text', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', padding: 4, children: ['t'] },
      { id: 't', type: 'text', content: 'hi' },
    ],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('cramped-padding: flags mixed padding object with one tight side', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', padding: { top: 16, right: 16, bottom: 16, left: 4 }, children: ['t'] },
      { id: 't', type: 'text', content: 'hi' },
    ],
  });
  const f = rule.check(ctx);
  assert.equal(f.length, 1);
  assert.match(f[0].message, /left=4/);
});

test('cramped-padding: ignores 16 padding around text', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', padding: 16, children: ['t'] },
      { id: 't', type: 'text', content: 'hi' },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('cramped-padding: ignores frame with no text child', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', padding: 2, children: ['c'] },
      { id: 'c', type: 'frame' },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('cramped-padding: accepts CSS-shorthand array padding', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', padding: [8, 16, 8, 16], children: ['t'] },
      { id: 't', type: 'text' },
    ],
  });
  const f = rule.check(ctx);
  assert.equal(f.length, 1);
  assert.match(f[0].message, /top=8.*bottom=8/);
});
