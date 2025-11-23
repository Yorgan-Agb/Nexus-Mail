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
      // Semicolons
      'semi': ['error', 'always'],
      '@typescript-eslint/semi': ['error', 'always'],

      // Trailing commas
      'comma-dangle': ['error', 'always-multiline'],

      // Quotes
      'quotes': ['error', 'single', { avoidEscape: true }],

      // Indentation
      'indent': ['error', 2],

      // End of line
      'eol-last': ['error', 'always'],

      // TypeScript specific
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-types': ['warn'],
      '@typescript-eslint/no-explicit-any': 'warn',

      // General
      'no-console': 'warn',
    },
  },
];