---
title: Strategy
date: "2022-05-29T22:12:03.284Z"
template: regular-static-page
description: Control when logs are sent with instant, interval, bundle-size, and on-request strategies.
---

Strategies decide **when** buffered logs are flushed to the configured service. Each strategy exposes an `eventEmitter` and emits `"send"` when it is time to post logs.

```javascript
const { strategy } = require("advanced-logger")
```

Built-in strategies:

- **InstantStrategy** — send on every `log()`
- **OnBundleSizeStrategy** — send when the buffer reaches `maxBundle`
- **OnIntervalStrategy** — throttle sends while logs are arriving
- **OnRequestStrategy** — send only when you call `logger.sendAllLogs()`

### InstantStrategy

Sends as soon as a log is added. `sendAllLogs()` does not flush additional batches (each log already triggered a send).

```javascript
const instantStrategy = new strategy.InstantStrategy()
```

### OnBundleSizeStrategy

Optional `maxBundle` (default **100**): flush when the in-memory store reaches that count.

```javascript
const bundleStrategy = new strategy.OnBundleSizeStrategy({
    maxBundle: 123,
})
```

### OnIntervalStrategy

Optional `interval` in milliseconds (default **15000**). Uses lodash **throttle** with trailing edge: while logs keep arriving, sends happen at most once per interval—not on a fixed clock if the buffer is idle.

```javascript
const intervalStrategy = new strategy.OnIntervalStrategy({
    interval: 10000,
})
```

Call `logger.destroy()` when disposing a logger that uses this strategy.

### OnRequestStrategy

Does not send automatically. Flush manually:

```javascript
const requestStrategy = new strategy.OnRequestStrategy()

// logger is an AdvancedLogger instance
logger.sendAllLogs()
```

Useful with `ConsoleService`, custom batching, or before page unload.

### Custom implementation of strategy

Implement the strategy contract:

| Member         | Purpose                                                    |
| -------------- | ---------------------------------------------------------- |
| `eventEmitter` | Emit `"send"` when logs should flush                       |
| `onAdd(info?)` | Called when a log is added (`info.logCount` is store size) |
| `onClear()`    | Called when the store is cleared                           |
| `sendAll()`    | Manual flush (wired to `logger.sendAllLogs()`)             |
| `destroy()`    | Remove listeners and timers                                |

**InstantStrategy** and **OnRequestStrategy** in the [library source](https://github.com/AlexeyPopovUA/advanced-logger/tree/master/src/strategy) are minimal references.

```javascript
const { EventEmitter } = require("events")

class MyStrategy {
    constructor() {
        this.eventEmitter = new EventEmitter()
    }

    onAdd() {
        // example: flush when store has logs
        this.eventEmitter.emit("send")
    }

    onClear() {}

    sendAll() {
        this.eventEmitter.emit("send")
    }

    destroy() {
        this.eventEmitter.removeAllListeners()
    }
}
```

Wire it when creating the logger:

```javascript
const logger = new AdvancedLogger({
    service: new service.ConsoleService(),
    strategy: new MyStrategy(),
})
```
