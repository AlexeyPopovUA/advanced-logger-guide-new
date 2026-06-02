---
title: Getting started
date: "2022-05-29T22:12:03.284Z"
template: regular-static-page
description: Install advanced-logger and axios, then configure and send your first logs from Node.js or the browser.
---

### Add to the project

Axios is a required peer dependency (currently **1.13.x**). It is not bundled into the logger package, so you must install it alongside `advanced-logger`.

```shell
npm i --save advanced-logger axios
```

The published package exposes the API on an **`advancedLogger`** property (webpack library name). Use the pattern that matches your runtime:

#### Node.js (CommonJS)

```javascript
const { AdvancedLogger, service, strategy } =
    require("advanced-logger").advancedLogger
```

#### Browser (CDN script tags)

```html
<!-- minified -->
<script src="https://cdn.jsdelivr.net/npm/axios@latest/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/advanced-logger@latest/dist/browser/advanced-logger.browser.min.js"></script>
<!-- dev / debug -->
<script src="https://cdn.jsdelivr.net/npm/axios@latest/dist/axios.js"></script>
<script src="https://cdn.jsdelivr.net/npm/advanced-logger@latest/dist/browser-debug/advanced-logger.browser.js"></script>
```

```javascript
const { AdvancedLogger, service, strategy } = window.advancedLogger
```

#### TypeScript

Types ship at `dist/src/index.d.ts`. For runtime in Node, still use `.advancedLogger` as above. You can import types separately:

```typescript
import type {} from /* types from package */ "advanced-logger"
const { AdvancedLogger, service, strategy } =
    require("advanced-logger").advancedLogger
```

Named ESM imports such as `import { AdvancedLogger } from "advanced-logger"` do not match the CommonJS bundle export shape and may fail at runtime unless your bundler re-exports the library.

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
const { AdvancedLogger, service, strategy } =
    require("advanced-logger").advancedLogger

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

### Lifecycle

Strategies that use timers or throttling (for example `OnIntervalStrategy`) register listeners until torn down. When you are done with a logger instance, call:

```javascript
logger.destroy()
```

Use this in single-page app teardown, test `afterEach` hooks, and long-running workers.

### Upgrading between breaking changes

#### 2.x to 3.x

- Install **axios** as a peer dependency (or keep it if already present).
- The library targets **ES2015**. If you need older browsers or Node versions, transpile your app and add necessary **polyfills**.
- Library development and CI use **Node.js 24+** (`engines.node` in package.json). Consumers on older Node may still run the ES2015 bundles if their environment supports them.
