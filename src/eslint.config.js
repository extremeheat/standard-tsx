// ./eslint.config.js
const path = require('node:path')
const fs = require('node:fs')

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
const glob = require('glob')

// Find all .gitignore files in the project
const gitignoreFiles = glob.sync('**/.gitignore', { cwd: process.cwd() })

// Sort by directory depth (root to leaves) to match Git's override behavior
const sortedGitignoreFiles = gitignoreFiles.sort((a, b) => {
  const depthA = a.split(path.sep).length
  const depthB = b.split(path.sep).length
  return depthA - depthB
})

// Merge ignore patterns from all .gitignore files
const ignorePatterns = []
for (const file of sortedGitignoreFiles) {
  const dir = path.dirname(file)
  const content = fs.readFileSync(file, 'utf8')
  const lines = content.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'))
  for (const line of lines) {
    if (line.startsWith('!')) {
      ignorePatterns.push('!' + path.join(dir, line.slice(1)))
    } else {
      ignorePatterns.push(path.join(dir, line))
    }
  }
}

function findNearestTsconfigDir (startDir = process.cwd()) {
  let currentDir = path.resolve(startDir)

  while (true) {
    const tsconfigPath = path.join(currentDir, 'tsconfig.json')
    if (fs.existsSync(tsconfigPath)) {
      return currentDir
    }

    const parentDir = path.dirname(currentDir)
    if (parentDir === currentDir) {
      // Reached filesystem root
      break
    }
    currentDir = parentDir
  }
  return null
}
const tsconfigRootDir = findNearestTsconfigDir()

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
      '@typescript-eslint/no-unused-vars': ['error', { vars: 'local', args: 'none', caughtErrors: 'none', ignoreRestSiblings: true }],
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off'
    }
  }
]
