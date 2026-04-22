import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './wide-tracking.mjs';
import { buildContext } from '../detect.mjs';

test('wide-tracking: flags 2px tracking on 16px body', () => {
  const ctx = buildContext({ nodes: [{ id: 't', type: 'text', fontSize: 16, letterSpacing: 2 }] });
  assert.equal(rule.check(ctx).length, 1);
});

test('wide-tracking: ignores 0.5px tracking on 16px body (3%)', () => {
  const ctx = buildContext({ nodes: [{ id: 't', type: 'text', fontSize: 16, letterSpacing: 0.5 }] });
  assert.equal(rule.check(ctx).length, 0);
});

test('wide-tracking: ignores display-size text (>= 20px)', () => {
  const ctx = buildContext({ nodes: [{ id: 't', type: 'text', fontSize: 24, letterSpacing: 4 }] });
  assert.equal(rule.check(ctx).length, 0);
});

test('wide-tracking: ignores no letterSpacing', () => {
  const ctx = buildContext({ nodes: [{ id: 't', type: 'text', fontSize: 16 }] });
  assert.equal(rule.check(ctx).length, 0);
});
