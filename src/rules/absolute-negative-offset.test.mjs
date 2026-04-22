import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './absolute-negative-offset.mjs';
import { buildContext } from '../detect.mjs';

test('absolute-negative-offset: flags absolute node with negative x', () => {
  const ctx = buildContext({
    nodes: [{ id: 'g', type: 'text', layoutPosition: 'absolute', x: -12, y: 0 }],
  });
  const f = rule.check(ctx);
  assert.equal(f.length, 1);
  assert.equal(f[0].nodeId, 'g');
  assert.equal(f[0].severity, undefined, 'severity comes from the rule default, applied in detect()');
});

test('absolute-negative-offset: flags absolute node with negative y', () => {
  const ctx = buildContext({
    nodes: [{ id: 'g', type: 'text', layoutPosition: 'absolute', x: 0, y: -32 }],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('absolute-negative-offset: ignores absolute nodes at positive coords', () => {
  const ctx = buildContext({
    nodes: [{ id: 'g', type: 'text', layoutPosition: 'absolute', x: 12, y: 32 }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('absolute-negative-offset: ignores non-absolute nodes even at negative coords', () => {
  const ctx = buildContext({
    nodes: [{ id: 'g', type: 'text', x: -12, y: 0 }],
  });
  assert.equal(rule.check(ctx).length, 0);
});
