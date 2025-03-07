// ./eslint.config.js
const globals = require('globals')
const pluginJs = require('@eslint/js').configs
const tseslint = require('typescript-eslint')
const standard = require('eslint-config-standard')
const importPlugin = require('eslint-plugin-import')
const nPlugin = require('eslint-plugin-n')
const promisePlugin = require('eslint-plugin-promise')
const eslintEnvRestorePlugin = require('eslint-plugin-eslint-env-restore')
const reactPlugin = require('eslint-plugin-react') // Added React plugin
const reactHooksPlugin = require('eslint-plugin-react-hooks') // Added React Hooks plugin

module.exports = [
  {
    languageOptions: {
      globals: {
        ...standard.globals,
        ...globals.es2021
      }
    }
  },
  // JavaScript (Node.js environment)
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
  // JSX (Browser environment)
  {
    files: ['**/*.jsx'],
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      'eslint-env-restore': eslintEnvRestorePlugin,
      import: importPlugin,
      n: nPlugin,
      promise: promisePlugin,
      react: reactPlugin, // Added React plugin
      'react-hooks': reactHooksPlugin // Added React Hooks plugin
    },
    processor: 'eslint-env-restore/js',
    rules: {
      ...pluginJs.recommended.rules,
      ...standard.rules,
      ...reactPlugin.configs.recommended.rules, // React recommended rules
      ...reactHooksPlugin.configs.recommended.rules, // React Hooks recommended rules
      'no-unused-vars': ['error', { vars: 'local', args: 'none', caughtErrors: 'none', ignoreRestSiblings: true }],
      'react/jsx-uses-react': 'off', // Disabled for React 17+
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off' // Disabled for React 17+
    }
  },
  // TypeScript (Node.js environment)
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json'
      },
      globals: {
        ...globals.node
      }
    },
    plugins: {
      'eslint-env-restore': eslintEnvRestorePlugin,
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
      n: nPlugin,
      promise: promisePlugin
    },
    processor: 'eslint-env-restore/js',
    rules: {
      ...tseslint.configs.recommended.rules,
      ...standard.rules,
      'no-unused-vars': ['error', { vars: 'local', args: 'none', caughtErrors: 'none', ignoreRestSiblings: true }],
      '@typescript-eslint/no-unused-vars': ['error', { vars: 'local', args: 'none', caughtErrors: 'none', ignoreRestSiblings: true }]
    }
  },
  // TSX (Browser environment)
  {
    files: ['**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      'eslint-env-restore': eslintEnvRestorePlugin,
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
      n: nPlugin,
      promise: promisePlugin,
      react: reactPlugin, // Added React plugin
      'react-hooks': reactHooksPlugin // Added React Hooks plugin
    },
    processor: 'eslint-env-restore/js',
    rules: {
      ...tseslint.configs.recommended.rules,
      ...standard.rules,
      ...reactPlugin.configs.recommended.rules, // React recommended rules
      ...reactHooksPlugin.configs.recommended.rules, // React Hooks recommended rules
      'no-unused-vars': ['error', { vars: 'local', args: 'none', caughtErrors: 'none', ignoreRestSiblings: true }],
      '@typescript-eslint/no-unused-vars': ['error', { vars: 'local', args: 'none', caughtErrors: 'none', ignoreRestSiblings: true }],
      'react/jsx-uses-react': 'off', // Disabled for React 17+
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off' // Disabled for React 17+
    }
  }
]
