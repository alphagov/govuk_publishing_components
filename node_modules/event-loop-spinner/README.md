# event-loop-spinner

Tiny helper to prevent blocking Node.js event loop.

## Example

```typescript
import { eventLoopSpinner } from 'event-loop-spinner';
async function cpuIntensiveOperationHandler(hugeArray) {
  for (const item of hugeArray) {
    // ...
    if (eventLoopSpinner.isStarving()) {
      await eventLoopSpinner.spin();
    }
  }
}
```


## Reading

[Node.js: How even quick async functions can block the Event-Loop, starve I/O](https://snyk.io/blog/nodejs-how-even-quick-async-functions-can-block-the-event-loop-starve-io/)


## How does this help?

Node can only run one bit of JS at a time. While it is running this bit of JS, it does nothing else.
It doesn't fire timers. It doesn't accept TCP connections from clients.

In fact, Node doesn't even do these things when it finishes running one bit of JS. It prefers to
immediately run the next bit of JS. It does this for "a while".

This gives you two amazingly powerful ways to shoot yourself in the foot; it's great! Just like C++.

That is, if some node process either:
 * contains some JS code which runs for "too long", or
 * handles too many concurrent work items, resulting in lots of JS to run,

..then it won't handle network requests, or let anyone else do any JS. This can result in the
application appearing unresponsive for seconds or minutes. (Yes, we really see minutes.)

`event-loop-spinner` masks this problem. The `spin()` method allows Node to stop running this JS
function, and its friends, and do some other JS, or do some IO. This significantly shortens the
time before more networking is done (i.e. a response is sent to a client), and/or other people's
JS is run, improving responsiveness.
