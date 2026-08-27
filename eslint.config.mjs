import js from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**'] },

  js.configs.recommended,

  {
    // Правила, требующие информации о типах, включаем только для исходников:
    // конфиги в .mjs не входят в tsconfig, и парсер по ним споткнётся.
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  prettierRecommended,
);
