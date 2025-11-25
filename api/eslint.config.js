import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    rules: {
      'semi': ['error', 'always'],
      '@typescript-eslint/semi': ['error', 'always'],

      'comma-dangle': ['error', 'always-multiline'],

      'quotes': ['error', 'single', { avoidEscape: true }],

      'indent': ['error', 2],

      'eol-last': ['error', 'always'],

      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-types': ['warn'],
      '@typescript-eslint/no-explicit-any': 'warn',

      'no-console': 'warn',
    },
  },
];