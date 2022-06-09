// Automatically download and install Chromium if the PERCY_POSTINSTALL_BROWSER environment variable
// is present and truthy, or if this module is required directly from within another module. Useful
// when running in CI environments with heavy caching of node_modules.
if (process.env.PERCY_POSTINSTALL_BROWSER || require.main !== module) {
  const fs = require('fs');
  const path = require('path');

  // the src directory indicates postinstall during development
  const isDev = fs.existsSync(path.join(__dirname, 'src'));

  // register babel transforms for development install
  if (isDev) require('../../scripts/babel-register');

  // require dev or production modules
  const install = require(isDev ? './src/install' : './dist/install');
  const log = require(isDev ? '../logger/src' : '@percy/logger')('core:post-install');

  // install chromium
  install.chromium().catch(error => {
    log.error('Encountered an error while installing Chromium');
    log.error(error);
  });
}
