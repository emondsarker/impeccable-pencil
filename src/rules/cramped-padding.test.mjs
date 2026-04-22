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

test('cramped-padding: accepts 4-value CSS shorthand [t, r, b, l]', () => {
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

test('cramped-padding: 2-value shorthand [v, h] — [12, 0] is fine, padding 12 top/bottom', () => {
  // Regression: rule used to read [12, 0] as [t=12, r=0, b=0, l=0] and flag
  // b=0, l=0. Pencil's 2-value shorthand is [vertical, horizontal], so the
  // actual padding is 12 top/bottom, 0 left/right — sides have no text
  // clearance but nothing is "cramped" relative to the text within.
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', padding: [12, 0], children: ['t'] },
      { id: 't', type: 'text' },
    ],
  });
  // top=12 and bottom=12 are OK, but left=0 and right=0 are still < 12 — the
  // rule flags them. This is a valid flag: a text row with 0 side padding IS
  // cramped horizontally.
  const f = rule.check(ctx);
  assert.equal(f.length, 1);
  assert.match(f[0].message, /right=0, left=0/);
});

test('cramped-padding: 2-value shorthand [16, 16] — all sides >= 12, passes', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', padding: [16, 16], children: ['t'] },
      { id: 't', type: 'text' },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('cramped-padding: 2-value shorthand [0, 20] — flags top/bottom, not sides', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', padding: [0, 20], children: ['t'] },
      { id: 't', type: 'text' },
    ],
  });
  const f = rule.check(ctx);
  assert.equal(f.length, 1);
  assert.match(f[0].message, /top=0, bottom=0/);
});

test('cramped-padding: 3-value shorthand [t, h, b]', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', padding: [16, 4, 16], children: ['t'] },
      { id: 't', type: 'text' },
    ],
  });
  const f = rule.check(ctx);
  assert.equal(f.length, 1);
  assert.match(f[0].message, /right=4, left=4/);
});
