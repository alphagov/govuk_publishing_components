jasmine-browser-runner runs your Jasmine specs in a browser. It's suitable for
interactive use with normal browsers as well as running specs in CI builds
using either headless Chrome or Saucelabs.

# Getting started

```bash
npm install --save-dev jasmine-browser-runner jasmine-core
npx jasmine-browser-runner init
```

or

```bash
yarn add -D jasmine-browser-runner jasmine-core
npx jasmine-browser-runner init
```

If you intend to use ES modules, add `--esm` to the `jasmine-browser-runner init`
command.

Then, customize `spec/support/jasmine-browser.json` to suit your needs. You can
change the spec files, helpers, and source files that are loaded, specify the
[Jasmine env's configuration](https://jasmine.github.io/api/edge/Configuration.html),
and more.

You can also use the `--config` option to specify a different file. This file can be a JSON file or a javascript file that exports a object that looks like the JSON above.

To start the server so that you can run the specs interactively (particularly
useful for debugging):

```
npx jasmine-browser-runner serve
```

To run the specs in a browser (defaults to Firefox):

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
an ES module rather than a regular script. Note that ES modules can only be
loaded from other ES modules. So if your source files are ES modules, your
spec files need to be ES modules too. Want to use a different extension than
`.esm`? Just set the `esmFilenameExtension` config property, e.g.
`"esmFilenameExtension": ".js"`.

To allow spec files to import source files via relative paths, set the `specDir`
config field to something that's high enough up to include both spec and source
files, and set `srcFiles` to `[]`. You can autogenerate such a configuration by
running `npx jasmine-browser-runner init --esm`.

If you have specs or helper files that use top-level await, set the
`enableTopLevelAwait` config property is set to `true`.

[Import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)
are also supported:

```javascript
{
   // ...
   "importMap": {
     "moduleRootDir": "node_modules", 
     "imports": {
       "some-lib":"some-lib/dist/index.mjs",
       "some-lib/": "some-lib/dist/",
       "some-cdn-lib": "https://example.com/some-cdn-lib"
      }
   }
}
```

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

## Supported environments

jasmine-browser-runner tests itself across popular browsers (Safari, Chrome, 
Firefox, and Microsoft Edge) as well as Node.

| Environment       | Supported versions     |
|-------------------|------------------------|
| Node              | 18, 20                 |
| Safari            | 15-16                  |
| Chrome            | Evergreen              |
| Firefox           | Evergreen, 102         |
| Edge              | Evergreen              |

For evergreen browsers, each version of jasmine-browser-runner is tested against
the version of the browser that is available to us at the time of release. Other 
browsers, as well as older & newer versions of some supported browsers, are
likely to work. However, jasmine-browser-runner isn't tested against them and 
they aren't actively supported.

To find out what environments work with a particular Jasmine release, see the [release notes](https://github.com/jasmine/jasmine/tree/main/release_notes).

