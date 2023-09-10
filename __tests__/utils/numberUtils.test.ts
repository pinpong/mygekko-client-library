import { tryParseFloat, tryParseInt } from "../../lib/utils/numberUtils";

test("tryParseInt", () => {
  expect(tryParseInt("Test")).toBe(null);
  expect(tryParseInt("12084")).toBe(12084);
  expect(tryParseInt("12084F")).toBe(null);
  expect(tryParseInt("10.00")).toBe(10);
});

test("tryParseFloat", () => {
  expect(tryParseFloat("Test")).toBe(null);
  expect(tryParseFloat("12084")).toBe(12084);
  expect(tryParseFloat("12084F")).toBe(null);
  expect(tryParseFloat("10.001")).toBe(10.001);
});
