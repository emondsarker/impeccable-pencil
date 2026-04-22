import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './gradient-text.mjs';
import { buildContext } from '../detect.mjs';

test('gradient-text: flags linearGradient object fill', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', fill: { type: 'linearGradient', stops: [{ offset: 0, color: '#fff' }] } }],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('gradient-text: flags CSS-string gradient fill', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', fill: 'linear-gradient(90deg, #f00, #00f)' }],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('gradient-text: ignores solid hex fill', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', fill: '#0A0A0F' }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('gradient-text: resolves gradient token via variables', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', fill: '$brandGradient' }],
    variables: { brandGradient: { type: 'linearGradient', stops: [] } },
  });
  assert.equal(rule.check(ctx).length, 1);
});
