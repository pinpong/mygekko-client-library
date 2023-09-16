module.exports = {
  '*.{cjs,js,ts,json,md}': ['yarn format'],
  '*.{cjs,md}': [() => 'yarn lint'],
};
