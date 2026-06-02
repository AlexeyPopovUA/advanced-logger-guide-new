---
title: Service
date: "2022-05-29T22:12:03.284Z"
template: regular-static-page
description: Send logs to Sumologic, Loggly, or Elasticsearch using built-in advanced-logger service adapters.
---

All examples assume you already imported the API:

```javascript
const { AdvancedLogger, service, strategy } =
    require("advanced-logger").advancedLogger
// browser: const { AdvancedLogger, service, strategy } = window.advancedLogger
```

The module ships **Sumologic**, **Loggly**, **Elasticsearch**, and **Console** services out of the box. Remote services extend `BaseRemoteService` and send logs over HTTP via axios.

### Sumologic (see https://www.sumologic.com/)

`serviceConfig` must include `url`, `method`, `sourceCategory`, `host`, and `sourceName`. The service sets Sumologic headers (`X-Sumo-Category`, `X-Sumo-Host`, `X-Sumo-Name`) and `Content-Type: application/json`.

```javascript
const serviceConfig = {
    url: "https://your-sumologic-http-collector-url",
    sourceName: "advancedLoggerTest",
    host: "advanced-logger",
    sourceCategory: "MY/SUMO/namespace",
    method: "POST",
}

const defaultLogConfig = {
    UserAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    BuildVersion: 123,
    Platform: "browser",
    Severity: "DEBUG",
    Data: "",
    Timestamp: "",
    Message: "",
    Category: "",
}

const config = { serviceConfig, defaultLogConfig }

const sumoService = new service.SumologicService(config)
```

### Loggly (see https://www.loggly.com/)

```javascript
const serviceConfig = {
    url: "https://logs-01.loggly.com/bulk/<customertoken>/tag/bulk/",
    method: "POST",
}

const defaultLogConfig = {
    BuildVersion: 123,
    Platform: "browser",
    Severity: "DEBUG",
    Message: "",
    Category: "",
}

const config = { serviceConfig, defaultLogConfig }

const logglyService = new service.LogglyService(config)
```

### Elasticsearch (see https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html)

Sends **bulk NDJSON**: for each log, one index-metadata line and one document line. Tested on AWS OpenSearch / Elasticsearch; should work on other providers that accept the bulk API.

`logMetaIndexField` names the field on each log object used for `_index` in the metadata line. If omitted, the default field name is **`Index`**.

```javascript
const serviceConfig = {
    url: "https://<endpoint_url>/_bulk",
    method: "POST",
    logMetaIndexField: "IndexField",
}

const defaultLogConfig = {
    BuildVersion: 123,
    Platform: "browser",
    Severity: "DEBUG",
    Message: "",
    IndexField: "web-app",
}

const config = { serviceConfig, defaultLogConfig }

const esService = new service.ElasticsearchService(config)
```

### HTTP retries

Any remote service can retry failed requests via `serviceConfig`:

```javascript
const serviceConfig = {
    url: "https://example.com/logs",
    method: "POST",
    retryAttempts: 3,
    retryInterval: 1000,
}
```

### Custom serializer

Use a custom `serializer` on the service config when you need a format other than safe JSON. The function receives a single log object and must return a **string**.

Example output shape:

```
[Timestamp=1234567890] [Message="test message"] [Category="MyController"]
```

```javascript
const serializer = logObject =>
    Object.keys(logObject)
        .map(key => `[${key}=${JSON.stringify(logObject[key])}]`)
        .join(" ")

const configWithSerializer = { serviceConfig, defaultLogConfig, serializer }

const logglyService = new service.LogglyService(configWithSerializer)
```

By default, `BaseRemoteService` joins serialized lines with newlines in `preparePayload`.

### Console service (for debugging)

Writes prepared logs to `console.log`. Pair with `OnRequestStrategy` and call `sendAllLogs()` when you want to flush.

```javascript
const logger = new AdvancedLogger({
    service: new service.ConsoleService(),
    strategy: new strategy.OnRequestStrategy(),
})

logger.log({ Message: "debug event" })
logger.sendAllLogs()
```

### Custom implementation of service

Extend `service.BaseRemoteService` and override as needed:

- **`preparePayload(logs)`** — batch body (default: newline-joined serialized lines)
- **`serializer(log)`** — per-log encoding (default: safe JSON via `fast-safe-stringify`)
- **`getHeaders()`** — request headers

Full Node example: [custom-http-service.js](https://github.com/AlexeyPopovUA/advanced-logger/blob/master/example/node/custom-http-service.js).

```javascript
const { AdvancedLogger, service, strategy } =
    require("advanced-logger").advancedLogger

const defaultLogConfig = {
    BuildVersion: 123,
    Platform: "nodejs",
    Severity: "DEBUG",
    Message: "",
    Category: "",
}

const serviceConfig = {
    url: "https://your-log-endpoint",
    method: "POST",
}

const config = { serviceConfig, defaultLogConfig }

class CustomHttpService extends service.BaseRemoteService {
    preparePayload(logs) {
        const resultList = logs.map(log => ({
            ...this.defaultLogConfig,
            ...log,
        }))
        return Promise.resolve(this.serializer(resultList))
    }
}

const logger = new AdvancedLogger({
    service: new CustomHttpService(config),
    strategy: new strategy.OnRequestStrategy(),
})

logger.log({ test: "custom service log" })
logger.sendAllLogs()
logger.destroy()
```

For non-HTTP sinks, implement `IService` directly (`sendAllLogs`, `preparePayload`, `serializer`, `destroy`).
