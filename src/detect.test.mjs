import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { detect } from './detect.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const readFixture = (name) => JSON.parse(readFileSync(join(root, 'fixtures', name), 'utf8'));

test('detect: fixtures/clean.json produces zero findings', () => {
  const findings = detect(readFixture('clean.json'));
  assert.equal(findings.length, 0, `expected 0 findings, got ${findings.length}:\n${JSON.stringify(findings, null, 2)}`);
});

test('detect: fixtures/slop.json fires every rule the fixture is designed to trigger', () => {
  const findings = detect(readFixture('slop.json'));
  const firedRules = new Set(findings.map((f) => f.ruleId));

  const expected = new Set([
    'absolute-negative-offset',
    'side-tab',
    'overused-font',
    'nested-cards',
  ]);

  for (const id of expected) {
    assert.ok(firedRules.has(id), `expected rule "${id}" to fire on slop fixture`);
  }
});

test('detect: slop fixture includes a P0 severity', () => {
  const findings = detect(readFixture('slop.json'));
  assert.ok(findings.some((f) => f.severity === 'P0'), 'slop fixture should include at least one P0 finding');
});

test('detect: every finding has a nodeId and a message', () => {
  const findings = detect(readFixture('slop.json'));
  for (const f of findings) {
    assert.ok(f.nodeId, `finding missing nodeId: ${JSON.stringify(f)}`);
    assert.ok(f.message, `finding missing message: ${JSON.stringify(f)}`);
    assert.ok(f.severity, `finding missing severity: ${JSON.stringify(f)}`);
    assert.ok(f.ruleId, `finding missing ruleId: ${JSON.stringify(f)}`);
  }
});

test('detect: rule exceptions are caught and surfaced, not thrown', () => {
  // Feed malformed input — some rules may trip, but detect() must not throw.
  const findings = detect({
    nodes: [{ id: 'weird', type: null, fill: undefined, children: ['nonexistent'] }],
  });
  assert.ok(Array.isArray(findings));
});
