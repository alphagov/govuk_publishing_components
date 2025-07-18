import logger from '@percy/logger';
import Queue from './queue.js';
import Page from './page.js';
import { normalizeURL, hostnameMatches, createResource, createRootResource, createPercyCSSResource, createLogResource, yieldAll, snapshotLogName, waitForTimeout, withRetries, waitForSelectorInsideBrowser, isGzipped, maybeScrollToBottom } from './utils.js';
import { sha256hash } from '@percy/client/utils';
import Pako from 'pako';

// Logs verbose debug logs detailing various snapshot options.
function debugSnapshotOptions(snapshot) {
  let log = logger('core:snapshot');

  // log snapshot info
  log.debug('---------', snapshot.meta);
  log.debug(`Received snapshot: ${snapshot.name}`, snapshot.meta);

  // will log debug info for an object property if its value is defined
  let debugProp = (obj, prop, format = String) => {
    let val = prop.split('.').reduce((o, k) => o === null || o === void 0 ? void 0 : o[k], obj);
    if (val != null) {
      // join formatted array values with a space
      val = [].concat(val).map(format).join(', ');
      log.debug(`- ${prop}: ${val}`, snapshot.meta);
    }
  };
  debugProp(snapshot, 'url');
  debugProp(snapshot, 'scope');
  debugProp(snapshot, 'widths', v => `${v}px`);
  debugProp(snapshot, 'minHeight', v => `${v}px`);
  debugProp(snapshot, 'enableJavaScript');
  debugProp(snapshot, 'cliEnableJavaScript');
  debugProp(snapshot, 'disableShadowDOM');
  debugProp(snapshot, 'enableLayout');
  debugProp(snapshot, 'domTransformation');
  debugProp(snapshot, 'reshuffleInvalidTags');
  debugProp(snapshot, 'deviceScaleFactor');
  debugProp(snapshot, 'waitForTimeout');
  debugProp(snapshot, 'waitForSelector');
  debugProp(snapshot, 'scopeOptions.scroll');
  debugProp(snapshot, 'browsers');
  debugProp(snapshot, 'execute.afterNavigation');
  debugProp(snapshot, 'execute.beforeResize');
  debugProp(snapshot, 'execute.afterResize');
  debugProp(snapshot, 'execute.beforeSnapshot');
  debugProp(snapshot, 'discovery.allowedHostnames');
  debugProp(snapshot, 'discovery.disallowedHostnames');
  debugProp(snapshot, 'discovery.devicePixelRatio');
  debugProp(snapshot, 'discovery.requestHeaders', JSON.stringify);
  debugProp(snapshot, 'discovery.authorization', JSON.stringify);
  debugProp(snapshot, 'discovery.disableCache');
  debugProp(snapshot, 'discovery.captureMockedServiceWorker');
  debugProp(snapshot, 'discovery.captureSrcset');
  debugProp(snapshot, 'discovery.userAgent');
  debugProp(snapshot, 'clientInfo');
  debugProp(snapshot, 'environmentInfo');
  debugProp(snapshot, 'domSnapshot', Boolean);
  debugProp(snapshot, 'discovery.scrollToBottom');
  if (Array.isArray(snapshot.domSnapshot)) {
    debugProp(snapshot, 'domSnapshot.0.userAgent');
  } else {
    debugProp(snapshot, 'domSnapshot.userAgent');
  }
  for (let added of snapshot.additionalSnapshots || []) {
    log.debug(`Additional snapshot: ${added.name}`, snapshot.meta);
    debugProp(added, 'waitForTimeout');
    debugProp(added, 'waitForSelector');
    debugProp(added, 'execute');
  }
}

// parse browser cookies in correct format if flag is enabled
function parseCookies(cookies) {
  if (process.env.PERCY_DO_NOT_USE_CAPTURED_COOKIES === 'true') return null;

  // If cookies is collected via SDK
  if (Array.isArray(cookies) && cookies.every(item => typeof item === 'object' && 'name' in item && 'value' in item)) {
    // omit other fields reason sometimes expiry comes as actual date where we expect it to be double
    return cookies.map(c => ({
      name: c.name,
      value: c.value,
      secure: c.secure,
      domain: c.domain
    }));
  }
  if (!(typeof cookies === 'string' && cookies !== '')) return null;
  // it assumes that cookiesStr is string returned by document.cookie
  const cookiesStr = cookies;
  return cookiesStr.split('; ').map(c => {
    const eqIdx = c.indexOf('=');
    const name = c.substring(0, eqIdx);
    const value = c.substring(eqIdx + 1);
    const cookieObj = {
      name,
      value
    };
    if (name.startsWith('__Secure')) {
      cookieObj.secure = true;
    }
    return cookieObj;
  });
}

