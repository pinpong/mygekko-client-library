import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';
import tsdoc from 'eslint-plugin-tsdoc';
import globals from 'globals';

export default [
  {
    ignores: ['dist/', 'docs/', '.yarn/', 'node_modules/'],
  },
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  { ...importPlugin.flatConfigs.errors, files: ['**/*.ts'] },
  prettier,
  {
    files: ['**/*.ts'],
    plugins: { tsdoc, jsdoc },
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
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
      '@typescript-eslint/no-unused-vars': ['error', { caughtErrors: 'none' }],
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-unresolved': ['error'],
      'no-undef': ['error'],
      'tsdoc/syntax': 'error',
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
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
