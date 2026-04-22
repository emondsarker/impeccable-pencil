import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './icon-tile-stack.mjs';
import { buildContext } from '../detect.mjs';

test('icon-tile-stack: flags icon tile above a heading', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', children: ['tile', 'h'] },
      { id: 'tile', type: 'frame', width: 48, height: 48, cornerRadius: 12, children: ['icon'] },
      { id: 'icon', type: 'icon' },
      { id: 'h', type: 'text', fontSize: 24 },
    ],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('icon-tile-stack: passes when icon is inline with heading (no tile)', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', children: ['icon', 'h'] },
      { id: 'icon', type: 'icon' },
      { id: 'h', type: 'text', fontSize: 24 },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('icon-tile-stack: ignores square without rounded radius', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', children: ['tile', 'h'] },
      { id: 'tile', type: 'frame', width: 48, height: 48, cornerRadius: 0, children: ['icon'] },
      { id: 'icon', type: 'icon' },
      { id: 'h', type: 'text', fontSize: 24 },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('icon-tile-stack: ignores tile followed by body text (no heading)', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', children: ['tile', 't'] },
      { id: 'tile', type: 'frame', width: 48, height: 48, cornerRadius: 12, children: ['icon'] },
      { id: 'icon', type: 'icon' },
      { id: 't', type: 'text', fontSize: 14 },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});