// Wait for a page's asset discovery network to idle
function waitForDiscoveryNetworkIdle(page, options) {
  let {
    allowedHostnames,
    networkIdleTimeout,
    captureResponsiveAssetsEnabled
  } = options;
  let filter = r => hostnameMatches(allowedHostnames, r.url);
  return page.network.idle(filter, networkIdleTimeout, captureResponsiveAssetsEnabled);
}
async function waitForFontLoading(page) {
  return await logger.measure('core:discovery', 'waitForFontLoading', undefined, async () => {
    return await Promise.race([page.eval('await document.fonts.ready;'), new Promise(res => setTimeout(res, 5000))]);
  });
}

// Creates an initial resource map for a snapshot containing serialized DOM
function parseDomResources({
  url,
  domSnapshot
}) {
  const map = new Map();
  if (!domSnapshot) return map;
  let allRootResources = new Set();
  let allResources = new Set();
  if (!Array.isArray(domSnapshot)) {
    domSnapshot = [domSnapshot];
  }
  for (let dom of domSnapshot) {
    let isHTML = typeof dom === 'string';
    let {
      html,
      resources = []
    } = isHTML ? {
      html: dom
    } : dom;
    resources.forEach(r => allResources.add(r));
    const attrs = dom.width ? {
      widths: [dom.width]
    } : {};
    let rootResource = createRootResource(url, html, attrs);
    allRootResources.add(rootResource);
  }
  allRootResources = Array.from(allRootResources);
  map.set(allRootResources[0].url, allRootResources);
  allResources = Array.from(allResources);

  // reduce the array of resources into a keyed map
  return allResources.reduce((map, {
    url,
    content,
    mimetype
  }) => {
    // serialized resource contents are base64 encoded
    content = Buffer.from(content, mimetype.includes('text') ? 'utf8' : 'base64');
    // specify the resource as provided to prevent overwriting during asset discovery
    let resource = createResource(url, content, mimetype, {
      provided: true
    });
    // key the resource by its url and return the map
    return map.set(resource.url, resource);
    // the initial map is created with at least a root resource
  }, map);
}
function createAndApplyPercyCSS({
  percyCSS,
  roots
}) {
  let css = createPercyCSSResource(roots[0].url, percyCSS);

  // replace root contents and associated properties
  roots.forEach(root => {
    Object.assign(root, createRootResource(root.url, root.content.replace(/(<\/body>)(?!.*\1)/is, `<link data-percy-specific-css rel="stylesheet" href="${css.pathname}"/>` + '$&')));
  });
  return css;
}

// Calls the provided callback with additional resources
function processSnapshotResources({
  domSnapshot,
  resources,
  ...snapshot
}) {
  var _resources;
  let log = logger('core:snapshot');
  resources = [...(((_resources = resources) === null || _resources === void 0 ? void 0 : _resources.values()) ?? [])];

  // find any root resource matching the provided dom snapshot
  // since root resources are stored as array
  let roots = resources.find(r => Array.isArray(r));

  // initialize root resources if needed
  if (!roots) {
    let domResources = parseDomResources({
      ...snapshot,
      domSnapshot
    });
    resources = [...domResources.values(), ...resources];
    roots = resources.find(r => Array.isArray(r));
  }

  // inject Percy CSS
  if (snapshot.percyCSS) {
    // check @percy/dom/serialize-dom.js
    let domSnapshotHints = (domSnapshot === null || domSnapshot === void 0 ? void 0 : domSnapshot.hints) ?? [];
    if (domSnapshotHints.includes('DOM elements found outside </body>')) {
      log.warn('DOM elements found outside </body>, percyCSS might not work');
    }
    const percyCSSReource = createAndApplyPercyCSS({
      percyCSS: snapshot.percyCSS,
      roots
    });
    resources.push(percyCSSReource);
  }

  // For multi dom root resources are stored as array
  resources = resources.flat();

  // include associated snapshot logs matched by meta information
  resources.push(createLogResource(logger.query(log => {
    var _log$meta$snapshot, _log$meta$snapshot2;
    return ((_log$meta$snapshot = log.meta.snapshot) === null || _log$meta$snapshot === void 0 ? void 0 : _log$meta$snapshot.testCase) === snapshot.meta.snapshot.testCase && ((_log$meta$snapshot2 = log.meta.snapshot) === null || _log$meta$snapshot2 === void 0 ? void 0 : _log$meta$snapshot2.name) === snapshot.meta.snapshot.name;
  })));
  if (process.env.PERCY_GZIP) {
    for (let index = 0; index < resources.length; index++) {
      const alreadyZipped = isGzipped(resources[index].content);
      /* istanbul ignore next: very hard to mock true */
      if (!alreadyZipped) {
        resources[index].content = Pako.gzip(resources[index].content);
        resources[index].sha = sha256hash(resources[index].content);
      }
    }
  }
  return {
    ...snapshot,
    resources
  };
}

