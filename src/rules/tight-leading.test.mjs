import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './tight-leading.mjs';
import { buildContext } from '../detect.mjs';

test('tight-leading: flags 1.1 multiplier on body', () => {
  const ctx = buildContext({ nodes: [{ id: 't', type: 'text', fontSize: 16, lineHeight: 1.1 }] });
  assert.equal(rule.check(ctx).length, 1);
});

test('tight-leading: passes 1.4 multiplier', () => {
  const ctx = buildContext({ nodes: [{ id: 't', type: 'text', fontSize: 16, lineHeight: 1.4 }] });
  assert.equal(rule.check(ctx).length, 0);
});

test('tight-leading: px mode — 18px leading on 16px text = 1.125 → flag', () => {
  const ctx = buildContext({ nodes: [{ id: 't', type: 'text', fontSize: 16, lineHeight: 18 }] });
  assert.equal(rule.check(ctx).length, 1);
});

test('tight-leading: ignores display-sized text (>= 28px)', () => {
  const ctx = buildContext({ nodes: [{ id: 't', type: 'text', fontSize: 48, lineHeight: 1.1 }] });
  assert.equal(rule.check(ctx).length, 0);
});

test('tight-leading: ignores text without lineHeight', () => {
  const ctx = buildContext({ nodes: [{ id: 't', type: 'text', fontSize: 16 }] });
  assert.equal(rule.check(ctx).length, 0);
});
