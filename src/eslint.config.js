const globals = require('globals')
const pluginJs = require('@eslint/js').configs
const tseslint = require('typescript-eslint')
const standard = require('eslint-config-standard')
const importPlugin = require('eslint-plugin-import')
const nPlugin = require('eslint-plugin-n')
const promisePlugin = require('eslint-plugin-promise')
const eslintEnvRestorePlugin = require('eslint-plugin-eslint-env-restore')
const reactPlugin = require('eslint-plugin-react')
const reactHooksPlugin = require('eslint-plugin-react-hooks')

const { collectIgnores, findNearestTsconfigDir } = require('./utils.js')
const ignorePatterns = collectIgnores()
const tsconfigRootDir = findNearestTsconfigDir()

const tsRules = {
  // TODO: Need stylistic
  // '@typescript-eslint/indent': ['error', 2],
  // '@typescript-eslint/semi': ['error', 'never'],
  // '@typescript-eslint/quotes': ['error', 'single'],
  // '@typescript-eslint/type-annotation-spacing': ['error']
}

module.exports = [
  { ignores: ignorePatterns },
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
      react: reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    processor: 'eslint-env-restore/js',
    rules: {
      ...pluginJs.recommended.rules,
      ...standard.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'no-unused-vars': ['error', { vars: 'local', args: 'none', caughtErrors: 'none', ignoreRestSiblings: true }],
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off'
    }
  },
  // TypeScript (Node.js environment)
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir
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
      // '@typescript-eslint/no-unused-vars': ['error', { vars: 'local', args: 'none', caughtErrors: 'none', ignoreRestSiblings: true }],
      ...tsRules
    }
  },
  // TSX (Browser environment)
  {
    files: ['**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir,
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
      react: reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    processor: 'eslint-env-restore/js',
    rules: {
      ...tseslint.configs.recommended.rules,
      ...standard.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'no-unused-vars': ['error', { vars: 'local', args: 'none', caughtErrors: 'none', ignoreRestSiblings: true }],
      // '@typescript-eslint/no-unused-vars': ['error', { vars: 'local', args: 'none', caughtErrors: 'none', ignoreRestSiblings: true }],
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off',
      ...tsRules
    }
  }
]
