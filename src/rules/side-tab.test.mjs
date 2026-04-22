import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './side-tab.mjs';
import { buildContext } from '../detect.mjs';

test('side-tab: flags one-sided thick stroke on a frame', () => {
  const ctx = buildContext({
    nodes: [{ id: 'a', type: 'frame', stroke: { left: 4, right: 0, top: 0, bottom: 0 } }],
  });
  const findings = rule.check(ctx);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].nodeId, 'a');
  assert.match(findings[0].message, /left stroke of 4px/);
});

test('side-tab: ignores symmetric strokes', () => {
  const ctx = buildContext({
    nodes: [{ id: 'a', type: 'frame', stroke: { left: 4, right: 4, top: 4, bottom: 4 } }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('side-tab: ignores frames with no stroke', () => {
  const ctx = buildContext({
    nodes: [{ id: 'a', type: 'frame', fill: '$surface' }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('side-tab: ignores non-frame nodes even with one-sided stroke', () => {
  const ctx = buildContext({
    nodes: [{ id: 'a', type: 'text', stroke: { left: 4 } }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('side-tab: ignores hairline (<=1px) side strokes', () => {
  const ctx = buildContext({
    nodes: [{ id: 'a', type: 'frame', stroke: { left: 1, right: 0, top: 0, bottom: 0 } }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('side-tab: supports nested `thickness` object form', () => {
  const ctx = buildContext({
    nodes: [{ id: 'a', type: 'frame', stroke: { thickness: { left: 4, right: 0, top: 0, bottom: 0 } } }],
  });
  assert.equal(rule.check(ctx).length, 1);
});
