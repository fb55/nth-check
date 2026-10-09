import { includeIgnoreFile } from "@eslint/compat";
import feedicFlatConfig from "@feedic/eslint-config";
import { commonTypeScriptRules } from "@feedic/eslint-config/typescript";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import { fileURLToPath } from "node:url";
import eslintConfigBiome from "eslint-config-biome";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
    includeIgnoreFile(gitignorePath),
    {
        linterOptions: {
            reportUnusedDisableDirectives: "error",
        },
    },
    {
        ignores: ["eslint.config.{js,cjs,mjs}"],
    },
    ...feedicFlatConfig,
    {
        files: ["**/*.ts"],
        extends: [...tseslint.configs.recommended],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                sourceType: "module",
                project: "./tsconfig.eslint.json",
            },
        },
        rules: {
            ...commonTypeScriptRules,
        },
    },
    eslintConfigBiome,
    // Retain the conventional fixture directory while checking other names.
    {
      files: ["src/__fixtures__/rules.ts"],
      rules: {
        "unicorn/filename-case": [
          "error",
          {
            ignore: ["^__fixtures__$"],
          },
        ],
      },
    },
]);
