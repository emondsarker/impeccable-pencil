import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './nested-cards.mjs';
import { buildContext } from '../detect.mjs';

test('nested-cards: flags a 3-deep card-like filled chain', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'a', type: 'frame', fill: '$surface', width: 1000, height: 800, children: ['b'] },
      { id: 'b', type: 'frame', fill: '$canvas', width: 600, height: 400, children: ['c'] },
      { id: 'c', type: 'frame', fill: '#eee', width: 300, height: 200, children: [] },
    ],
  });
  const f = rule.check(ctx);
  assert.ok(f.length >= 1, 'expected at least one finding at depth 3');
  assert.ok(f.some((x) => x.nodeId === 'c'), 'deepest card should be reported');
});

test('nested-cards: does not flag a 2-deep filled chain', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'a', type: 'frame', fill: '$surface', width: 1000, height: 800, children: ['b'] },
      { id: 'b', type: 'frame', fill: '#eee', width: 300, height: 200, children: [] },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('nested-cards: ignores pill-shaped filled frames (cornerRadius >= 100)', () => {
  // A status pill (e.g. "PAID" badge) inside a card inside a screen bg is NOT nested cards.
  const ctx = buildContext({
    nodes: [
      { id: 'screen', type: 'frame', fill: '$canvas', width: 1440, children: ['card'] },
      { id: 'card', type: 'frame', fill: '$surface', width: 1000, height: 600, children: ['pill'] },
      { id: 'pill', type: 'frame', fill: '$success', cornerRadius: 999, children: [] },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('nested-cards: ignores decorative dots and small icon tiles', () => {
  // 18x18 accent dot inside a 44x44 logomark inside a large screen = no "nested cards".
  const ctx = buildContext({
    nodes: [
      { id: 'screen', type: 'frame', fill: '$canvas', width: 1440, children: ['logomark'] },
      { id: 'logomark', type: 'frame', fill: '$primary-deep', width: 44, height: 44, children: ['dot'] },
      { id: 'dot', type: 'frame', fill: '$accent', width: 18, height: 18, children: [] },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('nested-cards: ignores 1px divider rectangles', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'screen', type: 'frame', fill: '$canvas', width: 1440, children: ['card'] },
      { id: 'card', type: 'frame', fill: '$surface', width: 1000, height: 600, children: ['divider'] },
      { id: 'divider', type: 'rectangle', fill: '$line', height: 1, children: [] },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('nested-cards: ignores a chain where ancestor is unfilled', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'a', type: 'frame', width: 1000, height: 800, children: ['b'] },
      { id: 'b', type: 'frame', fill: '$surface', width: 600, height: 400, children: ['c'] },
      { id: 'c', type: 'frame', fill: '#eee', width: 300, height: 200, children: [] },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('nested-cards: treats "transparent" and "none" fills as unfilled', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'a', type: 'frame', fill: 'transparent', width: 1000, children: ['b'] },
      { id: 'b', type: 'frame', fill: 'none', width: 600, children: ['c'] },
      { id: 'c', type: 'frame', fill: '#eee', width: 300, height: 200, children: [] },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('nested-cards: counts cards without explicit numeric size (fill_container)', () => {
  // Real Pencil cards often use width: "fill_container" — size is unknown but
  // cornerRadius + padding mark them as card-like.
  const ctx = buildContext({
    nodes: [
      { id: 'screen', type: 'frame', fill: '$canvas', width: 1440, children: ['outer'] },
      { id: 'outer', type: 'frame', fill: '$surface', width: 'fill_container', cornerRadius: '$radius-xl', children: ['inner'] },
      { id: 'inner', type: 'frame', fill: '$mint-soft', width: 'fill_container', cornerRadius: 20, children: [] },
    ],
  });
  const f = rule.check(ctx);
  assert.ok(f.length >= 1, 'expected depth-3 card chain to fire even without numeric sizes');
});
