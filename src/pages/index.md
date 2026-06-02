---
title: About
date: "2022-05-29T22:12:03.284Z"
template: regular-static-page
description: Documentation for advanced-logger, an extendable isomorphic TypeScript logging library for Node.js and browsers.
---

## What is it?

It is an extendable isomorphic log sending library written in TypeScript for JavaScript applications in Node.js and browsers.

It can be extended with custom strategy ("when to send logs") and service ("where to send logs").

It does not restrict you with conventions, for example, existence of `logSeverity`, `ErrorId`, or `message` fields in a log.

It supports any format of logs via a custom serializer.

## How it works

1. You call `logger.log(payload)` with any object shape.
2. **LogStore** buffers logs and can apply transformations (for example rapid-fire grouping).
3. A **strategy** listens for new logs and emits `send` when it is time to flush.
4. The configured **service** serializes the batch and posts it (HTTP via native **`fetch`** for remote services).

See [Getting started](/getting-started/) for installation and [Service](/service/) / [Strategy](/strategy/) for built-in plugins.

## Features

- Works in browsers and Node.js
- Sends single logs or bundles to external endpoints
- Log sending strategies:
    1. **Interval** — throttle flushes while logs arrive (default 15s)
    2. **On request** — flush only when you call `sendAllLogs()`
    3. **On bundle size** — flush when the buffer reaches N logs (default 100)
    4. **Instant** — one log in, one send out
- Groups duplicate logs in a time window (rapid-fire grouping)
- Handles circular references in log objects (`fast-safe-stringify`)
- Custom per-log serialization
- Built-in remote endpoints: Sumo Logic, Loggly, Elasticsearch, plus console debugging

Runnable examples: [advanced-logger `example/`](https://github.com/AlexeyPopovUA/advanced-logger/tree/master/example).

## Runtime environment support

The package ships dual **ESM** (`dist/index.mjs`) and **CommonJS** (`dist/index.cjs`) builds, type declarations (`dist/index.d.ts`), and a browser **IIFE** global (`dist/index.global.js`). It has **no runtime npm dependencies** (lodash throttle and safe stringify are bundled in).

- **Node.js** — **18+** for global `fetch`; developed and tested on **Node.js 24+** (see library `.mise.toml`)
- **Browser** — modern browsers with native `fetch` and ES2015+; consumers on older targets should transpile and polyfill

## Links

**[NPM package](https://www.npmjs.com/package/advanced-logger)**

**[GitHub repository](https://github.com/AlexeyPopovUA/advanced-logger)**

[![Feature branch build](https://github.com/AlexeyPopovUA/advanced-logger/actions/workflows/feature-branch-build.yml/badge.svg)](https://github.com/AlexeyPopovUA/advanced-logger/actions/workflows/feature-branch-build.yml)
[![npm version](https://badge.fury.io/js/advanced-logger.svg)](https://badge.fury.io/js/advanced-logger)
[![install size](https://packagephobia.now.sh/badge?p=advanced-logger)](https://packagephobia.now.sh/result?p=advanced-logger)
[![](https://data.jsdelivr.com/v1/package/npm/advanced-logger/badge)](https://www.jsdelivr.com/package/npm/advanced-logger)

[![Quality checks](https://github.com/AlexeyPopovUA/advanced-logger/actions/workflows/quality-checks.yml/badge.svg)](https://github.com/AlexeyPopovUA/advanced-logger/actions/workflows/quality-checks.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=bugs)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=coverage)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FAlexeyPopovUA%2Fadvanced-logger.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FAlexeyPopovUA%2Fadvanced-logger?ref=badge_shield)
