export function tryParseInt(string: string) {
  if (!isNaN(Number(string)) && string != null) {
    return Number.parseInt(string);
  }
  return null;
}

export function tryParseFloat(string: string) {
  if (!isNaN(Number(string)) && string != null) {
    return Number.parseFloat(string);
  }
  return null;
}
