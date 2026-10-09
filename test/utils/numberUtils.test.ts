import {
  roundCommandValue,
  tryParseFloat,
  tryParseInt,
} from '../../src/utils/extensions/numberUtils';

test('tryParseInt', () => {
  expect(tryParseInt('Test')).toBe(null);
  expect(tryParseInt('12084')).toBe(12084);
  expect(tryParseInt('12084F')).toBe(null);
  expect(tryParseInt('10.00')).toBe(10);
});

test('tryParseFloat', () => {
  expect(tryParseFloat('Test')).toBe(null);
  expect(tryParseFloat('12084')).toBe(12084);
  expect(tryParseFloat('12084F')).toBe(null);
  expect(tryParseFloat('10.001')).toBe(10.001);
});

test('roundCommandValue', () => {
  expect(roundCommandValue(21.6 + 0.1)).toBe(21.7);
  expect(roundCommandValue(22.449)).toBe(22.4);
  expect(roundCommandValue(22.45)).toBe(22.5);
  expect(roundCommandValue(-2.44)).toBe(-2.4);
  expect(roundCommandValue(50)).toBe(50);
});
