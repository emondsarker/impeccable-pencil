import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './everything-centered.mjs';
import { buildContext } from '../detect.mjs';

test('everything-centered: flags when 6/7 text nodes are centered', () => {
  const nodes = [];
  for (let i = 0; i < 6; i++) nodes.push({ id: `c${i}`, type: 'text', textAlign: 'center' });
  nodes.push({ id: 'l', type: 'text', textAlign: 'left' });
  const f = rule.check(buildContext({ nodes }));
  assert.equal(f.length, 1);
  assert.equal(f[0].nodeId, null);
});

test('everything-centered: ignores small sample (<5)', () => {
  const nodes = [
    { id: 'a', type: 'text', textAlign: 'center' },
    { id: 'b', type: 'text', textAlign: 'center' },
    { id: 'c', type: 'text', textAlign: 'center' },
  ];
  assert.equal(rule.check(buildContext({ nodes })).length, 0);
});

test('everything-centered: ignores balanced alignment', () => {
  const nodes = [];
  for (let i = 0; i < 5; i++) nodes.push({ id: `l${i}`, type: 'text', textAlign: 'left' });
  for (let i = 0; i < 3; i++) nodes.push({ id: `c${i}`, type: 'text', textAlign: 'center' });
  assert.equal(rule.check(buildContext({ nodes })).length, 0);
});

test('everything-centered: ignores text without explicit textAlign', () => {
  const nodes = [];
  for (let i = 0; i < 10; i++) nodes.push({ id: `n${i}`, type: 'text' });
  assert.equal(rule.check(buildContext({ nodes })).length, 0);
});
