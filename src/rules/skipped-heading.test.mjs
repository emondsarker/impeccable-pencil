import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './skipped-heading.mjs';
import { buildContext } from '../detect.mjs';

test('skipped-heading: flags H1 → H3 skip', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'sec', type: 'frame', children: ['h1', 'h3'] },
      { id: 'h1', type: 'text', fontSize: 56 },
      { id: 'h3', type: 'text', fontSize: 24 },
    ],
  });
  const f = rule.check(ctx);
  assert.equal(f.length, 1);
  assert.equal(f[0].nodeId, 'sec');
});

test('skipped-heading: passes H1 → H2 → H3', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'sec', type: 'frame', children: ['h1', 'h2', 'h3'] },
      { id: 'h1', type: 'text', fontSize: 56 },
      { id: 'h2', type: 'text', fontSize: 32 },
      { id: 'h3', type: 'text', fontSize: 24 },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('skipped-heading: passes H2 → H4 (user skipped into lower bands but consistent)', () => {
  // H2 32-47 + H4 18-23 gap — still flagged as skip since uniqueBands = [2, 4].
  const ctx = buildContext({
    nodes: [
      { id: 'sec', type: 'frame', children: ['h2', 'h4'] },
      { id: 'h2', type: 'text', fontSize: 32 },
      { id: 'h4', type: 'text', fontSize: 18 },
    ],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('skipped-heading: ignores section with only one heading band', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'sec', type: 'frame', children: ['t'] },
      { id: 't', type: 'text', fontSize: 24 },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});
