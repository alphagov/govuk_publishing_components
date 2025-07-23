import EventEmitter from 'events';
import { sha256hash } from '@percy/client/utils';
import { camelcase, merge } from '@percy/config/utils';
import YAML from 'yaml';
import path from 'path';
import url from 'url';
import { readFileSync } from 'fs';
import logger from '@percy/logger';
import DetectProxy from '@percy/client/detect-proxy';
export { request, getPackageJSON, hostnameMatches } from '@percy/client/utils';
export { Server, createServer } from './server.js';

// Returns the hostname portion of a URL.
export function hostname(url) {
  return new URL(url).hostname;
}

// Normalizes a URL by stripping hashes to ensure unique resources.
export function normalizeURL(url) {
  let {
    protocol,
    host,
    pathname,
    search
  } = new URL(url);
  return `${protocol}//${host}${pathname}${search}`;
}

/* istanbul ignore next: tested, but coverage is stripped */
// Returns the body for automateScreenshot in structure
export function percyAutomateRequestHandler(req, percy) {
  var _percy$config$snapsho, _percy$config$snapsho2, _percy$config$snapsho3, _percy$config$snapsho4, _percy$config$snapsho5, _percy$config$snapsho6;
  if (req.body.client_info) {
    req.body.clientInfo = req.body.client_info;
  }
  if (req.body.environment_info) {
    req.body.environmentInfo = req.body.environment_info;
  }

  // combines array and overrides global config with per-screenshot config
  let camelCasedOptions = {};
  Object.entries(req.body.options || {}).forEach(([key, value]) => {
    camelCasedOptions[camelcase(key)] = value;
  });
  req.body.options = merge([{
    fullPage: percy.config.snapshot.fullPage,
    percyCSS: percy.config.snapshot.percyCSS,
    freezeAnimatedImage: percy.config.snapshot.freezeAnimatedImage || percy.config.snapshot.freezeAnimation,
    freezeImageBySelectors: (_percy$config$snapsho = percy.config.snapshot.freezeAnimatedImageOptions) === null || _percy$config$snapsho === void 0 ? void 0 : _percy$config$snapsho.freezeImageBySelectors,
    freezeImageByXpaths: (_percy$config$snapsho2 = percy.config.snapshot.freezeAnimatedImageOptions) === null || _percy$config$snapsho2 === void 0 ? void 0 : _percy$config$snapsho2.freezeImageByXpaths,
    ignoreRegionSelectors: (_percy$config$snapsho3 = percy.config.snapshot.ignoreRegions) === null || _percy$config$snapsho3 === void 0 ? void 0 : _percy$config$snapsho3.ignoreRegionSelectors,
    ignoreRegionXpaths: (_percy$config$snapsho4 = percy.config.snapshot.ignoreRegions) === null || _percy$config$snapsho4 === void 0 ? void 0 : _percy$config$snapsho4.ignoreRegionXpaths,
    considerRegionSelectors: (_percy$config$snapsho5 = percy.config.snapshot.considerRegions) === null || _percy$config$snapsho5 === void 0 ? void 0 : _percy$config$snapsho5.considerRegionSelectors,
    considerRegionXpaths: (_percy$config$snapsho6 = percy.config.snapshot.considerRegions) === null || _percy$config$snapsho6 === void 0 ? void 0 : _percy$config$snapsho6.considerRegionXpaths,
    regions: percy.config.snapshot.regions,
    algorithm: percy.config.snapshot.algorithm,
    algorithmConfiguration: percy.config.snapshot.algorithmConfiguration,
    sync: percy.config.snapshot.sync,
    version: 'v2'
  }, camelCasedOptions], (path, prev, next) => {
    switch (path.map(k => k.toString()).join('.')) {
      case 'percyCSS':
        // concatenate percy css
        return [path, [prev, next].filter(Boolean).join('\n')];
    }
  });
  req.body.buildInfo = percy.build;
}

// Returns the body for sendEvent structure
export function percyBuildEventHandler(req, cliVersion) {
  if (Array.isArray(req.body)) {
    return req.body.map(item => processSendEventData(item, cliVersion));
  } else {
    // Treat the input as an object and perform instructions
    return processSendEventData(req.body, cliVersion);
  }
}

