/** @type {import("eslint")} */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/errors',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc', 'jsdoc'],
  root: true,
  env: {
    es6: true,
    jest: true,
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
    'import/no-unresolved': ['error'],
    'no-undef': ['error'],
    'tsdoc/syntax': 'error',
    'require-jsdoc': 'error',
    /// TODO: https://github.com/microsoft/tsdoc/issues/209
    'jsdoc/require-param': 'error',
    'jsdoc/require-param-description': 'error',
    'jsdoc/require-description': 'error',
    'jsdoc/require-param-name': 'error',
    'jsdoc/require-throws': 'error',
    'jsdoc/no-bad-blocks': 'error',
    'jsdoc/empty-tags': 'error',
    'jsdoc/require-jsdoc': 'error',
    'jsdoc/check-syntax': 1,
  },
};
