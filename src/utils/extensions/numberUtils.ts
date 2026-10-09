/**
 * Parse string to number.
 * @param string - The string to parse.
 */
export function tryParseInt(string: string | null | undefined): number | null {
  if (string != null && string.length && !isNaN(Number(string))) {
    return Number.parseInt(string);
  }
  return null;
}

/**
 * Parse string to number.
 * @param string - To parse.
 */
export function tryParseFloat(string: string | null | undefined): number | null {
  if (string != null && string.length && !isNaN(Number(string))) {
    return Number.parseFloat(string);
  }
  return null;
}

/**
 * Rounds a command value to one decimal, the resolution of the myGEKKO device.
 * @param value - The value to round.
 */
export function roundCommandValue(value: number): number {
  return Math.round(value * 10) / 10;
}
