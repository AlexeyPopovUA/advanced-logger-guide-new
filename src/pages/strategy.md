---
title: Strategy
date: "2022-05-29T22:12:03.284Z"
template: regular-static-page
nav-menu-order: 3
---

Strategies are components that "know" when is it right time to send logs.

There are next strategies available:

-   InstantStrategy
-   OnBundleSizeStrategy
-   OnIntervalStrategy
-   OnRequestStrategy

### InstantStrategy

Does not require parameters. It just sends the log as soon as it appears in logger.

```javascript
const { strategy } = require("advanced-logger")
const instantStrategy = new strategy.InstantStrategy()
```

### OnBundleSizeStrategy

Can accept a configuration object with an optional "maxBundle" value, which determines what is a maximal amount of logs it should collect before sending to the service. Default number is 100.

```javascript
const { strategy } = require("advanced-logger")
const config = {
    maxBundle: 123,
}
const bundleStrategy = new strategy.OnBundleSizeStrategy(config)
```

### OnIntervalStrategy

Can accept a configuration object with an optional "interval" value, which determines what is a time interval for collecting logs before sending them to the service. Default number is 15000.

```javascript
const { strategy } = require("advanced-logger")
const config = {
    interval: 10000,
}
const intervalStrategy = new strategy.OnIntervalStrategy(config)
```

### OnRequestStrategy

This strategy does not do anything :) . It will send logs only after manual call to `logger.sendAllLogs();` method.

```javascript
const { strategy } = require("advanced-logger")

const requestStrategy = new strategy.OnRequestStrategy()

//"logger" is an instance of AdvancedLogger

logger.sendAllLogs()
```

### Custom implementation of strategy

TODO
