function _classPrivateMethodInitSpec(e, a) { _checkPrivateRedeclaration(e, a), a.add(e); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
import { yieldFor, generatePromise, AbortController } from './utils.js';
import logger from '@percy/logger';

// Assigns a deffered promise and resolve & reject functions to an object
function deferred(obj) {
  return Object.assign(obj, {
    deferred: new Promise((resolve, reject) => {
      Object.assign(obj, {
        resolve,
        reject
      });
    })
  });
}

// Returns the position of a needle within a haystack, or undefined if not found
function positionOf(haystack, needle, i = 1) {
  for (let item of haystack) {
    if (item !== needle) i++;else return i;
  }
}

// Thrown when attempting to push to a closed queue
class QueueClosedError extends Error {
  name = this.constructor.name;
}

// A queue instance keeps a list of arbitrary items to process concurrently,
// configured and controlled by various methods
var _handlers = /*#__PURE__*/new WeakMap();
var _queued = /*#__PURE__*/new WeakMap();
var _pending = /*#__PURE__*/new WeakMap();
var _Queue_brand = /*#__PURE__*/new WeakSet();
var _start = /*#__PURE__*/new WeakMap();
var _end = /*#__PURE__*/new WeakMap();
export class Queue {
  constructor(name) {
    // Maybe processes the next queued item task.
    _classPrivateMethodInitSpec(this, _Queue_brand);
    // item concurrency
    _defineProperty(this, "concurrency", 10);
    _defineProperty(this, "log", logger('core:queue'));
    // Configure queue handlers
    _classPrivateFieldInitSpec(this, _handlers, {});
    // internal queues
    _classPrivateFieldInitSpec(this, _queued, new Set());
    _classPrivateFieldInitSpec(this, _pending, new Set());
    // keep track of start and end tasks
    _classPrivateFieldInitSpec(this, _start, null);
    _classPrivateFieldInitSpec(this, _end, null);
    // represents various queue states such as ready, running, or closed
    _defineProperty(this, "readyState", 0);
    this.name = name;
  }

  // Configure queue properties
  set({
    concurrency
  }) {
    if (concurrency) this.concurrency = concurrency;
    return this;
  }
  handle(event, handler) {
    _classPrivateFieldGet(_handlers, this)[event] = handler;
    return this;
  }
  // Queue size is total queued and pending items
  get size() {
    return _classPrivateFieldGet(_queued, this).size + _classPrivateFieldGet(_pending, this).size;
  }

  // Pushes an item into the queue, additional args are passed to any configured task handler.
  push(item, ...args) {
    let task = deferred({
      item
    });

    // attach any configured error handler
    task.deferred = task.deferred.catch(e => {
      if (!_classPrivateFieldGet(_handlers, this).error) throw e;
      return _classPrivateFieldGet(_handlers, this).error(item, e);
    });

    // when closed, reject with a queue closed error
    if (this.readyState > 2) {
      task.reject(new QueueClosedError());
      return task.deferred;
    }

    // call or set up other handlers
    let exists = this.cancel(item);
    task.ctrl = new AbortController();
    // duplicate abortion controller on task, so it can can be used in further
    // generators and can be cancelled internally
    // TODO fix this for non object item usecase
    if (typeof item === 'object' && !Array.isArray(item) && item !== null) {
      item._ctrl = task.ctrl;
    }
    task.item = item = _classPrivateFieldGet(_handlers, this).push ? _classPrivateFieldGet(_handlers, this).push(item, exists) : item;
    task.handler = () => _classPrivateFieldGet(_handlers, this).task ? _classPrivateFieldGet(_handlers, this).task(item, ...args) : item;

    // queue this task & maybe dequeue the next task
    _classPrivateFieldGet(_queued, this).add(task);
    _assertClassBrand(_Queue_brand, this, _dequeue).call(this);

    // return the deferred task promise
    return task.deferred;
  }
  logQueueSize() {
    this.log.debug(`${this.name} queueInfo: ${JSON.stringify({
      queued: _classPrivateFieldGet(_queued, this).size,
      pending: _classPrivateFieldGet(_pending, this).size,
      total: _classPrivateFieldGet(_pending, this).size + _classPrivateFieldGet(_queued, this).size
    })}`);
  }
  // Cancels and aborts a specific item task.
  cancel(item) {
    let task = _assertClassBrand(_Queue_brand, this, _find).call(this, item);
    task === null || task === void 0 || task.ctrl.abort();
    let queued = _classPrivateFieldGet(_queued, this).delete(task);
    let pending = _classPrivateFieldGet(_pending, this).delete(task);

    // reject queued tasks that are not pending
    if (task && queued && !pending) {
      task.reject(task.ctrl.signal.reason);
    }

    // return the cancelled item
    return task === null || task === void 0 ? void 0 : task.item;
  }

  // Returns an item task matching the provided subject.

  // Initialize a starting task or return an existing one.
  start() {
    var _classPrivateFieldGet2;
    _classPrivateFieldGet(_start, this) ?? _classPrivateFieldSet(_start, this, deferred({
      readyState: 1
    }));
    (_classPrivateFieldGet2 = _classPrivateFieldGet(_start, this)).handler ?? (_classPrivateFieldGet2.handler = _classPrivateFieldGet(_end, this)
    // wait for any ending task to complete first
    ? () => _classPrivateFieldGet(_end, this).promise.then(_classPrivateFieldGet(_handlers, this).start) : _classPrivateFieldGet(_handlers, this).start);
    return _assertClassBrand(_Queue_brand, this, _process).call(this, _classPrivateFieldGet(_start, this)).deferred;
  }

  // intialize an ending task or return an existing one
  end() {
    var _classPrivateFieldGet3;
    _classPrivateFieldGet(_end, this) ?? _classPrivateFieldSet(_end, this, deferred({
      readyState: 0
    }));
    (_classPrivateFieldGet3 = _classPrivateFieldGet(_end, this)).handler ?? (_classPrivateFieldGet3.handler = _classPrivateFieldGet(_start, this)
    // wait for any starting task to complete first
    ? () => _classPrivateFieldGet(_start, this).promise.then(_classPrivateFieldGet(_handlers, this).end) : _classPrivateFieldGet(_handlers, this).end);
    return _assertClassBrand(_Queue_brand, this, _process).call(this, _classPrivateFieldGet(_end, this)).deferred;
  }
  // run the queue, starting it if necessary, and start dequeuing tasks
  run() {
    if (!_classPrivateFieldGet(_start, this)) this.start();
    // when starting, state is updated afterwards
    if (this.readyState === 0) _classPrivateFieldGet(_start, this).readyState = 2;
    if (this.readyState === 1) this.readyState = 2;
    while (_assertClassBrand(_Queue_brand, this, _dequeue).call(this)) _assertClassBrand(_Queue_brand, this, _dequeue).call(this);
    return this;
  }

  // stop a running queue
  stop() {
    if (this.readyState === 2) this.readyState = 1;
    return this;
  }

  // close a running queue, optionally aborting it
  close(abort) {
    var _classPrivateFieldGet4;
    // when starting, state is updated afterwards
    if ((_classPrivateFieldGet4 = _classPrivateFieldGet(_start, this)) !== null && _classPrivateFieldGet4 !== void 0 && _classPrivateFieldGet4.pending) _classPrivateFieldGet(_start, this).readyState = 3;
    if (this.readyState < 3) this.readyState = 3;
    if (abort) this.clear();
    return this;
  }

  // clear and abort any queued tasks
  clear() {
    let tasks = [..._classPrivateFieldGet(_queued, this)];
    this.log.debug(`Clearing ${this.name} queue, queued state: ${_classPrivateFieldGet(_queued, this).size}, pending state: ${_classPrivateFieldGet(_pending, this).size}`);
    _classPrivateFieldGet(_queued, this).clear();
    for (let task of tasks) {
      task.ctrl.abort();
      task.reject(task.ctrl.signal.reason);
    }
  }

  // process a single item task when started
  process(item) {
    var _classPrivateFieldGet5;
    let task = _assertClassBrand(_Queue_brand, this, _find).call(this, item);
    if (task && !_classPrivateFieldGet(_start, this)) this.start();
    (_classPrivateFieldGet5 = _classPrivateFieldGet(_start, this)) === null || _classPrivateFieldGet5 === void 0 || _classPrivateFieldGet5.promise.then(() => _assertClassBrand(_Queue_brand, this, _process).call(this, task));
    return task === null || task === void 0 ? void 0 : task.deferred;
  }

  // processes tasks using a generator promise, allowing task handlers to be cancelable

  // returns a generator that yeilds until started and no longer pending, calling the
  // callback every 10ms during checks with the current number of pending tasks
  idle(callback) {
    return yieldFor(() => {
      var _classPrivateFieldGet6;
      callback === null || callback === void 0 || callback(_classPrivateFieldGet(_pending, this).size);
      let starting = ((_classPrivateFieldGet6 = _classPrivateFieldGet(_start, this)) === null || _classPrivateFieldGet6 === void 0 ? void 0 : _classPrivateFieldGet6.pending) === true;
      return !starting && !_classPrivateFieldGet(_pending, this).size;
    }, {
      idle: 10
    });
  }

  // process items up to the latest queued item, starting the queue if necessary;
  // returns a generator that yields until the flushed item has finished processing
  flush(callback) {
    this.log.debug(`Flushing ${this.name} queue, queued state: ${_classPrivateFieldGet(_queued, this).size}, pending state: ${_classPrivateFieldGet(_pending, this).size}`);
    let interrupt =
    // check for existing interrupts
    [..._classPrivateFieldGet(_pending, this)].find(t => t.stop) ?? [..._classPrivateFieldGet(_queued, this)].find(t => t.stop);

    // get the latest queued or pending task to track
    let flush = [..._classPrivateFieldGet(_queued, this)].pop() ?? [..._classPrivateFieldGet(_pending, this)].pop();
    // determine if the queue should be stopped after flushing
    if (flush) flush.stop = (interrupt === null || interrupt === void 0 ? void 0 : interrupt.stop) ?? this.readyState < 2;
    // remove the old interrupt to avoid stopping early
    if (interrupt) delete interrupt.stop;
    // start the queue if not started
    if (!_classPrivateFieldGet(_start, this)) this.start();
    // run the queue if stopped
    if (flush !== null && flush !== void 0 && flush.stop) this.run();

    // will yield with the callback until done flushing
    return _assertClassBrand(_Queue_brand, this, _until).call(this, flush, callback);
  }

  // Repeatedly yields, calling the callback with the position of the task within the queue
}
function _dequeue() {
  this.logQueueSize();
  if (!_classPrivateFieldGet(_queued, this).size || this.readyState < 2) return;
  if (_classPrivateFieldGet(_pending, this).size >= this.concurrency) return;
  let [task] = _classPrivateFieldGet(_queued, this);
  return _assertClassBrand(_Queue_brand, this, _process).call(this, task);
}
function _find(subject) {
  let find = _classPrivateFieldGet(_handlers, this).find
  // use any configured find handler to match items
  ? ({
    item
  }) => _classPrivateFieldGet(_handlers, this).find(subject, item) : ({
    item
  }) => subject === item;
  return (
    // look at queued then pending items
    [..._classPrivateFieldGet(_queued, this)].find(find) ?? [..._classPrivateFieldGet(_pending, this)].find(find)
  );
}
function _process(task) {
  var _task$ctrl;
  if (!task || task.promise) return task;
  let queued = _classPrivateFieldGet(_queued, this).has(task);
  // remove queued tasks from the queue
  if (queued) _classPrivateFieldGet(_queued, this).delete(task);
  // clear queued tasks when ending
  if (task === _classPrivateFieldGet(_end, this)) this.clear();
  // add queued tasks to pending queue
  if (queued) _classPrivateFieldGet(_pending, this).add(task);
  // stop the queue when necessary
  if (task.stop) this.stop();
  // mark task as pending
  task.pending = true;

  // handle the task using a generator promise
  task.promise = generatePromise(task.handler, (_task$ctrl = task.ctrl) === null || _task$ctrl === void 0 ? void 0 : _task$ctrl.signal, (err, val) => {
    // clean up pending tasks that have not been aborted
    if (queued && !task.ctrl.signal.aborted) _classPrivateFieldGet(_pending, this).delete(task);
    // update queue state when necessary
    if (task.readyState != null) this.readyState = task.readyState;
    // clean up internal tasks after ending
    if (!this.readyState) _classPrivateFieldSet(_start, this, _classPrivateFieldSet(_end, this, null));
    // resolve or reject the deferred task promise
    task[err ? 'reject' : 'resolve'](err ?? val);
    // keep dequeuing when running
    if (this.readyState === 2) this.run();
    // mark pending task done
    task.pending = false;
  });
  return task;
}
async function* _until(task, callback) {
  try {
    yield* yieldFor(() => {
      var _classPrivateFieldGet7;
      if ((_classPrivateFieldGet7 = _classPrivateFieldGet(_start, this)) !== null && _classPrivateFieldGet7 !== void 0 && _classPrivateFieldGet7.pending) return false;
      let queued,
        pending = _classPrivateFieldGet(_pending, this).size;
      // calculate the position within queued when not pending
      if (task && task.pending == null) queued = positionOf(_classPrivateFieldGet(_queued, this), task);
      // call the callback and return true when not queued or pending
      let position = (queued ?? 0) + pending;
      callback === null || callback === void 0 || callback(position);
      return !position;
    }, {
      idle: 10
    });
  } catch (err) {
    // reset flushed tasks on error
    if (task.stop) this.stop();
    delete task.stop;
    throw err;
  }
}
export default Queue;