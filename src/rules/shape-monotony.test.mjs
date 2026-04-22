import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './shape-monotony.mjs';
import { buildContext } from '../detect.mjs';

test('shape-monotony: flags 5 cards all with cornerRadius 12', () => {
  const nodes = [];
  for (let i = 0; i < 5; i++) {
    nodes.push({ id: `c${i}`, type: 'frame', fill: '$surface', width: 320, height: 160, cornerRadius: 12 });
  }
  assert.equal(rule.check(buildContext({ nodes })).length, 1);
});

test('shape-monotony: passes when one card uses asymmetric radius', () => {
  const nodes = [];
  for (let i = 0; i < 3; i++) {
    nodes.push({ id: `c${i}`, type: 'frame', fill: '$surface', width: 320, height: 160, cornerRadius: 12 });
  }
  nodes.push({ id: 'alert', type: 'frame', fill: '$surface', width: 320, height: 160, cornerRadius: [6, 20, 20, 20] });
  nodes.push({ id: 'tip', type: 'frame', fill: '$surface', width: 320, height: 160, cornerRadius: [20, 6, 20, 20] });
  assert.equal(rule.check(buildContext({ nodes })).length, 0);
});

test('shape-monotony: ignores pills (radius >= 100)', () => {
  const nodes = [];
  for (let i = 0; i < 5; i++) {
    nodes.push({ id: `p${i}`, type: 'frame', fill: '$surface', width: 200, height: 80, cornerRadius: 999 });
  }
  assert.equal(rule.check(buildContext({ nodes })).length, 0);
});

test('shape-monotony: ignores fewer than 4 cards', () => {
  const nodes = [];
  for (let i = 0; i < 3; i++) {
    nodes.push({ id: `c${i}`, type: 'frame', fill: '$surface', width: 320, height: 160, cornerRadius: 12 });
  }
  assert.equal(rule.check(buildContext({ nodes })).length, 0);
});
