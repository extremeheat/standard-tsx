const path = require('node:path')
const fs = require('node:fs')
const glob = require('glob')

function collectIgnores () {
  // Find all .gitignore files in the project (upto 2 levels up for monorepo support)
  const gitignoreFiles = glob.sync('**/.gitignore', { cwd: process.cwd() })
  if (gitignoreFiles.length === 0) {
    gitignoreFiles.push(...glob.sync('**/.gitignore', { cwd: path.join(process.cwd(), '..') }).map(file => path.join('..', file)))
    if (gitignoreFiles.length === 0) {
      gitignoreFiles.push(...glob.sync('**/.gitignore', { cwd: path.join(process.cwd(), '../..') }).map(file => path.join('..', '..', file)))
    }
  }

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
      let rule = path.join(dir, line).replaceAll('\\', '/')
      if (rule.startsWith('..//')) continue // a rule intended for a parent directory
      // rules that don't start with slash apply to all directories
      rule = rule.replaceAll('../', '')
      // mimic .gitignore behavior as ESlint is a bit different and doesn't recursively apply rules
      if (!rule.startsWith('/') || !rule.startsWith('./') || !rule.startsWith('*')) rule = '**/' + rule
      // Restore ordering of ! to front after above transformation
      if (line.startsWith('!')) rule = '!' + rule.replaceAll('!', '')
      ignorePatterns.push(rule)
    }
  }

  return ignorePatterns
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

module.exports = { collectIgnores, findNearestTsconfigDir }
