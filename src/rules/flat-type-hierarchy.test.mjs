import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './flat-type-hierarchy.mjs';
import { buildContext } from '../detect.mjs';

test('flat-type-hierarchy: flags 14/15/16 cluster', () => {
  const nodes = [
    { id: 'a', type: 'text', fontSize: 14 },
    { id: 'b', type: 'text', fontSize: 15 },
    { id: 'c', type: 'text', fontSize: 16 },
  ];
  assert.equal(rule.check(buildContext({ nodes })).length, 1);
});

test('flat-type-hierarchy: passes on 1.25 scale', () => {
  const nodes = [
    { id: 'a', type: 'text', fontSize: 14 },
    { id: 'b', type: 'text', fontSize: 18 },
    { id: 'c', type: 'text', fontSize: 24 },
    { id: 'd', type: 'text', fontSize: 36 },
  ];
  assert.equal(rule.check(buildContext({ nodes })).length, 0);
});

test('flat-type-hierarchy: ignores fewer than 3 distinct sizes', () => {
  const nodes = [
    { id: 'a', type: 'text', fontSize: 14 },
    { id: 'b', type: 'text', fontSize: 15 },
  ];
  assert.equal(rule.check(buildContext({ nodes })).length, 0);
});
