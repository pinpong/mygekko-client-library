/** @type {import("prettier")} */
module.exports = {
  trailingComma: 'es5',
  semi: true,
  singleQuote: true,
  printWidth: 100,
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
  importOrder: ['^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
};
