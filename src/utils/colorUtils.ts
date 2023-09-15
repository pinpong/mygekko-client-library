/**
 * Calculates the color from tunable white level
 * @param {number} value the tunable white level
 * @returns {string} a hex color
 */
export function tunableWhiteToHex(value: number): string {
  let r: number, g: number, b: number;
  if (value < 50) {
    r = 255;
    g = Math.round(5.1 * value);
    b = Math.round(5.1 * value);
  } else {
    r = Math.round(510 - 5.1 * value);
    g = Math.round(510 - 5.1 * value);
    b = 255;
  }
  return rgbToHex(r, g, b);
}

/**
 * Calculates the hex color from rgb color
 * @param {number} r the 24 bits red color
 * @param {number} g the 24 bits green color
 * @param {number} b the 24 bits blue color
 * @returns {string} a hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

/**
 * Calculates the decimal color from rgb color
 * @param {number} r the 24 bits red color
 * @param {number} g the 24 bits green color
 * @param {number} b the 24 bits blue color
 * @returns {number} a decimal color
 */
export function rgbToDecimal(r: number, g: number, b: number): number {
  return (r << 16) + (g << 8) + b;
}

/**
 * Calculates decimal color from hex color
 * @param {string} hex the hex color
 * @returns {number} a decimal color
 */
export function hexToDecimal(hex: string): number {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return (r << 16) + (g << 8) + b;
}

/**
 * Calculates the hex color from decimal color
 * @param {number} decimal the decimal color
 * @returns {string} a hex color
 */
export function decimalToHexColor(decimal: number): string {
  const r = (decimal >> 16) & 0xff;
  const g = (decimal >> 8) & 0xff;
  const b = decimal & 0xff;
  return rgbToHex(r, g, b);
}
