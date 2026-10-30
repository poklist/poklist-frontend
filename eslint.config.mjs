import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tseslint.config(
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
  }),
  { ignores: ['dist', 'node_modules', 'eslint.config.js'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      prettier: eslintPluginPrettierRecommended,
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // import 一律用 @/ 絕對路徑（ARCHITECTURE §15）
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./*', '../*'],
              message: 'Use the @/ absolute path instead of a relative path.',
            },
          ],
        },
      ],
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
    },
    settings: {
      react: { version: '18.3' },
    },
  },
  {
    // barrel 檔的 export * from './x' 保留相對路徑
    files: ['src/api/contracts/index.ts', 'src/api/schemas/index.ts'],
    rules: { 'no-restricted-imports': 'off' },
  }
);