// Process sendEvent object
function processSendEventData(input, cliVersion) {
  // Add Properties here to send to eventData
  const allowedEventProperties = ['message', 'cliVersion', 'clientInfo', 'errorKind', 'extra'];
  const extractedData = {};
  for (const property of allowedEventProperties) {
    if (Object.prototype.hasOwnProperty.call(input, property)) {
      extractedData[property] = input[property];
    }
  }
  if (extractedData.clientInfo) {
    const [client, clientVersion] = extractedData.clientInfo.split('/');

    // Add the client and clientVersion fields to the object
    extractedData.client = client;
    extractedData.clientVersion = clientVersion;
    delete extractedData.clientInfo;
  }
  if (!input.cliVersion) {
    extractedData.cliVersion = cliVersion;
  }
  return extractedData;
}

// Creates a local resource object containing the resource URL, mimetype, content, sha, and any
// other additional resources attributes.
export function createResource(url, content, mimetype, attrs) {
  return {
    ...attrs,
    sha: sha256hash(content),
    mimetype,
    content,
    url
  };
}

// Creates a root resource object with an additional `root: true` property. The URL is normalized
// here as a convenience since root resources are usually created outside of asset discovery.
export function createRootResource(url, content, attrs = {}) {
  return createResource(normalizeURL(url), content, 'text/html', {
    ...attrs,
    root: true
  });
}

// Creates a Percy CSS resource object.
export function createPercyCSSResource(url, css) {
  let {
    href,
    pathname
  } = new URL(`/percy-specific.${Date.now()}.css`, url);
  return createResource(href, css, 'text/css', {
    pathname
  });
}

// Creates a log resource object.
export function createLogResource(logs) {
  let [url, content] = [`/percy.${Date.now()}.log`, JSON.stringify(logs)];
  return createResource(url, content, 'text/plain', {
    log: true
  });
}

// Returns true or false if the provided object is a generator or not
export function isGenerator(subject) {
  return typeof (subject === null || subject === void 0 ? void 0 : subject.next) === 'function' && (typeof subject[Symbol.iterator] === 'function' || typeof subject[Symbol.asyncIterator] === 'function');
}

// Iterates over the provided generator and resolves to the final value when done. With an
// AbortSignal, the generator will throw with the abort reason when aborted. Also accepts an
// optional node-style callback, called before the returned promise resolves.
export async function generatePromise(gen, signal, cb) {
  try {
    if (typeof signal === 'function') [cb, signal] = [signal];
    if (typeof gen === 'function') gen = await gen();
    let {
      done,
      value
    } = !isGenerator(gen) ? {
      done: true,
      value: await gen
    } : await gen.next();
    while (!done) {
      var _signal;
      ({
        done,
        value
      } = (_signal = signal) !== null && _signal !== void 0 && _signal.aborted ? await gen.throw(signal.reason) : await gen.next(value));
    }
    if (!cb) return value;
    return cb(null, value);
  } catch (error) {
    if (!cb) throw error;
    return cb(error);
  }
}

// Bare minimum AbortController polyfill for Node < 16.14
export class AbortController {
  signal = new EventEmitter();
  abort(reason = new AbortError()) {
    if (this.signal.aborted) return;
    Object.assign(this.signal, {
      reason,
      aborted: true
    });
    this.signal.emit('abort', reason);
  }
}

// Similar to DOMException[AbortError] but accepts additional properties
export class AbortError extends Error {
  constructor(msg = 'This operation was aborted', props) {
    Object.assign(super(msg), {
      name: 'AbortError',
      ...props
    });
  }
}

// An async generator that yields after every event loop until the promise settles
export async function* yieldTo(subject) {
  // yield to any provided generator or return non-promise values
  if (isGenerator(subject)) return yield* subject;
  if (typeof (subject === null || subject === void 0 ? void 0 : subject.then) !== 'function') return subject;

  // update local variables with the provided promise
  let result,
    error,
    pending = !!subject.then(r => result = r, e => error = e).finally(() => pending = false);

  /* eslint-disable-next-line no-unmodified-loop-condition */
  while (pending) yield new Promise(r => setImmediate(r));
  if (error) throw error;
  return result;
}

