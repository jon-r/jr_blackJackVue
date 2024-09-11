import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";

// todo strictest typescript? https://gist.github.com/dilame/32709f16e3f8d4d64b596f5b19d812e1?permalink_comment_id=4708061#gistcomment-4708061
export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    files: ["**/*.js"],
    ...tseslint.configs.disableTypeChecked,
  },
  ...pluginVue.configs["flat/recommended"],
  {
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        projectService: true,
        extraFileExtensions: [".vue"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintConfigPrettier,
];
