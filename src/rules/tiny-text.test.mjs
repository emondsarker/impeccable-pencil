import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './tiny-text.mjs';
import { buildContext } from '../detect.mjs';

test('tiny-text: flags 10px body-length text', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', fontSize: 10, content: 'Submitted on April 18 by claimant' }],
  });
  const f = rule.check(ctx);
  assert.equal(f.length, 1);
  assert.equal(f[0].nodeId, 't');
});

test('tiny-text: ignores short labels even if small', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', fontSize: 10, content: 'New' }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('tiny-text: ignores 12px+ text', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', fontSize: 14, content: 'Submitted on April 18 by claimant' }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('tiny-text: ignores nodes without fontSize', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', content: 'Submitted on April 18 by claimant' }],
  });
  assert.equal(rule.check(ctx).length, 0);
});
