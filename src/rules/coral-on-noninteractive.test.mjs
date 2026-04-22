import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './coral-on-noninteractive.mjs';
import { buildContext } from '../detect.mjs';

test('coral-on-noninteractive: flags $coral on plain frame when config names coral', () => {
  const ctx = buildContext({
    nodes: [{ id: 'n', type: 'frame', fill: '$coral' }],
    config: { interactiveTokens: ['coral'] },
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('coral-on-noninteractive: passes when node is named like a button', () => {
  const ctx = buildContext({
    nodes: [{ id: 'n', type: 'frame', fill: '$coral', name: 'Primary Button' }],
    config: { interactiveTokens: ['coral'] },
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('coral-on-noninteractive: passes when onPress is set', () => {
  const ctx = buildContext({
    nodes: [{ id: 'n', type: 'frame', fill: '$coral', onPress: 'submit' }],
    config: { interactiveTokens: ['coral'] },
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('coral-on-noninteractive: no-op without config', () => {
  const ctx = buildContext({
    nodes: [{ id: 'n', type: 'frame', fill: '$coral' }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('coral-on-noninteractive: handles $-prefixed config entries', () => {
  const ctx = buildContext({
    nodes: [{ id: 'n', type: 'frame', fill: '$action' }],
    config: { interactiveTokens: ['$action'] },
  });
  assert.equal(rule.check(ctx).length, 1);
});