// An async generator that runs provided generators concurrently
export async function* yieldAll(all) {
  let res = new Array(all.length).fill();
  all = all.map(yieldTo);
  while (true) {
    res = await Promise.all(all.map((g, i) => {
      var _res$i, _res$i2;
      return (_res$i = res[i]) !== null && _res$i !== void 0 && _res$i.done ? res[i] : g.next((_res$i2 = res[i]) === null || _res$i2 === void 0 ? void 0 : _res$i2.value);
    }));
    let vals = res.map(r => r === null || r === void 0 ? void 0 : r.value);
    if (res.some(r => !(r !== null && r !== void 0 && r.done))) yield vals;else return vals;
  }
}

// An async generator that infinitely yields to the predicate function until a truthy value is
// returned. When a timeout is provided, an error will be thrown during the next iteration after the
// timeout has been exceeded. If an idle option is provided, the predicate will be yielded to a
// second time, after the idle period, to ensure the yielded value is still truthy. The poll option
// determines how long to wait before yielding to the predicate function during each iteration.
export async function* yieldFor(predicate, options = {}) {
  if (Number.isInteger(options)) options = {
    timeout: options
  };
  let {
    timeout,
    idle,
    poll = 10
  } = options;
  let start = Date.now();
  let done, value;
  while (true) {
    if (timeout && Date.now() - start >= timeout) {
      throw new Error(`Timeout of ${timeout}ms exceeded.`);
    } else if (!(value = yield predicate())) {
      done = await waitForTimeout(poll, false);
    } else if (idle && !done) {
      done = await waitForTimeout(idle, true);
    } else {
      return value;
    }
  }
}

// Promisified version of `yieldFor` above.
export function waitFor() {
  return generatePromise(yieldFor(...arguments));
}

// Promisified version of `setTimeout` (no callback argument).
export function waitForTimeout() {
  return new Promise(resolve => setTimeout(resolve, ...arguments));
}

// Browser-specific util to wait for a query selector to exist within an optional timeout.
/* istanbul ignore next: tested, but coverage is stripped */
async function waitForSelector(selector, timeout) {
  try {
    return await waitFor(() => document.querySelector(selector), timeout);
  } catch {
    throw new Error(`Unable to find: ${selector}`);
  }
}

// wait for a query selector to exist within an optional timeout inside browser
export async function waitForSelectorInsideBrowser(page, selector, timeout) {
  try {
    return page.eval(`await waitForSelector(${JSON.stringify(selector)}, ${timeout})`);
  } catch {
    throw new Error(`Unable to find: ${selector}`);
  }
}

// Browser-specific util to wait for an xpath selector to exist within an optional timeout.
/* istanbul ignore next: tested, but coverage is stripped */
async function waitForXPath(selector, timeout) {
  try {
    let xpath = () => document.evaluate(selector, document, null, 9, null);
    return await waitFor(() => xpath().singleNodeValue, timeout);
  } catch {
    throw new Error(`Unable to find: ${selector}`);
  }
}

// Browser-specific util to scroll to the bottom of a page, optionally calling the provided function
// after each window segment has been scrolled.
/* istanbul ignore next: tested, but coverage is stripped */
async function scrollToBottom(options, onScroll) {
  if (typeof options === 'function') [onScroll, options] = [options];
  let size = () => Math.ceil(document.body.scrollHeight / window.innerHeight);
  for (let s, i = 1; i < (s = size()); i++) {
    var _onScroll;
    window.scrollTo({
      ...options,
      top: window.innerHeight * i
    });
    await ((_onScroll = onScroll) === null || _onScroll === void 0 ? void 0 : _onScroll(i, s));
  }
}

