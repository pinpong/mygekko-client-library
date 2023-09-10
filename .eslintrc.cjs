/* eslint-env node */
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  ignorePatterns: ["dist/*", "*.test.ts"],
  env: {
    node: true,
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      { allowTypedFunctionExpressions: true },
    ],
  },
};
