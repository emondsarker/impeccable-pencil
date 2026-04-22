import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './text-overflow-hug.mjs';
import { buildContext } from '../detect.mjs';

test('text-overflow-hug: flags sentence-length text in a bounded parent without fixed-width', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', width: 'fill_container', children: ['t'] },
      {
        id: 't',
        type: 'text',
        content: 'Your health spending is tracking against the goal for this year',
        fontFamily: 'DM Sans',
        fontSize: 16,
      },
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
        content: 'Your health spending is tracking against the goal for this year',
        fontSize: 16,
        textGrowth: 'fixed-width',
      },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('text-overflow-hug: ignores short text (under 40 chars)', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', width: 'fill_container', children: ['t'] },
      { id: 't', type: 'text', content: 'Review receipt', fontSize: 16 },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('text-overflow-hug: ignores text whose parent is unbounded', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', children: ['t'] },
      {
        id: 't',
        type: 'text',
        content: 'Your health spending is tracking against the goal for this year',
        fontSize: 16,
      },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('text-overflow-hug: ignores eyebrow text with letterSpacing > 0', () => {
  // "MONDAY · APRIL 21 · 2026" — eyebrows don't wrap, even when token count is high.
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', width: 'fill_container', children: ['t'] },
      {
        id: 't',
        type: 'text',
        content: 'MONDAY · APRIL 21 · 2026 ANNUAL REPORT REVIEW',
        fontFamily: 'JetBrains Mono',
        fontSize: 11,
        letterSpacing: 2,
      },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('text-overflow-hug: ignores all-caps content (eyebrow style)', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', width: 'fill_container', children: ['t'] },
      {
        id: 't',
        type: 'text',
        content: 'ANNUAL HEALTH SPEND REPORT FOR THE FISCAL YEAR',
        fontSize: 16,
      },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('text-overflow-hug: ignores tiny-font metadata (< 14px)', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', width: 'fill_container', children: ['t'] },
      {
        id: 't',
        type: 'text',
        content: 'Submitted on April 18 by the claimant for review',
        fontSize: 12,
      },
    ],
  });
  assert.equal(rule.check(ctx).length, 0);
});

test('text-overflow-hug: accepts numeric fixed-width parent', () => {
  const ctx = buildContext({
    nodes: [
      { id: 'p', type: 'frame', width: 320, children: ['t'] },
      {
        id: 't',
        type: 'text',
        content: 'Your health spending is tracking against the goal for this year',
        fontSize: 16,
      },
    ],
  });
  assert.equal(rule.check(ctx).length, 1);
});
