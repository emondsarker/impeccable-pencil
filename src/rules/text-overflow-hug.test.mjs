import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './text-overflow-hug.mjs';
import { buildContext } from '../detect.mjs';

test('text-overflow-hug: flags sentence-length text in a bounded parent without fixed-width', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', width: 'fill_container', children: ['t'] },
      { id: 't', type: 'text', content: 'this is a sentence with several words in it', fontFamily: 'DM Sans' },
    ],
  });
  const f = rule.check(ctx);
  assert.equal(f.length, 1);
  assert.equal(f[0].nodeId, 't');
});

test('text-overflow-hug: passes when textGrowth is fixed-width', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', width: 'fill_container', children: ['t'] },
      {
        id: 't',
        type: 'text',
        content: 'this is a sentence with several words in it',
        textGrowth: 'fixed-width',
      },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('text-overflow-hug: ignores short text (< 5 words)', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', width: 'fill_container', children: ['t'] },
      { id: 't', type: 'text', content: 'Short label' },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('text-overflow-hug: ignores text whose parent is unbounded', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', children: ['t'] },
      { id: 't', type: 'text', content: 'this is a sentence with several words' },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('text-overflow-hug: accepts numeric fixed-width parent', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', width: 320, children: ['t'] },
      { id: 't', type: 'text', content: 'this is a sentence with several words in it' },
    ],
  });
  assert.equal(rule.check(ctx).length, 1);
});
