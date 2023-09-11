import {
  decimalToHexColor,
  hexToDecimal,
  rgbToDecimal,
  rgbToHex,
  tunableWhiteToHex,
} from '../../src/utils/colorUtils';

const bitterSweet = {
  rgb: { r: 255, g: 100, b: 100 },
  hex: '#ff6464',
  decimal: 16737380,
};

const mintGreen = {
  rgb: { r: 124, g: 255, b: 135 },
  hex: '#7cff87',
  decimal: 8191879,
};

const darkBlue = {
  rgb: { r: 44, g: 1, b: 211 },
  hex: '#2c01d3',
  decimal: 2884051,
};

const indochine = {
  rgb: { r: 198, g: 111, b: 3 },
  hex: '#c66f03',
  decimal: 13004547,
};

const purple = {
  rgb: { r: 88, g: 4, b: 183 },
  hex: '#5804b7',
  decimal: 5768375,
};

test('tunableWhiteToHex', () => {
  expect(tunableWhiteToHex(0)).toBe('#ff0000');
  expect(tunableWhiteToHex(25)).toBe('#ff7f7f');
  expect(tunableWhiteToHex(50)).toBe('#ffffff');
  expect(tunableWhiteToHex(75)).toBe('#8080ff');
  expect(tunableWhiteToHex(100)).toBe('#0000ff');
});

test('rgbToHex', () => {
  expect(rgbToHex(bitterSweet.rgb.r, bitterSweet.rgb.g, bitterSweet.rgb.b)).toBe(bitterSweet.hex);
  expect(rgbToHex(mintGreen.rgb.r, mintGreen.rgb.g, mintGreen.rgb.b)).toBe(mintGreen.hex);
  expect(rgbToHex(darkBlue.rgb.r, darkBlue.rgb.g, darkBlue.rgb.b)).toBe(darkBlue.hex);
  expect(rgbToHex(indochine.rgb.r, indochine.rgb.g, indochine.rgb.b)).toBe(indochine.hex);
  expect(rgbToHex(purple.rgb.r, purple.rgb.g, purple.rgb.b)).toBe(purple.hex);
});

test('rgbToDecimal', () => {
  expect(rgbToDecimal(bitterSweet.rgb.r, bitterSweet.rgb.g, bitterSweet.rgb.b)).toBe(
    bitterSweet.decimal
  );
  expect(rgbToDecimal(mintGreen.rgb.r, mintGreen.rgb.g, mintGreen.rgb.b)).toBe(mintGreen.decimal);
  expect(rgbToDecimal(darkBlue.rgb.r, darkBlue.rgb.g, darkBlue.rgb.b)).toBe(darkBlue.decimal);
  expect(rgbToDecimal(indochine.rgb.r, indochine.rgb.g, indochine.rgb.b)).toBe(indochine.decimal);
  expect(rgbToDecimal(purple.rgb.r, purple.rgb.g, purple.rgb.b)).toBe(purple.decimal);
});

test('hexToDecimal', () => {
  expect(hexToDecimal(bitterSweet.hex)).toBe(bitterSweet.decimal);
  expect(hexToDecimal(mintGreen.hex)).toBe(mintGreen.decimal);
  expect(hexToDecimal(darkBlue.hex)).toBe(darkBlue.decimal);
  expect(hexToDecimal(indochine.hex)).toBe(indochine.decimal);
  expect(hexToDecimal(purple.hex)).toBe(purple.decimal);
});

test('decimalToHexColor', () => {
  expect(decimalToHexColor(bitterSweet.decimal)).toBe(bitterSweet.hex);
  expect(decimalToHexColor(mintGreen.decimal)).toBe(mintGreen.hex);
  expect(decimalToHexColor(darkBlue.decimal)).toBe(darkBlue.hex);
  expect(decimalToHexColor(indochine.decimal)).toBe(indochine.hex);
  expect(decimalToHexColor(purple.decimal)).toBe(purple.hex);
});
