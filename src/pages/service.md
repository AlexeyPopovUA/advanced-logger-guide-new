---
title: Service
date: "2022-05-29T22:12:03.284Z"
template: regular-static-page
nav-menu-order: 2
---

Currently, module supports Sumologic, Loggly and Elastic search services out of the box.

### Sumologic (see https://www.sumologic.com/)

```javascript
//Configuration for communication with Sumologic.
//Url should be taken from the logger's source category configuration page.
const serviceConfig = {
    url: "https://www.google.nl",
    sourceName: "advancedLoggerTest",
    host: "advanced-logger",
    sourceCategory: "MY/SUMO/namespace",
    method: "POST",
}

//Default log configuration.
//It is used like a template with default values for each new log.
//Can be of any structure. It will be shallowly copied during creation of a new log record.
const defaultLogConfig = {
    UserAgent: window.userAgent,
    BuildVersion: 123,
    Platform: "browser",
    Severity: "DEBUG",
    Data: "",
    Timestamp: "",
    Message: "",
    Category: "",
}

//general config
const config = { serviceConfig, defaultLogConfig }

const sService = new service.SumologicService(config)
```

### Loggly (see https://www.loggly.com/)

```javascript
//Configuration for communication with Loggly.
//Url should be taken from the logger's source category configuration page.
const serviceConfig = {
    // this should be the url for **bulk** log sending
    url: "https://logs-01.loggly.com/bulk/<customertoken>/tag/bulk/",
    method: "POST",
}

//Default log configuration.
//It is used like a template with default values for each new log.
//Can be of any structure. It will be shallowly copied during creation of a new log record.
const defaultLogConfig = {
    UserAgent: window.userAgent,
    BuildVersion: 123,
    Platform: "browser",
    Severity: "DEBUG",
    Data: "",
    Timestamp: "",
    Message: "",
    Category: "",
}

//general config
const config = { serviceConfig, defaultLogConfig }

const lService = new service.LogglyService(config)
```

### Elastic Search Service (see https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-gsg-upload-data.html)

Logger supports sending data to Elasticsearch service endpoint. It was tested on AWS-based instance of Elasticsearch and Kibana. Ideally, it should work also on instance of any other cloud provider.

```javascript
//Configuration for communication with Elastic Search.
//Url should be taken from the logger's source category configuration page.
const serviceConfig = {
    // this should be the url for **bulk** log sending
    url: "https://<endpoint_url>/_bulk",
    method: "POST",
    //this field will be used to send index value in meta information for each log
    logMetaIndexField: "IndexField",
}

//Default log configuration.
//It is used like a template with default values for each new log.
//Can be of any structure. It will be shallowly copied during creation of a new log record.
const defaultLogConfig = {
    BuildVersion: 123,
    Platform: "browser",
    Severity: "DEBUG",
    Data: "",
    Timestamp: "",
    Message: "",
    IndexField: "web-app",
}

//general config
const config = { serviceConfig, defaultLogConfig }

const esService = new service.ElasticsearchService(config)
```

### Custom serializer

There are situations when you need a "special" representation of logs instead of JSON before sending them to remote storage. For example, key-value pairs:

```
[Timestamp=1234567890] [Message="test message"] [Category="MyController"]
```

In order to serialize logs in your own way, you can use `serializer` configuration with services:

```javascript
const serializer = logObject =>
    Object.keys(logObject)
        .map(key => `[${key}=${JSON.stringify(logObject[key])}]`)
        .join(" ")

const configWithSerializer = { serviceConfig, defaultLogConfig, serializer }
const testLogs = [{ test: "test123" }, { test: "test321" }]

service = new LogglyService(configWithSerializer)
```

### Console log service (for debugging purposes)

TODO

### Custom implementation of service

You can implement your own service. Here is an example of extending BaseRemoteService class for implementation of http service that sends logs in json form:

```javascript
const defaultLogConfig = {
    BuildVersion: 123,
    Platform: "nodejs",
    Severity: "LogLevel.DEBUG",
    Data: "",
    Timestamp: "",
    Exception: "",
    Message: "",
    Category: "",
}

const serviceConfig = {
    //todo Replace with a real URL
    url: "https://www.google.nl",
    method: "POST",
}

const config = { serviceConfig, defaultLogConfig }

class CustomHttpService extends service.BaseRemoteService {
    /**
     * @override
     */
    constructor(config) {
        console.log("constructor", config)
        return super(config)
    }

    /**
     * @override
     */
    preparePayload(logs) {
        const resultList = logs.map(log => ({
            ...this.defaultLogConfig,
            ...log,
        }))
        console.log("preparePayload", resultList)
        return Promise.resolve(this.serializer(resultList))
    }
}

const logger = new AdvancedLogger({
    service: new CustomHttpService(config),
    strategy: new strategy.OnRequestStrategy(),
})
```
