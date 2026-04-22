import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './all-caps-body.mjs';
import { buildContext } from '../detect.mjs';

test('all-caps-body: flags long uppercase content', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', content: 'YOUR CLAIM HAS BEEN RECEIVED AND WILL BE REVIEWED SOON' }],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('all-caps-body: flags textTransform uppercase with long content', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', content: 'your claim has been received and will be reviewed', textTransform: 'uppercase' }],
  });
  assert.equal(rule.check(ctx).length, 1);
});

test('all-caps-body: ignores short eyebrows', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', content: 'NEW CLAIM' }],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('all-caps-body: ignores sentence-case long text', () => {
  const ctx = buildContext({
    nodes: [{ id: 't', type: 'text', content: 'Your claim has been received and will be reviewed soon.' }],
  });
  assert.equal(rule.check(ctx).length, 0);
});