// Used to test if a string looks like a function
const FUNC_REG = /^(async\s+)?(function\s*)?(\w+\s*)?\(.*?\)\s*(\{|=>)/is;

// Serializes the provided function with percy helpers for use in evaluating browser scripts
export function serializeFunction(fn) {
  // stringify or convert a function body into a complete function
  let fnbody = typeof fn === 'string' && !FUNC_REG.test(fn) ? `async function eval() {\n${fn}\n}` : fn.toString();

  // we might have a function shorthand if this fails
  /* eslint-disable-next-line no-new, no-new-func */
  try {
    new Function(`(${fnbody})`);
  } catch (error) {
    fnbody = fnbody.startsWith('async ') ? fnbody.replace(/^async/, 'async function') : `function ${fnbody}`;

    /* eslint-disable-next-line no-new, no-new-func */
    try {
      new Function(`(${fnbody})`);
    } catch (error) {
      throw new Error('The provided function is not serializable');
    }
  }

  // wrap the function body with percy helpers
  fnbody = 'function withPercyHelpers() {\n' + ['const { config, snapshot } = window.__PERCY__ ?? {};', `return (${fnbody})({`, '  config, snapshot, generatePromise, yieldFor,', '  waitFor, waitForTimeout, waitForSelector, waitForXPath,', '  scrollToBottom', '}, ...arguments);', `${isGenerator}`, `${generatePromise}`, `${yieldFor}`, `${waitFor}`, `${waitForTimeout}`, `${waitForSelector}`, `${waitForXPath}`, `${scrollToBottom}`].join('\n') + '\n}';

  /* istanbul ignore else: ironic. */
  if (fnbody.includes('cov_')) {
    // remove coverage statements during testing
    fnbody = fnbody.replace(/cov_.*?(;\n?|,)\s*/g, '');
  }
  return fnbody;
}
export async function withRetries(fn, {
  count,
  onRetry,
  signal,
  throwOn
}) {
  count || (count = 1); // default a single try
  let run = 0;
  while (true) {
    run += 1;
    try {
      return await generatePromise(fn, signal);
    } catch (e) {
      // if this error should not be retried on, we want to skip errors
      let throwError = throwOn === null || throwOn === void 0 ? void 0 : throwOn.includes(e.name);
      if (!throwError && run < count) {
        await (onRetry === null || onRetry === void 0 ? void 0 : onRetry());
        continue;
      }
      throw e;
    }
  }
}
export function redactSecrets(data) {
  const filepath = path.resolve(url.fileURLToPath(import.meta.url), '../secretPatterns.yml');
  const secretPatterns = YAML.parse(readFileSync(filepath, 'utf-8'));
  if (Array.isArray(data)) {
    // Process each item in the array
    return data.map(item => redactSecrets(item));
  } else if (typeof data === 'object' && data !== null) {
    // Process each key-value pair in the object
    data.message = redactSecrets(data.message);
  }
  if (typeof data === 'string') {
    for (const pattern of secretPatterns.patterns) {
      data = data.replace(new RegExp(pattern.pattern.regex, 'g'), '[REDACTED]');
    }
  }
  return data;
}

// Returns a base64 encoding of a string or buffer.
export function base64encode(content) {
  return Buffer.from(content).toString('base64');
}

// It checks if content is already gzipped or not.
// We don't want to gzip already gzipped content.
export function isGzipped(content) {
  if (!(content instanceof Uint8Array || content instanceof ArrayBuffer)) {
    return false;
  }

  // Ensure content is a Uint8Array
  const data = content instanceof ArrayBuffer ? new Uint8Array(content) : content;

  // Gzip magic number: 0x1f8b
  return data.length > 2 && data[0] === 0x1f && data[1] === 0x8b;
}
const RESERVED_CHARACTERS = {
  '%3A': ':',
  '%23': '#',
  '%24': '$',
  '%26': '&',
  '%2B': '+',
  '%2C': ',',
  '%2F': '/',
  '%3B': ';',
  '%3D': '=',
  '%3F': '?',
  '%40': '@'
};
function _replaceReservedCharactersWithPlaceholder(url) {
  let result = url;
  let matchedPattern = {};
  let placeHolderCount = 0;
  for (let key of Object.keys(RESERVED_CHARACTERS)) {
    let regex = new RegExp(key, 'g');
    if (regex.test(result)) {
      let placeholder = `__PERCY_PLACEHOLDER_${placeHolderCount}__`;
      result = result.replace(regex, placeholder);
      matchedPattern[placeholder] = key;
      placeHolderCount++;
    }
  }
  return {
    url: result,
    matchedPattern
  };
}
function _replacePlaceholdersWithReservedCharacters(matchedPattern, url) {
  let result = url;
  for (let [key, value] of Object.entries(matchedPattern)) {
    let regex = new RegExp(key, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

// This function replaces invalid character that are not the
// part of valid URI syntax with there correct encoded value.
// Also, if a character is a part of valid URI syntax, those characters
// are not encoded
// Eg: [abc] -> gets encoded to %5Babc%5D
// ab c -> ab%20c
export function decodeAndEncodeURLWithLogging(url, logger, options = {}) {
  // In case the url is partially encoded, then directly using encodeURI()
  // will encode those characters again. Therefore decodeURI once helps is decoding
  // partially encoded URL and then after encoding it again, full URL get encoded
  // correctly.
  const {
    meta,
    shouldLogWarning,
    warningMessage
  } = options;
  try {
    let {
      url: placeholderURL,
      matchedPattern
    } = _replaceReservedCharactersWithPlaceholder(url);
    let decodedURL = decodeURI(placeholderURL);
    let encodedURL = encodeURI(decodedURL);
    encodedURL = _replacePlaceholdersWithReservedCharacters(matchedPattern, encodedURL);
    return encodedURL;
  } catch (error) {
    logger.debug(error, meta);
    if (error.name === 'URIError' && shouldLogWarning) {
      logger.warn(warningMessage);
    }
    return url;
  }
}
export function snapshotLogName(name, meta) {
  var _meta$snapshot;
  if (meta !== null && meta !== void 0 && (_meta$snapshot = meta.snapshot) !== null && _meta$snapshot !== void 0 && _meta$snapshot.testCase) {
    return `testCase: ${meta.snapshot.testCase}, ${name}`;
  }
  return name;
}
export async function detectSystemProxyAndLog(applyProxy) {
  // if proxy is already set no need to check again
  if (process.env.HTTPS_PROXY || process.env.HTTP_PROXY) return;
  let proxyPresent = false;
  const log = logger('core:utils');
  // Checking proxy shouldn't cause failure
  try {
    const detectProxy = new DetectProxy();
    const proxies = await detectProxy.getSystemProxy();
    proxyPresent = proxies.length !== 0;
    if (proxyPresent) {
      if (applyProxy) {
        proxies.forEach(proxy => {
          if (proxy.type === 'HTTPS') {
            process.env.HTTPS_PROXY = 'https://' + proxy.host + ':' + proxy.port;
          } else if (proxy.type === 'HTTP') {
            process.env.HTTP_PROXY = 'http://' + proxy.host + ':' + proxy.port;
          }
        });
      } else {
        log.warn('We have detected a system level proxy in your system. use HTTP_PROXY or HTTPS_PROXY env vars or To auto apply proxy set useSystemProxy: true under percy in config file');
      }
    }
  } catch (e) {
    log.debug(`Failed to detect system proxy ${e}`);
  }
  return proxyPresent;
}

// DefaultMap, which returns a default value for an uninitialized key
// Similar to defaultDict in python
export class DefaultMap extends Map {
  constructor(getDefaultValue, ...mapConstructorArgs) {
    super(...mapConstructorArgs);
    if (typeof getDefaultValue !== 'function') {
      throw new Error('getDefaultValue must be a function');
    }
    this.getDefaultValue = getDefaultValue;
  }
  get = key => {
    if (!this.has(key)) {
      this.set(key, this.getDefaultValue(key));
    }
    return super.get(key);
  };
}
;
export function compareObjectTypes(obj1, obj2) {
  if (obj1 === obj2) return true; // Handles primitives
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) return false;
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (!keys2.includes(key) || !compareObjectTypes(obj1[key], obj2[key])) return false;
  }
  return true;
}
const OPTION_MAPPINGS = {
  name: 'name',
  widths: 'widths',
  scope: 'scope',
  scopeoptions: 'scopeOptions',
  minheight: 'minHeight',
  enablejavascript: 'enableJavaScript',
  enablelayout: 'enableLayout',
  clientinfo: 'clientInfo',
  environmentinfo: 'environmentInfo',
  sync: 'sync',
  testcase: 'testCase',
  labels: 'labels',
  thtestcaseexecutionid: 'thTestCaseExecutionId',
  browsers: 'browsers',
  resources: 'resources',
  meta: 'meta',
  snapshot: 'snapshot'
};
export function normalizeOptions(options) {
  const normalizedOptions = {};
  for (const key in options) {
    const lowerCaseKey = key.toLowerCase().replace(/[-_]/g, '');
    const normalizedKey = OPTION_MAPPINGS[lowerCaseKey] ? OPTION_MAPPINGS[lowerCaseKey] : key;
    normalizedOptions[normalizedKey] = options[key];
  }
  return normalizedOptions;
}
export async function* maybeScrollToBottom(page, discovery) {
  if (discovery.scrollToBottom && page.enableJavaScript) {
    yield page.eval('await scrollToBottom()');
  }
}