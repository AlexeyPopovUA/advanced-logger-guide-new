---
title: Grouping
date: "2022-05-29T22:12:03.284Z"
template: regular-static-page
description: Group duplicate logs within a time interval to reduce noise in your log stream.
---

Logs that share the same identity fields can be grouped within a time window so rapid duplicate events are counted instead of flooding your remote store.

## Rapid-fire grouping

Pass a `transformations` array when you create `AdvancedLogger`. The built-in `TransformationEnum.RAPID_FIRE_GROUPING` transformation:

- Compares logs using **`groupIdentityFields`** (field names that define a duplicate log)
- Keeps **one representative log** in the buffer per identity; duplicates increment an internal counter
- Writes **`groupFieldName`** on that log when the group finalizes (throttled by **`interval`** milliseconds)
- Flushes pending group state when logs are read for send (`getAll()`)

### Example

```javascript
const { AdvancedLogger, service, strategy, TransformationEnum } =
    require("advanced-logger").advancedLogger

const logger = new AdvancedLogger({
    service: new service.ConsoleService(),
    strategy: new strategy.OnIntervalStrategy({ interval: 5000 }),
    transformations: [
        {
            type: TransformationEnum.RAPID_FIRE_GROUPING,
            configuration: {
                groupIdentityFields: ["Message", "Category"],
                groupFieldName: "RepeatCount",
                interval: 3000,
            },
        },
    ],
})

logger.log({ Message: "User clicked", Category: "UI" })
logger.log({ Message: "User clicked", Category: "UI" })
// After send: representative log includes RepeatCount for matching events in the window

logger.destroy()
```

When logs are sent, grouped entries include `RepeatCount` (or your chosen field name) reflecting how many matching logs arrived during the interval.

Grouping runs in the log store before your strategy sends logs to the configured service. Pair it with [interval or bundle-size strategies](/strategy/) when you expect bursts of identical messages.
