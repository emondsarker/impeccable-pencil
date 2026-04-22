import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './justified-text.mjs';
import { buildContext } from '../detect.mjs';

test('justified-text: flags justified alignment', () => {
  const ctx = buildContext({ nodes: [{ id: 't', type: 'text', textAlign: 'justify', content: 'x' }] });
  assert.equal(rule.check(ctx).length, 1);
});

test('justified-text: ignores left, center, right', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'a', type: 'text', textAlign: 'left' },
      { id: 'b', type: 'text', textAlign: 'center' },
      { id: 'c', type: 'text', textAlign: 'right' },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});
