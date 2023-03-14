[![Build Status](https://circleci.com/gh/jasmine/jasmine-browser.svg?style=shield)](https://circleci.com/gh/jasmine/jasmine-browser)


jasmine-browser-runner runs your Jasmine specs in a browser. It's suitable for
interactive use with normal browsers as well as running specs in CI builds
using either headless Chrome or Saucelabs.

# Getting started

```bash
npm install --save-dev jasmine-browser-runner jasmine-core
```

or

```bash
yarn add -D jasmine-browser-runner jasmine-core
```

Add a `spec/support/jasmine-browser.json`. For example:

```json
{
  "srcDir": "src",
  "srcFiles": [
    "**/*.?(m)js"
  ],
  "specDir": "spec",
  "specFiles": [
    "**/*[Ss]pec.?(m)js"
  ],
  "helpers": [
    "helpers/asyncAwait.js"
  ],
  "env": {
    "random": true
  }
}
```

You can also use the `--config` option to specify a different file. This file can be a JSON file or a javascript file that exports a object that looks like the JSON above.

Start the server:

```
npx jasmine-browser-runner serve
```

Run the tests in a browser (defaults to Firefox)

```
npx jasmine-browser-runner runSpecs
```

To use a browser other than Firefox, add a `browser` field to 
`jasmine-browser.json`:

```javascript
{
  // ...
  "browser": "chrome"
}
```

Its value can be `"firefox"`, `"headlessFirefox"`, `"safari"`, 
`"MicrosoftEdge"`, `"chrome"`, or `"headlessChrome"`.

## ES module support

If a source, spec, or helper file's name ends in `.mjs`, it will be loaded as
an ES module rather than a regular script.

To allow spec files to import source files via relative paths, set the `specDir`
config field to something that's high enough up to include both spec and source
files, and set `srcFiles` to `[]`. You can autogenerate such a configuration by
running `npx jasmine-browser-runner init --esm`.

## Use with Rails

You can use jasmine-browser-runner to test your Rails application's JavaScript,
whether you use the Asset Pipeline or Webpacker.

### Webpacker

1. Run `yarn add --dev jasmine-browser-runner`.
2. Run `npx jasmine-browser-runner init`.
3. Edit `spec/support/jasmine-browser.json` as follows:
```
{
  "srcDir": ".",
  "srcFiles": [],
  "specDir": "public/packs/js",
  "specFiles": [
    "specs-*.js"
  ],
  "helpers": [],
  // ...
}
```
4. Create `app/javascript/packs/specs.js` (or `app/javascript/packs/specs.jsx`
   if you use JSX) as follows:
```
(function() {
  'use strict';

  function requireAll(context) {
    context.keys().forEach(context);
  }

  requireAll(require.context('spec/javascript/helpers/', true, /\.js/));
  requireAll(require.context('spec/javascript/', true, /[sS]pec\.js/));
})();
```
5. Add `'spec/javascript'` to the `additional_paths` array in `config/webpacker.yml`.
6. Put your spec files in `spec/javascript`.

To run the specs:

1. Run `bin/webpack --watch`.
2. Run `npx jasmine-browser-runner`.
3. visit <http://localhost:8888>.

### Asset Pipeline

1. Run `yarn init` if there isn't already `package.json` file in the root of
   the Rails application.
2. Run `yarn add --dev jasmine-browser-runner`.
3. Run `npx jasmine-browser-runner init`.
5. Edit `spec/support/jasmine-browser.json` as follows:
```
{
  "srcDir": "public/assets",
  "srcFiles": [
    "application-*.js"
  ],
  "specDir": "spec/javascript",
  "specFiles": [
    "**/*[sS]pec.?(m)js"
  ],
  "helpers": [
    "helpers/**/*.?(m)js"
  ],
  // ...
}
```
6. Put your spec files in `spec/javascript`.

To run the specs:

1. Either run `bundle exec rake assets:precompile` or start the Rails 
   application in an environment that's configured to precompile assets.
2. Run `npx jasmine-browser-runner`.
3. Visit <http://localhost:8888>.

## Saucelabs support

jasmine-browser-runner can run your Jasmine specs on [Saucelabs](https://saucelabs.com/).
To use Saucelabs, set `browser.name`, `browser.useSauce`, and `browser.sauce`
in your config file as follows:

```json
{
  // ...
  "browser": {
    "name": "safari",
    "useSauce": true,
    "sauce": {
      "browserVersion": "13",
      "os": "OS X 10.15",
      "tags": ["your tag", "your other tag"],
      "tunnelIdentifier": "tunnel ID",
      "username": "your Saucelabs username",
      "accessKey": "your Saucelabs access key"
    }
  }
}
```

All properties of `browser.sauce` are optional except for `username` and 
`accessKey`. It's best to omit `browser.sauce.os` unless you need to run on a 
specific operating system. Setting `browser.sauce.tunnelIdentifier` is strongly
recommended unless you're sure that your account will never have more than one
active tunnel.

## Want more control?

```javascript
const path = require('path');
const jasmineBrowser = require('jasmine-browser-runner');

const config = require(path.resolve('spec/support/jasmine-browser.json'));
config.projectBaseDir = path.resolve('some/path');

jasmineBrowser.startServer(config, { port: 4321 });
```



