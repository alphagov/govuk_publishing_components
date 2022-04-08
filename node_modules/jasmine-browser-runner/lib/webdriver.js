function buildWebdriver(browserInfo, webdriverBuilder) {
  const webdriver = require('selenium-webdriver'),
    Capability = webdriver.Capability;

  webdriverBuilder = webdriverBuilder || new webdriver.Builder();
  const useSauce = typeof browserInfo === 'object' && browserInfo.useSauce;
  let browserName;

  if (typeof browserInfo === 'string') {
    browserName = browserInfo;
  } else if (browserInfo) {
    browserName = browserInfo.name;
  }

  browserName = browserName || 'firefox';

  if (!useSauce) {
    if (browserName === 'headlessChrome') {
      const caps = webdriver.Capabilities.chrome();
      caps.set('goog:chromeOptions', {
        args: [
          '--headless',
          '--no-sandbox',
          'window-size=1024,768',
          '--disable-gpu',
        ],
      });
      return webdriverBuilder
        .forBrowser('chrome')
        .withCapabilities(caps)
        .build();
    } else {
      return webdriverBuilder.forBrowser(browserName).build();
    }
  }

  const sauce = browserInfo.sauce;
  const capabilities = {
    [Capability.BROWSER_NAME]: browserName,
    build: sauce.build,
    tags: sauce.tags,
  };

  if (sauceRequiresLegacyJWPProps(browserName, sauce.browserVersion)) {
    capabilities.platform = sauce.os;
    capabilities.version = sauce.browserVersion;
    capabilities.tunnelIdentifier = sauce.tunnelIdentifier;
  } else {
    capabilities[Capability.PLATFORM_NAME] = sauce.os;
    capabilities[Capability.BROWSER_VERSION] = sauce.browserVersion;
    capabilities['sauce:options'] = {
      'tunnel-identifier': sauce.tunnelIdentifier,
    };
  }

  return webdriverBuilder
    .withCapabilities(capabilities)
    .usingServer(
      browserInfo.useSauce
        ? `http://${sauce.username}:${sauce.accessKey}@ondemand.saucelabs.com/wd/hub`
        : 'http://@localhost:4445/wd/hub'
    )
    .build();
}

function sauceRequiresLegacyJWPProps(browserName, browserVersion) {
  // Saucelabs supports W3C capability property names for most browsers,
  // but requires legacy JWP property names for some older browsers.
  // See <https://wiki.saucelabs.com/display/DOCS/W3C+Capabilities+Support>.
  // Of the browsers that Jasmine supports, only Safari <12 need JWP names.
  return browserName === 'safari' && parseInt(browserVersion, 10) < 12;
}

module.exports = { buildWebdriver };
