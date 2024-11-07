function buildWebdriver(browserInfo, webdriverBuilder) {
  const webdriver = require('selenium-webdriver'),
    Capability = webdriver.Capability;

  webdriverBuilder = webdriverBuilder || new webdriver.Builder();
  const useSauce = typeof browserInfo === 'object' && browserInfo.useSauce;
  const useRemote =
    typeof browserInfo === 'object' && browserInfo.useRemoteSeleniumGrid;
  let browserName;

  if (typeof browserInfo === 'string') {
    browserName = browserInfo;
  } else if (browserInfo) {
    browserName = browserInfo.name;
  }

  browserName = browserName || 'firefox';

  if (!(useRemote || useSauce)) {
    if (browserName === 'headlessChrome') {
      const caps = webdriver.Capabilities.chrome();
      caps.set('goog:chromeOptions', {
        args: [
          '--headless=new',
          '--no-sandbox',
          'window-size=1024,768',
          '--disable-gpu',
          '--disable-dev-shm-usage', // flag needed to avoid issues within docker https://stackoverflow.com/questions/56218242/headless-chromium-on-docker-fails
        ],
      });
      return webdriverBuilder
        .forBrowser('chrome')
        .withCapabilities(caps)
        .build();
    } else if (browserName === 'headlessFirefox') {
      const caps = webdriver.Capabilities.firefox();
      caps.set('moz:firefoxOptions', {
        args: ['--headless', '--width=1024', '--height=768'],
      });
      return webdriverBuilder
        .forBrowser('firefox')
        .withCapabilities(caps)
        .build();
    } else {
      return webdriverBuilder.forBrowser(browserName).build();
    }
  }

  let url;
  let capabilities;
  if (useRemote) {
    const remote = browserInfo.remoteSeleniumGrid;
    if (remote) {
      url = remote.url;
      capabilities = {
        ...remote,
        [Capability.BROWSER_NAME]: browserName,
      };
      delete capabilities.url;
    }
  } else if (useSauce) {
    // handle legacy `sauce` object
    console.warn(
      'Deprecation warning: Direct support for Saucelabs is deprecated and ' +
        'will be removed in a future release. Please use Saucelabs via the ' +
        'remote Selenium grid feature. See the jasmine-browser-runner README ' +
        'for details.'
    );
    const sauce = browserInfo.sauce;
    if (sauce) {
      url = `http://${sauce.username}:${sauce.accessKey}@ondemand.saucelabs.com/wd/hub`;
      capabilities = {
        [Capability.BROWSER_NAME]: browserName,
        build: sauce.build,
        tags: sauce.tags,
      };

      capabilities[Capability.PLATFORM_NAME] = sauce.os;
      capabilities[Capability.BROWSER_VERSION] = sauce.browserVersion;
      capabilities['sauce:options'] = {
        'tunnel-identifier': sauce.tunnelIdentifier,
      };
    }
  }

  if (!capabilities) {
    capabilities = {
      [Capability.BROWSER_NAME]: browserName,
    };
  }

  return webdriverBuilder
    .withCapabilities(capabilities)
    .usingServer(url || 'http://localhost:4445/wd/hub')
    .build();
}

module.exports = { buildWebdriver };
