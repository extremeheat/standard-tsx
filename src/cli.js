#!/usr/bin/env node
// bin/my-eslint.js

const { ESLint } = require('eslint')
const path = require('path')
const fs = require('fs')

async function main () {
  const args = process.argv.slice(2)
  const fixFlag = args.includes('--fix')
  // Remove the --fix flag from args if present
  const patterns = args.filter(arg => arg !== '--fix')

  // Default to current directory if no patterns provided
  if (patterns.length === 0) {
    patterns.push('.')
  }

  // Check for custom rules in the project's package.json
  let customRules = {}
  try {
    const projectPackageJson = path.join(process.cwd(), 'package.json')
    if (fs.existsSync(projectPackageJson)) {
      const pkg = require(projectPackageJson)
      if (pkg.eslintRules) {
        customRules = pkg.eslintRules
      }
    }
  } catch (error) {
    console.warn('Failed to load custom rules from package.json')
  }

  // Initialize ESLint with our config
  const eslint = new ESLint({
    overrideConfigFile: path.join(__dirname, './eslint.config.js'),
    fix: fixFlag,
    overrideConfig: {
      rules: customRules
    }
  })

  try {
    // Lint files
    const results = await eslint.lintFiles(patterns)

    // Apply fixes if --fix was specified
    if (fixFlag) {
      await ESLint.outputFixes(results)
    }

    // Format and output results
    const formatter = await eslint.loadFormatter('stylish')
    const resultText = formatter.format(results)
    console.log(resultText)

    // Determine exit code based on results
    const errorCount = results.reduce((count, result) => count + result.errorCount, 0)
    process.exitCode = errorCount > 0 ? 1 : 0
  } catch (error) {
    console.error('Error running ESLint:', error)
    process.exitCode = 1
  }
}

main()
