/**
 * Parse string to number.
 * @param string - The string to parse.
 */
export function tryParseInt(string: string): number | null {
  if (string != null && string.length && !isNaN(Number(string))) {
    return Number.parseInt(string);
  }
  return null;
}

/**
 * Parse string to number.
 * @param string - To parse.
 */
export function tryParseFloat(string: string): number | null {
  if (string != null && string.length && !isNaN(Number(string))) {
    return Number.parseFloat(string);
  }
  return null;
}
