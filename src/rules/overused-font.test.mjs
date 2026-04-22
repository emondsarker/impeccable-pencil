import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './overused-font.mjs';
import { buildContext } from '../detect.mjs';

test('overused-font: flags Inter', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', fontFamily: 'Inter', content: 'hi' }],
  });
  const f = rule.check(ctx);
  assert.equal(f.length, 1);
  assert.equal(f[0].nodeId, 't');
});

test('overused-font: flags is case-insensitive', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', fontFamily: 'ROBOTO', content: 'hi' }],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('overused-font: passes distinctive brand fonts', () => {
  const ctx = buildContext({
    nodes: [
      { id: 't1', type: 'text', fontFamily: 'DM Sans', content: 'hi' },
      { id: 't2', type: 'text', fontFamily: 'Instrument Serif', content: 'hero' },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('overused-font: ignores non-text nodes', () => {
  const ctx = buildContext({
    nodes: [{ id: 'f', type: 'frame', fontFamily: 'Inter' }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('overused-font: ignores text without fontFamily', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', content: 'hi' }],
  });
  assert.equal(rule.check(ctx).length, 0);
});
