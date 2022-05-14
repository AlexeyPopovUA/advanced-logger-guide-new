---
title: Getting started
date: "2015-05-01T22:12:03.284Z"
template: regular-static-page
---

### Add to the project

Axios is a required peer dependency. It means that axios is not bundled into logger package, but required to be installed.

As a dependency in a npm project:

```shell
npm i --save advanced-logger axios
```

```javascript
import { AdvancedLogger, service, strategy } from "advanced-logger"
// or
const { AdvancedLogger, service, strategy } = require("advanced-logger")
```

As script tags with CDN:

```html
<!--minified-->
<script src="https://cdn.jsdelivr.net/npm/axios@latest/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/advanced-logger@latest/dist/browser/advanced-logger.browser.min.js"></script>
<!--dev version-->
<script src="https://cdn.jsdelivr.net/npm/axios@latest/dist/axios.js"></script>
<script src="https://cdn.jsdelivr.net/npm/advanced-logger@latest/dist/browser-debug/advanced-logger.browser.js"></script>
```

#### Configuration

Lets initiate a logger that sends all logs instantly to Sumologic service.

```javascript
import { AdvancedLogger, service, strategy } from "advanced-logger"

const defaultLogConfig = {
    UserAgent: window.userAgent,
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
    url: "https://www.google.nl",
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

logger.log({ test: "instant log u1" }) // sends log message :rocket:
logger.log({ test: "instant log u2" }) // sends log message :rocket:
logger.log({ test: "instant log u3" }) // sends log message :rocket:
```

### Upgrading between breaking changes

#### 2.x to 3.x

-   Install axios to your project or just keep using it if it is already installed
-   Logger is compiled to ES2015 JS target. If your project requires support of old browsers and nodejs, please,
    make sure that you transpile and add necessary pollyfills to the build