// Triggers the capture of resource requests for a page by iterating over snapshot widths to resize
// the page and calling any provided execute options.
async function* captureSnapshotResources(page, snapshot, options) {
  var _snapshot$domSnapshot, _snapshot$domSnapshot2;
  const log = logger('core:discovery');
  let {
    discovery,
    additionalSnapshots = [],
    ...baseSnapshot
  } = snapshot;
  let {
    capture,
    captureWidths,
    deviceScaleFactor,
    mobile,
    captureForDevices
  } = options;
  let cookies = ((_snapshot$domSnapshot = snapshot.domSnapshot) === null || _snapshot$domSnapshot === void 0 ? void 0 : _snapshot$domSnapshot.cookies) || ((_snapshot$domSnapshot2 = snapshot.domSnapshot) === null || _snapshot$domSnapshot2 === void 0 || (_snapshot$domSnapshot2 = _snapshot$domSnapshot2[0]) === null || _snapshot$domSnapshot2 === void 0 ? void 0 : _snapshot$domSnapshot2.cookies);
  cookies = parseCookies(cookies);

  // iterate over device to trigger reqeusts and capture other dpr width
  async function* captureResponsiveAssets() {
    for (const device of captureForDevices) {
      discovery = {
        ...discovery,
        captureResponsiveAssetsEnabled: true
      };

      // We are not adding these widths and pixels ratios in loop below because we want to explicitly reload the page after resize which we dont do below
      yield* captureSnapshotResources(page, {
        ...snapshot,
        discovery,
        widths: [device.width]
      }, {
        deviceScaleFactor: device.deviceScaleFactor,
        mobile: true
      });
      yield waitForFontLoading(page);
      yield waitForDiscoveryNetworkIdle(page, discovery);
    }
  }

  // used to take snapshots and remove any discovered root resource
  async function* takeSnapshot(options, width) {
    if (captureWidths) options = {
      ...options,
      width
    };
    let captured = await page.snapshot(options);
    yield* captureResponsiveAssets();
    captured.resources.delete(normalizeURL(captured.url));
    capture(processSnapshotResources(captured));
    return captured;
  }
  ;

  // used to resize the using capture options
  let resizePage = width => {
    page.network.intercept.currentWidth = width;
    return page.resize({
      height: snapshot.minHeight,
      deviceScaleFactor,
      mobile,
      width
    });
  };

  // navigate to the url
  yield resizePage(snapshot.widths[0]);
  yield page.goto(snapshot.url, {
    cookies,
    forceReload: discovery.captureResponsiveAssetsEnabled
  });

  // wait for any specified timeout
  if (snapshot.discovery.waitForTimeout && page.enableJavaScript) {
    log.debug(`Wait for ${snapshot.discovery.waitForTimeout}ms timeout`);
    await waitForTimeout(snapshot.discovery.waitForTimeout);
  }

  // wait for any specified selector
  if (snapshot.discovery.waitForSelector && page.enableJavaScript) {
    log.debug(`Wait for selector: ${snapshot.discovery.waitForSelector}`);
    await waitForSelectorInsideBrowser(page, snapshot.discovery.waitForSelector, Page.TIMEOUT);
  }
  if (snapshot.execute) {
    // when any execute options are provided, inject snapshot options
    /* istanbul ignore next: cannot detect coverage of injected code */
    yield page.eval((_, s) => window.__PERCY__.snapshot = s, snapshot);
    yield page.evaluate(snapshot.execute.afterNavigation);
  }
  yield* maybeScrollToBottom(page, discovery);

  // Running before page idle since this will trigger many network calls
  // so need to run as early as possible. plus it is just reading urls from dom srcset
  // which will be already loaded after navigation complete
  // Don't run incase of responsiveSnapshotCapture since we are running discovery for all widths so images will get captured in all required widths
  if (!snapshot.responsiveSnapshotCapture && discovery.captureSrcset) {
    await page.insertPercyDom();
    yield page.eval('window.PercyDOM.loadAllSrcsetLinks()');
  }

  // iterate over additional snapshots for proper DOM capturing
  for (let additionalSnapshot of [baseSnapshot, ...additionalSnapshots]) {
    let isBaseSnapshot = additionalSnapshot === baseSnapshot;
    let snap = {
      ...baseSnapshot,
      ...additionalSnapshot
    };
    let {
      widths,
      execute
    } = snap;
    let [width] = widths;

    // iterate over widths to trigger reqeusts and capture other widths
    if (isBaseSnapshot || captureWidths) {
      for (let i = 0; i < widths.length - 1; i++) {
        if (captureWidths) yield* takeSnapshot(snap, width);
        yield page.evaluate(execute === null || execute === void 0 ? void 0 : execute.beforeResize);
        yield waitForFontLoading(page);
        yield waitForDiscoveryNetworkIdle(page, discovery);
        yield resizePage(width = widths[i + 1]);
        if (snapshot.responsiveSnapshotCapture) {
          yield page.goto(snapshot.url, {
            cookies,
            forceReload: true
          });
        }
        yield page.evaluate(execute === null || execute === void 0 ? void 0 : execute.afterResize);
        yield* maybeScrollToBottom(page, discovery);
      }
    }
    if (capture && !snapshot.domSnapshot) {
      // capture this snapshot and update the base snapshot after capture
      let captured = yield* takeSnapshot(snap, width);
      if (isBaseSnapshot) baseSnapshot = captured;

      // resize back to the initial width when capturing additional snapshot widths
      if (captureWidths && additionalSnapshots.length) {
        let l = additionalSnapshots.indexOf(additionalSnapshot) + 1;
        if (l < additionalSnapshots.length) yield resizePage(snapshot.widths[0]);
      }
    }
  }

  // recursively trigger resource requests for any alternate device pixel ratio
  if (discovery.devicePixelRatio) {
    log.deprecated('discovery.devicePixelRatio is deprecated percy will now auto capture resource in all devicePixelRatio, Ignoring configuration');
  }

  // wait for final network idle when not capturing DOM
  if (capture && snapshot.domSnapshot) {
    yield waitForFontLoading(page);
    yield waitForDiscoveryNetworkIdle(page, discovery);
    yield* captureResponsiveAssets();
    capture(processSnapshotResources(snapshot));
  }
}

