import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseHex, rgbToHsl, relativeLuminance, contrastRatio, resolveFill, sameHex } from './color.mjs';

test('parseHex: accepts 3, 6, 8-digit hexes', () => {
  assert.deepEqual(parseHex('#fff'), { r: 255, g: 255, b: 255 });
  assert.deepEqual(parseHex('#0a0a0f'), { r: 10, g: 10, b: 15 });
  assert.deepEqual(parseHex('#FFFFFFFF'), { r: 255, g: 255, b: 255 });
});

test('parseHex: rejects non-hex strings', () => {
  assert.equal(parseHex('red'), null);
  assert.equal(parseHex('linear-gradient(...)'), null);
  assert.equal(parseHex(null), null);
});

test('rgbToHsl: black, white, red, blue', () => {
  assert.equal(Math.round(rgbToHsl({ r: 0, g: 0, b: 0 }).l * 100), 0);
  assert.equal(Math.round(rgbToHsl({ r: 255, g: 255, b: 255 }).l * 100), 100);
  const red = rgbToHsl({ r: 255, g: 0, b: 0 });
  assert.equal(Math.round(red.h), 0);
  assert.ok(red.s > 0.99);
  const purple = rgbToHsl({ r: 147, g: 51, b: 234 });
  assert.ok(purple.h > 260 && purple.h < 290);
});

test('contrastRatio: white on black = 21', () => {
  const ratio = contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 });
  assert.equal(Math.round(ratio), 21);
});

test('contrastRatio: passes AA for #333 on white', () => {
  assert.ok(contrastRatio({ r: 51, g: 51, b: 51 }, { r: 255, g: 255, b: 255 }) > 4.5);
});

test('resolveFill: hex string', () => {
  assert.deepEqual(resolveFill('#0A0A0F'), { r: 10, g: 10, b: 15 });
});

test('resolveFill: variable ref resolves to hex', () => {
  assert.deepEqual(resolveFill('$ink', { ink: '#111111' }), { r: 17, g: 17, b: 17 });
});

test('resolveFill: rejects gradient object', () => {
  assert.equal(resolveFill({ type: 'linearGradient', stops: [] }), null);
});

test('sameHex: normalized comparison', () => {
  assert.ok(sameHex('#fff', '#FFFFFF'));
  assert.ok(!sameHex('#fff', '#000'));
});
