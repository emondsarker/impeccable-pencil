import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './ai-color-palette.mjs';
import { buildContext } from '../detect.mjs';

test('ai-color-palette: flags > 30% purple fills', () => {
  const nodes = [
    { id: 'a', type: 'frame', fill: '#6D28D9' }, // purple
    { id: 'b', type: 'frame', fill: '#8B5CF6' }, // purple
    { id: 'c', type: 'frame', fill: '#FAFAFA' },
  ];
  assert.equal(rule.check(buildContext({ nodes })).length, 1);
});

test('ai-color-palette: flags cyan on dark parent', () => {
  const nodes = [
    { id: 'p', type: 'frame', fill: '#0A0A0F', children: ['c'] },
    { id: 'c', type: 'rectangle', fill: '#22D3EE' },
  ];
  assert.equal(rule.check(buildContext({ nodes })).length, 1);
});

test('ai-color-palette: passes neutral palette', () => {
  const nodes = [
    { id: 'a', type: 'frame', fill: '#FAFAFA' },
    { id: 'b', type: 'frame', fill: '#0A0A0F' },
    { id: 'c', type: 'frame', fill: '#FF6A5B' },
  ];
  assert.equal(rule.check(buildContext({ nodes })).length, 0);
});
