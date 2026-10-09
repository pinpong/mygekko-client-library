/**
 * Parse string to number.
 * @param string - The string to parse.
 */
export function tryParseInt(string: string | null | undefined): number | null {
  const number = tryParseFloat(string);
  // adding 0 turns -0 into 0
  return number === null ? null : Math.trunc(number) + 0;
}

/**
 * Parse string to number.
 * @param string - To parse.
 */
export function tryParseFloat(string: string | null | undefined): number | null {
  if (string == null || !string.trim().length) {
    return null;
  }
  const number = Number(string);
  return Number.isFinite(number) ? number : null;
}

/**
 * Rounds a command value to one decimal, the resolution of the myGEKKO device.
 * @param value - The value to round.
 */
export function roundCommandValue(value: number): number {
  return Math.round(value * 10) / 10;
}
