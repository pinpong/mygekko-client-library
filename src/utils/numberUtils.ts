export function tryParseInt(string: string): number | null {
  if (!isNaN(Number(string)) && string != null) {
    return Number.parseInt(string);
  }
  return null;
}

export function tryParseFloat(string: string): number | null {
  if (!isNaN(Number(string)) && string != null) {
    return Number.parseFloat(string);
  }
  return null;
}
