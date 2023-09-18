module.exports = {
  '**/*.ts?(x)': () => 'yarn tsc --noEmit',
  '*.{cjs,js,ts,json,md}': ['yarn format'],
  '*.{cjs,md}': [() => 'yarn lint'],
};
