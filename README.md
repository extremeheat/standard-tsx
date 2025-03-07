# standard-ts
[![NPM version](https://img.shields.io/npm/v/standard-ts.svg)](http://npmjs.com/package/standard-ts)
[![Build Status](https://github.com/extremeheat/standard-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/extremeheat/standard-ts/actions/workflows/)
[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/extremeheat/standard-ts)

A drop-in replacement for the `standard` JavaScript linter that supports TypeScript and JavaScript. This package does not
add any new rules. Instead, it applies standard's eslint config (https://github.com/standard/eslint-config-standard) to both `*.ts` and `*.js`/`.cjs`/`.mjs` files on top of ESLint's default TypeScript reccomendations (which are mostly non-style related):

>Recommended rules for code correctness that you can drop in without additional configuration. These rules are those whose reports are almost always for a bad practice and/or likely bug. recommended also disables core ESLint rules known to conflict with typescript-eslint rules or cause issues in TypeScript codebases.

## Install
```
npm install standard-ts
```

## Usage

To run against the current directory (analogus to `npx eslint .`):

```
npx standard-ts
```

Or to fix
```
npx standard-ts --fix
```

In package.json run scripts, you can add the following as aliases (which will run in context of your repo root):
```json
  "scripts": {
    "lint": "standard-ts",
    "fix": "standard-ts --fix"
  },
```