import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './hardcoded-color.mjs';
import { buildContext } from '../detect.mjs';

test('hardcoded-color: flags fill #FF6A5B where $coral is defined', () => {
  const ctx = buildContext({
    nodes: [{ id: 'n', type: 'frame', fill: '#FF6A5B' }],
    variables: { coral: '#FF6A5B' },
  });
  const f = rule.check(ctx);
  assert.equal(f.length, 1);
  assert.equal(f[0].meta.replacement, '$coral');
});

test('hardcoded-color: passes when token ref is used', () => {
  const ctx = buildContext({
    nodes: [{ id: 'n', type: 'frame', fill: '$coral' }],
    variables: { coral: '#FF6A5B' },
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('hardcoded-color: passes when hex does not match any token', () => {
  const ctx = buildContext({
    nodes: [{ id: 'n', type: 'frame', fill: '#123456' }],
    variables: { coral: '#FF6A5B' },
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('hardcoded-color: case-insensitive match', () => {
  const ctx = buildContext({
    nodes: [{ id: 'n', type: 'frame', fill: '#ff6a5b' }],
    variables: { coral: '#FF6A5B' },
  });
  assert.equal(rule.check(ctx).length, 1);
});
