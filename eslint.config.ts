// @ts-check
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import eslintPluginAstro from "eslint-plugin-astro";

const config = defineConfig([
  globalIgnores([".astro", "dist"]),
  {
    files: ["**/*.ts"],
    extends: [
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      eslintPluginAstro.configs.recommended,
      prettierRecommended,
    ],
    rules: {
      "@typescript-eslint/array-type": ["warn"],
      "@typescript-eslint/consistent-indexed-object-style": "off",
      "@typescript-eslint/consistent-type-assertions": "warn",
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "no-public",
        },
      ],
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
        },
      ],
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-inferrable-types": "warn",
      "@typescript-eslint/no-shadow": "warn",
      "@typescript-eslint/no-unused-vars": "warn",

      eqeqeq: "error",
      complexity: ["error", 20],
      curly: "error",
      "guard-for-in": "error",
      "max-classes-per-file": ["error", 1],
      "max-len": [
        "warn",
        {
          code: 120,
          comments: 160,
        },
      ],
      "max-lines": ["error", 200],
      "no-bitwise": "error",
      "no-console": "off",
      "no-new-wrappers": "error",
      "no-useless-concat": "error",
      "no-var": "error",
      "no-restricted-syntax": "off",
      "no-shadow": "error",
      "one-var": ["error", "never"],
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "sort-imports": [
        "error",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          allowSeparatedGroups: true,
        },
      ],

      "no-eval": "error",
      "no-implied-eval": "error",
    },
  },
  {
    files: ["**/*.html"],
    extends: [prettierRecommended],
    rules: {},
  },
]);

export default config;
