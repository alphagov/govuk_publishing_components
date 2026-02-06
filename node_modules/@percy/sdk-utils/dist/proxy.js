"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProxyHttpsAgent = exports.ProxyHttpAgent = void 0;
exports.createPacAgent = createPacAgent;
exports.getProxy = getProxy;
exports.hostnameMatches = hostnameMatches;
exports.href = href;
exports.port = port;
exports.proxyAgentFor = proxyAgentFor;
var _net = _interopRequireDefault(require("net"));
var _tls = _interopRequireDefault(require("tls"));
var _http = _interopRequireDefault(require("http"));
var _https = _interopRequireDefault(require("https"));
var _logger = _interopRequireDefault(require("./logger.js"));
var _pacProxyAgent = require("pac-proxy-agent");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const CRLF = '\r\n';
const STATUS_REG = /^HTTP\/1.[01] (\d*)/;

/**
 * Local proxy implementation for sdk-utils package
 *
 * WHY THIS EXISTS:
 * ================
 * This is a self-contained proxy implementation copied and simplified from
 * @percy/client/src/proxy.js. We cannot directly import from @percy/client/utils
 * due to several module compatibility and build system issues:
 *
 * 1. MODULE TYPE MISMATCH:
 *    - @percy/client is built as an ES module ("type": "module")
 *    - @percy/sdk-utils gets built as CommonJS by Rollup/Babel
 *    - Runtime import() calls get transformed to require() calls by the build system
 *    - This causes "require() of ES Module not supported" errors at runtime
 *
 * 2. BUILD SYSTEM TRANSFORMATION:
 *    - Rollup/Babel transforms dynamic imports even when marked as external
 *    - Attempts to use eval() or Function constructor to bypass transformation
 *      either fail with "experimental-vm-modules" requirements or still get transformed
 *
 * 3. DEPENDENCY RESOLUTION:
 *    - Cross-package imports create complex dependency resolution issues
 *    - The sdk-utils package needs to be self-contained for broader compatibility
 *
 * 4. RUNTIME ENVIRONMENT DIFFERENCES:
 *    - sdk-utils may run in different environments than the main Percy CLI
 *    - A local implementation ensures consistent behavior regardless of environment
 *
 * WHAT'S DIFFERENT FROM CLIENT VERSION:
 * ====================================
 * - Removed PAC proxy support (pac-proxy-agent dependency)
 * - Removed @percy/env dependency (inlined stripQuotesAndSpaces function)
 * - Uses local logger instead of @percy/logger
 * - Simplified error handling and logging
 * - Removed some advanced features to keep it lightweight
 *
 * This approach ensures proxy functionality works reliably without external
 * import complications while maintaining the same core HTTP/HTTPS proxy features.
 */

// function to create PAC proxy agent
function createPacAgent(pacUrl, options = {}) {
  pacUrl = stripQuotesAndSpaces(pacUrl);
  try {
    const agent = new _pacProxyAgent.PacProxyAgent(pacUrl, {
      keepAlive: true,
      ...options
    });
    (0, _logger.default)('sdk-utils:proxy').info(`Successfully loaded PAC file from: ${pacUrl}`);
    return agent;
  } catch (error) {
    (0, _logger.default)('sdk-utils:proxy').error(`Failed to load PAC file, error message: ${error.message},  stack: ${error.stack}`);
    throw new Error(`Failed to initialize PAC proxy: ${error.message}`);
  }
}

// Returns true if the URL hostname matches any patterns
function hostnameMatches(patterns, url) {
  let subject = new URL(url);
  patterns = typeof patterns === 'string' ? patterns.split(/[\s,]+/) : [].concat(patterns);
  for (let pattern of patterns) {
    if (pattern === '*') return true;
    if (!pattern) continue;

    // parse pattern
    let {
      groups: rule
    } = pattern.match(/^(?<hostname>.+?)(?::(?<port>\d+))?$/);

    // missing a hostname or ports do not match
    if (!rule.hostname || rule.port && rule.port !== subject.port) {
      continue;
    }

    // wildcards are treated the same as leading dots
    rule.hostname = rule.hostname.replace(/^\*/, '');

    // hostnames are equal or end with a wildcard rule
    if (rule.hostname === subject.hostname || rule.hostname.startsWith('.') && subject.hostname.endsWith(rule.hostname)) {
      return true;
    }
  }
  return false;
}

// Returns the port number of a URL object. Defaults to port 443 for https
// protocols or port 80 otherwise.
function port(options) {
  if (options.port) return options.port;
  return options.protocol === 'https:' ? 443 : 80;
}

