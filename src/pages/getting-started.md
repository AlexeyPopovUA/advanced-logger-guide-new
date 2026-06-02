---
title: Getting started
date: "2022-05-29T22:12:03.284Z"
template: regular-static-page
description: Install advanced-logger and configure your first logs from Node.js or the browser using native fetch.
---

### Add to the project

Version **4.x** has **no peer dependencies**. HTTP uses the platform's native **`fetch`**; lodash throttle and safe JSON stringify are bundled inside the package.

```shell
npm i --save advanced-logger
```

The API is exported as **top-level named exports**. Use the pattern that matches your runtime:

#### ESM (recommended)

```javascript
import {
    AdvancedLogger,
    service,
    strategy,
    TransformationEnum,
} from "advanced-logger"
```

#### Node.js (CommonJS)

```javascript
const { AdvancedLogger, service, strategy } = require("advanced-logger")
```

#### Browser (CDN script tag)

```html
<script src="https://cdn.jsdelivr.net/npm/advanced-logger@latest/dist/index.global.js"></script>
```

```javascript
const { AdvancedLogger, service, strategy } = window.advancedLogger
```

The script-tag global **`window.advancedLogger`** is unchanged from v3. Node and bundlers no longer use a `.advancedLogger` property on the module export.

#### TypeScript

Type declarations ship as `dist/index.d.ts` (package `"types"` field). ESM named imports work with the published `exports` map.

### Configuration

#### Browser example

Let's create a logger that sends each log instantly to a Sumologic HTTP source:

```javascript
const { AdvancedLogger, service, strategy } = window.advancedLogger

const defaultLogConfig = {
    UserAgent: navigator.userAgent,
    Channel: "my-company",
    BuildVersion: 123,
    Platform: "browser",
    Severity: "DEBUG",
    Data: "",
    Timestamp: "",
    Message: "",
    Category: "",
}

const serviceConfig = {
    url: "https://your-sumologic-http-collector-url",
    sourceName: "advancedLoggerTest",
    host: "advanced-logger",
    sourceCategory: "MY/SUMO/namespace",
    method: "POST",
}

const config = { serviceConfig, defaultLogConfig }

const logger = new AdvancedLogger({
    service: new service.SumologicService(config),
    strategy: new strategy.InstantStrategy(),
})

logger.log({ test: "instant log u1" })
logger.log({ test: "instant log u2" })
logger.log({ test: "instant log u3" })
```

#### Node.js example

```javascript
const { AdvancedLogger, service, strategy } = require("advanced-logger")

const defaultLogConfig = {
    Channel: "my-company",
    BuildVersion: 123,
    Platform: "nodejs",
    Severity: "DEBUG",
    Message: "",
    Category: "",
}

const serviceConfig = {
    url: "https://your-sumologic-http-collector-url",
    sourceName: "advancedLoggerTestNode",
    host: "advanced-logger",
    sourceCategory: "MY/SUMO/namespace",
    method: "POST",
}

const logger = new AdvancedLogger({
    service: new service.SumologicService({ serviceConfig, defaultLogConfig }),
    strategy: new strategy.InstantStrategy(),
})

logger.log({ test: "instant log from node" })
```

More runnable samples live in the [advanced-logger `example/` folder](https://github.com/AlexeyPopovUA/advanced-logger/tree/master/example).

### HTTP errors

Remote services use **`fetch`**. Unlike axios, `fetch` does not reject on HTTP error status codes, so the library **throws on non-2xx responses** to preserve retry behavior. Failed sends are logged with `console.error` inside `AdvancedLogger`. Use `retryAttempts` and `retryInterval` on `serviceConfig`, or add your own monitoring, if you need stronger guarantees.

### Lifecycle

Strategies that use timers or throttling (for example `OnIntervalStrategy`) register listeners until torn down. When you are done with a logger instance, call:

```javascript
logger.destroy()
```

Use this in single-page app teardown, test `afterEach` hooks, and long-running workers.

### Runtime requirements

- **Node.js 18+** for global `fetch` (library development and CI use **Node.js 24+**)
- **Browser** — modern browsers with native `fetch` and ES2015+ (IIFE bundle)

### Upgrading between breaking changes

#### 3.x to 4.x

Version 4 replaces webpack bundles with **tsup** (ESM + CJS + browser IIFE) and removes **axios** in favor of native **`fetch`**.

1. **No more `.advancedLogger` on `require`/`import`.** Use top-level named exports (see above). `window.advancedLogger` for script tags is unchanged.
2. **Remove axios** from dependencies and from browser `<script>` tags.
3. **Non-2xx HTTP responses now reject** so retries still run. Plan error handling accordingly.
4. **CDN URL** is `dist/index.global.js` (not `dist/browser/advanced-logger.browser.min.js`).

Uninstall axios:

```shell
npm uninstall axios
```

Node / bundlers:

```javascript
// Before (3.x)
const { AdvancedLogger, service, strategy } =
    require("advanced-logger").advancedLogger

// After (4.x)
const { AdvancedLogger, service, strategy } = require("advanced-logger")
```

Browser script tags:

```html
<!-- Before (3.x) -->
<script src="https://cdn.jsdelivr.net/npm/axios@latest/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/advanced-logger@latest/dist/browser/advanced-logger.browser.min.js"></script>

<!-- After (4.x) -->
<script src="https://cdn.jsdelivr.net/npm/advanced-logger@latest/dist/index.global.js"></script>
```

#### 2.x to 3.x

- Install **axios** as a peer dependency (removed again in 4.x).
- The library targeted **ES2015**. Transpile and polyfill if you need older runtimes.
