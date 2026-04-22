import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './single-font.mjs';
import { buildContext } from '../detect.mjs';

test('single-font: flags when all 6 text nodes share a family', () => {
  const nodes = [];
  for (let i = 0; i < 6; i++) nodes.push({ id: `t${i}`, type: 'text', fontFamily: 'DM Sans' });
  assert.equal(rule.check(buildContext({ nodes })).length, 1);
});

test('single-font: passes when two families are present', () => {
  const nodes = [];
  for (let i = 0; i < 4; i++) nodes.push({ id: `t${i}`, type: 'text', fontFamily: 'DM Sans' });
  for (let i = 0; i < 2; i++) nodes.push({ id: `s${i}`, type: 'text', fontFamily: 'Instrument Serif' });
  assert.equal(rule.check(buildContext({ nodes })).length, 0);
});

test('single-font: ignores small samples (< 5 text nodes)', () => {
  const nodes = [];
  for (let i = 0; i < 3; i++) nodes.push({ id: `t${i}`, type: 'text', fontFamily: 'DM Sans' });
  assert.equal(rule.check(buildContext({ nodes })).length, 0);
});
