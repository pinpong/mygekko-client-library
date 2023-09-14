/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/errors',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  ignorePatterns: ['dist/*', '*.test.ts'],
  env: {
    es6: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowTypedFunctionExpressions: true },
    ],
    '@typescript-eslint/explicit-member-accessibility': ['error'],
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
};
