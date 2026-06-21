/* global describe, it */

const assert = require('node:assert')
const nPlugin = require('eslint-plugin-n')
const config = require('../src/eslint.config.js')

describe('eslint config', () => {
  it('wraps eslint-plugin-n rules for ESLint v9 compatibility', () => {
    const configsWithNPlugin = config.filter(entry => entry.plugins?.n)
    assert.ok(configsWithNPlugin.length > 0)

    for (const entry of configsWithNPlugin) {
      assert.notStrictEqual(entry.plugins.n.rules['handle-callback-err'], nPlugin.rules['handle-callback-err'])
    }
  })
})
