---
title: Contribution
date: "2022-05-29T22:12:03.284Z"
template: regular-static-page
description: Build, test, and contribute to the advanced-logger open-source npm package.
---

This page describes contributing to the **[advanced-logger](https://github.com/AlexeyPopovUA/advanced-logger)** npm library. To change **this documentation site**, edit the [advanced-logger-guide](https://github.com/AlexeyPopovUA/advanced-logger-guide) repository instead.

## Prerequisites

- **Node.js 24+** (see library [`.mise.toml`](https://github.com/AlexeyPopovUA/advanced-logger/blob/master/.mise.toml))

```bash
mise install   # optional: install Node via mise
cd advanced-logger
npm ci
```

## Build

The library is bundled with [tsup](https://tsup.egoist.dev/) (`npm run build`):

```bash
npm run build
```

Outputs under `dist/`:

- `index.mjs` — ESM
- `index.cjs` — CommonJS
- `index.d.ts` — TypeScript declarations
- `index.global.js` — browser IIFE (`window.advancedLogger`)

Local watch mode:

```bash
npm run build:watch
```

## Tests

```bash
npm run type-check        # TypeScript
npm test                  # unit tests (import from src/)
npm run test:integration  # build + runtime tests (CJS + browser IIFE)
npm run test:all          # unit + integration
npm run coverage          # unit tests with coverage (CI on master)
```

**Jest** runs two projects: `unit` (source specs) and `runtime` (built `dist/index.cjs` and `window.advancedLogger` from the IIFE). Open `coverage/lcov-report/index.html` after `npm run coverage`.

Call `logger.destroy()` in tests when using interval or throttle strategies.

## CI

[GitHub Actions](https://github.com/AlexeyPopovUA/advanced-logger/actions) on every branch: type-check, unit tests, full build, runtime integration. `master` also runs coverage and SonarCloud.

## Releasing

On `master`, bump version and changelog with standard-version:

```bash
npm run release
git push origin master --follow-tags
```

Release commits are tagged; npm publish follows your existing release pipeline for tagged commits on `master`.

## Git workflow

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/). Commitlint runs on commit via Husky.

### Branches and pull requests

Use feature branches and open PRs to `master`. Keep history clean (rebase when appropriate). All CI checks should pass; resolve or discuss Sonar findings.

## AI / contributor notes

See [`AGENTS.md`](https://github.com/AlexeyPopovUA/advanced-logger/blob/master/AGENTS.md) in the library repo for architecture, extension points, and testing conventions.
