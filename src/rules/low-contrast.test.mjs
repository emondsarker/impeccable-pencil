import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './low-contrast.mjs';
import { buildContext } from '../detect.mjs';

test('low-contrast: flags #999 on #fff (2.85:1)', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', fill: '#fff', children: ['t'] },
      { id: 't', type: 'text', fill: '#999' },
    ],
  });
  const f = rule.check(ctx);
  assert.equal(f.length, 1);
  assert.equal(f[0].severity, 'P0');
});

test('low-contrast: flags #777 on #fff (4.48:1) as P1', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', fill: '#fff', children: ['t'] },
      { id: 't', type: 'text', fill: '#777' },
    ],
  });
  const f = rule.check(ctx);
  assert.equal(f.length, 1);
  assert.equal(f[0].severity, 'P1');
});

test('low-contrast: passes #222 on #fff', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', fill: '#fff', children: ['t'] },
      { id: 't', type: 'text', fill: '#222' },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('low-contrast: walks up ancestors to find fill', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'root', type: 'frame', fill: '#0A0A0F', children: ['mid'] },
      { id: 'mid', type: 'frame', children: ['t'] },
      { id: 't', type: 'text', fill: '#333' }, // dark text on dark bg
    ],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('low-contrast: skips when fg is a gradient (unresolvable)', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', fill: '#fff', children: ['t'] },
      { id: 't', type: 'text', fill: { type: 'linearGradient', stops: [] } },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('low-contrast: resolves variable references', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', fill: '$surface', children: ['t'] },
      { id: 't', type: 'text', fill: '$muted' },
    ],
    variables: { surface: '#ffffff', muted: '#aaaaaa' },
  });
  assert.equal(rule.check(ctx).length, 1);
});
