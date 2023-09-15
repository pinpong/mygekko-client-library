/**
 * Parse string to number
 * @param {string} string the string to parse.
 * @returns {number | null} a parsed number
 */
export function tryParseInt(string: string): number | null {
  if (string != null && string.length && !isNaN(Number(string))) {
    return Number.parseInt(string);
  }
  return null;
}

/**
 * Parse string to number
 * @param {string}string the string to parse.
 @returns {number | null} a parsed number
 */
export function tryParseFloat(string: string): number | null {
  if (string != null && string.length && !isNaN(Number(string))) {
    return Number.parseFloat(string);
  }
  return null;
}
