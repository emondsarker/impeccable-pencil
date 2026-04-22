import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './long-italic-serif.mjs';
import { buildContext } from '../detect.mjs';

test('long-italic-serif: flags 8-word italic Instrument Serif', () => {
  const ctx = buildContext({
    nodes: [{
      id: 't', type: 'text', fontStyle: 'italic', fontFamily: 'Instrument Serif',
      content: 'Your quiet progress is the thing worth noticing today.',
    }],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('long-italic-serif: ignores 3-word italic display (short)', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', fontStyle: 'italic', fontFamily: 'Fraunces', content: 'small wins' }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('long-italic-serif: ignores italic DM Sans (not serif)', () => {
  const ctx = buildContext({
    nodes: [{
      id: 't', type: 'text', fontStyle: 'italic', fontFamily: 'DM Sans',
      content: 'Your quiet progress is the thing worth noticing today.',
    }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('long-italic-serif: ignores upright serif (not italic)', () => {
  const ctx = buildContext({
    nodes: [{
      id: 't', type: 'text', fontFamily: 'Instrument Serif',
      content: 'Your quiet progress is the thing worth noticing today.',
    }],
  });
  assert.equal(rule.check(ctx).length, 0);
});