// Pushes all provided snapshots to a discovery queue with the provided callback, yielding to each
// one concurrently. When skipping asset discovery, the callback is called immediately for each
// snapshot, also processing snapshot resources when not dry-running.
export async function* discoverSnapshotResources(queue, options, callback) {
  let {
    snapshots,
    skipDiscovery,
    dryRun,
    checkAndUpdateConcurrency
  } = options;
  yield* yieldAll(snapshots.reduce((all, snapshot) => {
    debugSnapshotOptions(snapshot);
    if (skipDiscovery) {
      let {
        additionalSnapshots,
        ...baseSnapshot
      } = snapshot;
      additionalSnapshots = dryRun && additionalSnapshots || [];
      for (let snap of [baseSnapshot, ...additionalSnapshots]) {
        callback(dryRun ? snap : processSnapshotResources(snap));
      }
    } else {
      // update concurrency before pushing new job in discovery queue
      // if case of monitoring is stopped due to in-activity,
      // it can take upto 1 sec to execute this fun
      checkAndUpdateConcurrency();
      all.push(queue.push(snapshot, callback));
    }
    return all;
  }, []));
}

// Used to cache resources across core instances
export const RESOURCE_CACHE_KEY = Symbol('resource-cache');

// Creates an asset discovery queue that uses the percy browser instance to create a page for each
// snapshot which is used to intercept and capture snapshot resource requests.
export function createDiscoveryQueue(percy) {
  let {
    concurrency
  } = percy.config.discovery;
  let queue = new Queue('discovery');
  let cache;
  return queue.set({
    concurrency
  })
  // on start, launch the browser and run the queue
  .handle('start', async () => {
    cache = percy[RESOURCE_CACHE_KEY] = new Map();

    // If browser.launch() fails it will get captured in
    // *percy.start()
    await percy.browser.launch();
    queue.run();
  })
  // on end, close the browser
  .handle('end', async () => {
    await percy.browser.close();
  })
  // snapshots are unique by name and testCase; when deferred also by widths
  .handle('find', ({
    name,
    testCase,
    widths
  }, snapshot) => snapshot.testCase === testCase && snapshot.name === name && (!percy.deferUploads || !widths || widths.join() === snapshot.widths.join()))
  // initialize the resources for DOM snapshots
  .handle('push', snapshot => {
    let resources = parseDomResources(snapshot);
    return {
      ...snapshot,
      resources
    };
  })
  // discovery resources for snapshots and call the callback for each discovered snapshot
  .handle('task', async function* (snapshot, callback) {
    await logger.measure('asset-discovery', snapshot.name, snapshot.meta, async () => {
      percy.log.debug(`Discovering resources: ${snapshot.name}`, snapshot.meta);

      // expectation explained in tests
      /* istanbul ignore next: tested, but coverage is stripped */
      let assetDiscoveryPageEnableJS = snapshot.cliEnableJavaScript && !snapshot.domSnapshot || (snapshot.enableJavaScript ?? !snapshot.domSnapshot);
      percy.log.debug(`Asset discovery Browser Page enable JS: ${assetDiscoveryPageEnableJS}`, snapshot.meta);
      await withRetries(async function* () {
        // create a new browser page
        let page = yield percy.browser.page({
          enableJavaScript: assetDiscoveryPageEnableJS,
          networkIdleTimeout: snapshot.discovery.networkIdleTimeout,
          requestHeaders: snapshot.discovery.requestHeaders,
          authorization: snapshot.discovery.authorization,
          userAgent: snapshot.discovery.userAgent,
          captureMockedServiceWorker: snapshot.discovery.captureMockedServiceWorker,
          meta: {
            ...snapshot.meta,
            snapshotURL: snapshot.url
          },
          // enable network inteception
          intercept: {
            enableJavaScript: snapshot.enableJavaScript,
            disableCache: snapshot.discovery.disableCache,
            allowedHostnames: snapshot.discovery.allowedHostnames,
            disallowedHostnames: snapshot.discovery.disallowedHostnames,
            getResource: (u, width = null) => {
              let resource = snapshot.resources.get(u) || cache.get(u);
              if (resource && Array.isArray(resource) && resource[0].root) {
                const rootResource = resource.find(r => {
                  var _r$widths;
                  return (_r$widths = r.widths) === null || _r$widths === void 0 ? void 0 : _r$widths.includes(width);
                });
                resource = rootResource || resource[0];
              }
              return resource;
            },
            saveResource: r => {
              const limitResources = process.env.LIMIT_SNAPSHOT_RESOURCES || false;
              const MAX_RESOURCES = Number(process.env.MAX_SNAPSHOT_RESOURCES) || 749;
              if (limitResources && snapshot.resources.size >= MAX_RESOURCES) {
                percy.log.debug(`Skipping resource ${r.url} — resource limit reached`);
                return;
              }
              snapshot.resources.set(r.url, r);
              if (!snapshot.discovery.disableCache) {
                cache.set(r.url, r);
              }
            }
          }
        });
        try {
          yield* captureSnapshotResources(page, snapshot, {
            captureWidths: !snapshot.domSnapshot && percy.deferUploads,
            capture: callback,
            captureForDevices: percy.deviceDetails || []
          });
        } finally {
          // always close the page when done
          await page.close();
        }
      }, {
        count: snapshot.discovery.retry ? 3 : 1,
        onRetry: () => {
          percy.log.info(`Retrying snapshot: ${snapshotLogName(snapshot.name, snapshot.meta)}`, snapshot.meta);
        },
        signal: snapshot._ctrl.signal,
        throwOn: ['AbortError']
      });
    });
  }).handle('error', async ({
    name,
    meta
  }, error) => {
    if (error.name === 'AbortError' && queue.readyState < 3) {
      // only error about aborted snapshots when not closed
      let errMsg = 'Received a duplicate snapshot, ' + `the previous snapshot was aborted: ${snapshotLogName(name, meta)}`;
      percy.log.error(errMsg, {
        snapshotLevel: true,
        snapshotName: name
      });
      await percy.suggestionsForFix(errMsg, meta);
    } else {
      // log all other encountered errors
      let errMsg = `Encountered an error taking snapshot: ${name}`;
      percy.log.error(errMsg, meta);
      percy.log.error(error, meta);
      let assetDiscoveryErrors = [{
        message: errMsg,
        meta
      }, {
        message: error === null || error === void 0 ? void 0 : error.message,
        meta
      }];
      await percy.suggestionsForFix(assetDiscoveryErrors, {
        snapshotLevel: true,
        snapshotName: name
      });
    }
  });
}