// ./eslint.config.js
const globals = require('globals')
const pluginJs = require('@eslint/js').configs
const tseslint = require('typescript-eslint')
const standard = require('eslint-config-standard')
const importPlugin = require('eslint-plugin-import')
const nPlugin = require('eslint-plugin-n')
const promisePlugin = require('eslint-plugin-promise')
const eslintEnvRestorePlugin = require('eslint-plugin-eslint-env-restore')

module.exports = [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...standard.globals
      }
    }
  },
  // JavaScript configs
  {
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
        require: 'readonly',
        module: 'writable',
        exports: 'writable'
      }
    },
    plugins: {
      'eslint-env-restore': eslintEnvRestorePlugin,
      import: importPlugin,
      n: nPlugin,
      promise: promisePlugin
    },
    processor: 'eslint-env-restore/js',
    rules: {
      ...pluginJs.recommended.rules,
      ...standard.rules,
      'no-unused-vars': ['error', { vars: 'local', args: 'none', caughtErrors: 'none', ignoreRestSiblings: true }]
    }
  },
  // TypeScript configs
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      'eslint-env-restore': eslintEnvRestorePlugin,
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
      n: nPlugin,
      promise: promisePlugin
    },
    processor: 'eslint-env-restore/js', // Uncomment if you add .ts support below
    rules: {
      // 'eslint-env-restore/restore-eslint-env': 'error',
      ...tseslint.configs.recommended.rules,
      ...standard.rules,
      'no-unused-vars': ['error', { vars: 'local', args: 'none', caughtErrors: 'none', ignoreRestSiblings: true }]
    }
  }
]
