import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './line-length.mjs';
import { buildContext } from '../detect.mjs';

test('line-length: flags 1000px text @ 16px (≈125ch)', () => {
  const ctx = buildContext({
    nodes: [{
      id: 't', type: 'text', width: 1000, fontSize: 16,
      content: 'This is a body copy paragraph with enough words to count as real body text here today',
    }],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('line-length: passes 600px @ 16px (≈75ch)', () => {
  const ctx = buildContext({
    nodes: [{
      id: 't', type: 'text', width: 600, fontSize: 16,
      content: 'This is a body copy paragraph with enough words to count as real body text here today',
    }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('line-length: ignores short headline even if wide', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', width: 1200, fontSize: 48, content: 'Welcome back' }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('line-length: ignores fill_container (unknown width)', () => {
  const ctx = buildContext({
    nodes: [{
      id: 't', type: 'text', width: 'fill_container', fontSize: 16,
      content: 'This is a body copy paragraph with enough words to count as real body text',
    }],
  });
  assert.equal(rule.check(ctx).length, 0);
});
