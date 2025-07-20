# standard-tsx
[![NPM version](https://img.shields.io/npm/v/standard-tsx.svg)](http://npmjs.com/package/standard-tsx)
[![Build Status](https://github.com/extremeheat/standard-tsx/actions/workflows/ci.yml/badge.svg)](https://github.com/extremeheat/standard-tsx/actions/workflows/)
[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/extremeheat/standard-tsx)

A drop-in replacement for the `standard` JavaScript linter that supports both TypeScript and JavaScript code with and without JSX. This package does not
add any new JavaScript rules. Instead, it applies standard's eslint config (https://github.com/standard/eslint-config-standard) to both `*.ts` and `*.js`/`.cjs`/`.mjs` files as well as `.tsx`/`.jsx` React files. This is on top of ESLint's default TypeScript reccomendations (which are mostly non-style related) and add some `--fix`-able TypeScript rules to mirror standard's JavaScript behavior (semicolons, spacing):

>Recommended rules for code correctness that you can drop in without additional configuration. These rules are those whose reports are almost always for a bad practice and/or likely bug. recommended also disables core ESLint rules known to conflict with typescript-eslint rules or cause issues in TypeScript codebases.

## Install
```
npm install -D standard-tsx
```

## Usage

To run against the current directory (analogus to `npx eslint .`):

```
npx standard-tsx
```

Or to fix
```
npx standard-tsx --fix
```

In package.json run scripts, you can add the following as aliases (which will run in context of your repo root):
```json
  "scripts": {
    "lint": "standard-tsx",
    "fix": "standard-tsx --fix"
  },
```
