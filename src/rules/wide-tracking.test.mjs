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

test('wide-tracking: ignores all-caps content (eyebrow)', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', fontSize: 11, letterSpacing: 1.6, content: 'WELCOME TO OCEAN' }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('wide-tracking: ignores textTransform: uppercase', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', fontSize: 11, letterSpacing: 1.6, content: 'welcome to ocean', textTransform: 'uppercase' }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('wide-tracking: ignores mono fontFamily (JetBrains Mono)', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', fontSize: 13, letterSpacing: 1.6, fontFamily: 'JetBrains Mono', content: 'HSA' }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('wide-tracking: still flags sentence-case body with wide tracking', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', fontSize: 14, letterSpacing: 2, fontFamily: 'DM Sans', content: 'This is body copy with wide tracking' }],
  });
  assert.equal(rule.check(ctx).length, 1);
});