// Returns a string representation of a URL-like object
function href(options) {
  let {
    protocol,
    hostname,
    path,
    pathname,
    search,
    hash
  } = options;
  return `${protocol}//${hostname}:${port(options)}` + (path || `${pathname || ''}${search || ''}${hash || ''}`);
}

// Strip quotes and spaces from environment variables
function stripQuotesAndSpaces(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/^["'\s]+|["'\s]+$/g, '');
}

// Returns the proxy URL for a set of request options
function getProxy(options) {
  let proxyUrl = options.protocol === 'https:' && (process.env.https_proxy || process.env.HTTPS_PROXY) || process.env.http_proxy || process.env.HTTP_PROXY;

  // Always exclude localhost/127.0.0.1 from proxying to prevent internal loops
  //
  // CRITICAL: Percy SDK communicates with percy-cli server via HTTP calls to localhost:5338
  // When HTTP_PROXY is set, these internal communications would be routed through the proxy,
  // creating a feedback loop that causes memory leaks and crashes:
  //
  // 1. SDK makes request to localhost:5338/percy/log (internal communication)
  // 2. Request gets routed through external proxy due to HTTP_PROXY setting
  // 3. Proxy forwards request back to localhost:5338 (adds latency + overhead)
  // 4. Percy server processes request and generates internal logs/metrics
  // 5. Those logs trigger MORE requests to localhost:5338/percy/log
  // 6. Each new request also gets proxied, creating exponential growth
  // 7. Eventually: JavaScript heap exhaustion and process crash
  //
  // By excluding localhost by default, we ensure:
  // - External requests (percy.io, etc.) go through proxy as intended
  // - Internal percy-cli ↔ sdk communications remain fast and direct
  // - No risk of internal communication loops or memory leaks
  //
  // This follows standard industry practice - most proxy implementations
  // (Docker, browsers, corporate proxies) exclude localhost by default.
  let noProxyList = stripQuotesAndSpaces(process.env.no_proxy || process.env.NO_PROXY) || '';
  const defaultNoProxy = 'localhost,127.0.0.1,::1,[::1]';
  noProxyList = noProxyList ? `${noProxyList},${defaultNoProxy}` : defaultNoProxy;
  let shouldProxy = !!proxyUrl && !hostnameMatches(noProxyList, href(options));
  if (proxyUrl && typeof proxyUrl === 'string') {
    proxyUrl = stripQuotesAndSpaces(proxyUrl);
  }
  if (shouldProxy) {
    proxyUrl = new URL(proxyUrl);
    let isHttps = proxyUrl.protocol === 'https:';
    if (!isHttps && proxyUrl.protocol !== 'http:') {
      throw new Error(`Unsupported proxy protocol: ${proxyUrl.protocol}`);
    }
    let proxy = {
      isHttps
    };
    proxy.auth = !!proxyUrl.username && 'Basic ' + (proxyUrl.password ? Buffer.from(`${proxyUrl.username}:${proxyUrl.password}`) : Buffer.from(proxyUrl.username)).toString('base64');
    proxy.host = proxyUrl.hostname;
    proxy.port = port(proxyUrl);
    proxy.connect = () => (isHttps ? _tls.default : _net.default).connect({
      rejectUnauthorized: options.rejectUnauthorized,
      host: proxy.host,
      port: proxy.port
    });
    return proxy;
  }
}

// Proxified http agent
class ProxyHttpAgent extends _http.default.Agent {
  // needed for https proxies
  httpsAgent = new _https.default.Agent({
    keepAlive: true
  });
  addRequest(request, options) {
    var _request$outputData;
    let proxy = getProxy(options);
    if (!proxy) return super.addRequest(request, options);
    (0, _logger.default)('sdk-utils:proxy').debug(`Proxying request: ${href(options)} via ${proxy.host}:${proxy.port}`);

    // modify the request for proxying
    request.path = href(options);
    if (proxy.auth) {
      request.setHeader('Proxy-Authorization', proxy.auth);
    }

    // regenerate headers since we just changed things
    delete request._header;
    request._implicitHeader();
    if (((_request$outputData = request.outputData) === null || _request$outputData === void 0 ? void 0 : _request$outputData.length) > 0) {
      let first = request.outputData[0].data;
      let endOfHeaders = first.indexOf(CRLF.repeat(2)) + 4;
      request.outputData[0].data = request._header + first.substring(endOfHeaders);
    }

    // coerce the connection to the proxy
    options.port = proxy.port;
    options.host = proxy.host;
    delete options.path;
    if (proxy.isHttps) {
      // use the underlying https agent to complete the connection
      request.agent = this.httpsAgent;
      return this.httpsAgent.addRequest(request, options);
    } else {
      return super.addRequest(request, options);
    }
  }
}

// Proxified https agent
exports.ProxyHttpAgent = ProxyHttpAgent;
class ProxyHttpsAgent extends _https.default.Agent {
  constructor(options) {
    // default keep-alive
    super({
      keepAlive: true,
      ...options
    });
  }
  createConnection(options, callback) {
    let proxy = getProxy(options);
    if (!proxy) return super.createConnection(options, callback);
    (0, _logger.default)('sdk-utils:proxy').debug(`Proxying request: ${href(options)}`);

    // generate proxy connect message
    let host = `${options.hostname}:${port(options)}`;
    let connectMessage = [`CONNECT ${host} HTTP/1.1`, `Host: ${host}`];
    if (proxy.auth) {
      connectMessage.push(`Proxy-Authorization: ${proxy.auth}`);
    }
    connectMessage = connectMessage.join(CRLF);
    connectMessage += CRLF.repeat(2);

    // start the proxy connection and setup listeners
    let socket = proxy.connect();
    let handleError = err => {
      var _err$message, _err$message2;
      socket.destroy(err);
      (0, _logger.default)('sdk-utils:proxy').error(`Proxying request ${href(options)} failed: ${err}`);

      // We don't get statusCode here, relying on checking error message only
      if (!!err.message && ((_err$message = err.message) !== null && _err$message !== void 0 && _err$message.includes('ECONNREFUSED') || (_err$message2 = err.message) !== null && _err$message2 !== void 0 && _err$message2.includes('EHOSTUNREACH'))) {
        (0, _logger.default)('sdk-utils:proxy').warn('If needed, please verify that your proxy credentials are correct.');
        (0, _logger.default)('sdk-utils:proxy').warn('Please check that your proxy is configured correctly and reachable.');
      }
      (0, _logger.default)('sdk-utils:proxy').warn('Please ensure that the following domains are whitelisted: github.com, percy.io, storage.googleapis.com. If you are an enterprise customer, also whitelist "percy-enterprise.browserstack.com".');
      callback(err);
    };
    let handleClose = () => handleError(new Error('Connection closed while sending request to upstream proxy'));
    let buffer = '';
    let handleData = data => {
      var _buffer$match;
      buffer += data.toString();
      // haven't received end of headers yet, keep buffering
      if (!buffer.includes(CRLF.repeat(2))) return;
      // stop listening after end of headers
      socket.off('data', handleData);
      if (((_buffer$match = buffer.match(STATUS_REG)) === null || _buffer$match === void 0 ? void 0 : _buffer$match[1]) !== '200') {
        return handleError(new Error('Error establishing proxy connection. ' + `Response from server was: ${buffer}`));
      }
      options.socket = socket;
      options.servername = options.hostname;
      // callback not passed in so not to be added as a listener
      callback(null, super.createConnection(options));
    };

    // send and handle the connect message
    socket.on('error', handleError).on('close', handleClose).on('data', handleData).write(connectMessage);
  }
}
exports.ProxyHttpsAgent = ProxyHttpsAgent;
function proxyAgentFor(url, options) {
  let cache = proxyAgentFor.cache || (proxyAgentFor.cache = new Map());
  let {
    protocol,
    hostname
  } = new URL(url);
  let cachekey = `${protocol}//${hostname}`;

  // If we already have a cached agent, return it
  if (cache.has(cachekey)) {
    return cache.get(cachekey);
  }
  try {
    let agent;
    const pacUrl = process.env.PERCY_PAC_FILE_URL;

    // If PAC URL is provided, use PAC proxy
    if (pacUrl) {
      (0, _logger.default)('sdk-utils:proxy').info(`Using PAC file from: ${pacUrl}`);
      agent = createPacAgent(pacUrl, options);
    } else {
      // Fall back to other proxy configuration
      agent = protocol === 'https:' ? new ProxyHttpsAgent(options) : new ProxyHttpAgent(options);
    }

    // Cache the created agent
    cache.set(cachekey, agent);
    return agent;
  } catch (error) {
    (0, _logger.default)('sdk-utils:proxy').error(`Failed to create proxy agent: ${error.message}`);
    throw error;
  }
}