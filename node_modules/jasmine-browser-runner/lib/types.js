// JSDoc comments that don't have any obvious place to go in the code. These
// are mainly for interfaces that describe user-provided objects.

/**
 * @interface ServerCtorOptions
 * @classdesc Specifies the configuration for {@link Server}. The only required
 * properties are specDir and srcDir, although in practice you'll almost
 * certainly want to provide at least specFiles and srcFiles as well.
 * @see Server
 */
/**
 * An array of CSS file paths or {@link https://github.com/isaacs/node-glob#glob-primer|globs}
 * that match CSS files. Each path or glob will be evaluated relative to
 * {@link ServerCtorOptions#srcDir}.
 * @name ServerCtorOptions#cssFiles
 * @type string[] | undefined
 */
/**
 * An array of helper file paths or {@link https://github.com/isaacs/node-glob#glob-primer|globs}
 * that match helper files. Each path or glob will be evaluated relative to
 * {@link ServerCtorOptions#specDir}. Helpers are loaded before specs.
 * @name ServerCtorOptions#helpers
 * @type string[] | undefined
 */
/**
 * The instance of jasmine-core to use. Use this if you need to load
 * jasmine-core in a nonstandard way. Most of the time it should be omitted.
 * @name ServerCtorOptions#jasmineCore
 * @type any | undefined
 */
/**
 * The port to listen on.
 * @name ServerCtorOptions#port
 * @type number | undefined
 */
/**
 * The path to a TLS key. Activates HTTPS mode. If specified, tlsCert must also
 * be specified.
 * @name ServerCtorOptions#tlsKey
 * @type string
 */
/**
 * The path to a TLS cert. Activates HTTPS mode. If specified, tlsKey must also
 * be specified.
 * @name ServerCtorOptions#tlsCert
 * @type string
 */
/**
 * The hostname or IP address of the network interface to listen on. For
 * security, jasmine-browser-runner will listen to localhost unless if this
 * property is not specified. Set to "*" to listen on all interfaces, which may
 * be required by some remote Selenium grids.
 * @name ServerCtorOptions#listenAddress
 * @default "localhost"
 * @type string | undefined
 */
/**
 * The hostname to use in the URL given to browsers.
 * @name ServerCtorOptions#hostname
 * @default "localhost"
 * @type string | undefined
 */
/**
 * The root directory of the project.
 * @name ServerCtorOptions#projectBaseDir
 * @type string | undefined
 */
/**
 * The directory that spec files are contained in, relative to
 * {@link ServerCtorOptions#projectBaseDir}.
 * @name ServerCtorOptions#specDir
 * @type string
 */
/**
 * An array of spec file paths or {@link https://github.com/isaacs/node-glob#glob-primer|globs}
 * that match spec files. Each path or glob will be evaluated relative to
 * {@link ServerCtorOptions#specDir}.
 * @name ServerCtorOptions#specFiles
 * @type string[] | undefined
 */
/**
 * The directory that source files are contained in, relative to
 * {@link ServerCtorOptions#projectBaseDir}.
 * @name ServerCtorOptions#srcDir
 * @type string
 */
/**
 * An array of sourec file paths or {@link https://github.com/isaacs/node-glob#glob-primer|globs}
 * that match source files. Each path or glob will be evaluated relative to
 * {@link ServerCtorOptions#srcDir}.
 * @name ServerCtorOptions#srcFiles
 * @type string[] | undefined
 */
/**
 * The file extension used by ES modules
 * @name ServerCtorOptions#esmFilenameExtension
 * @type string | undefined
 * @default ".mjs"
 */

/**
 * Specifies the properties of the configuration file, as well as
 * the argument to runSpecs.
 *
 * @interface Configuration
 * @augments ServerCtorOptions
 */
/**
 * The browser to run the specs in.
 * @name Configuration#browser
 * @type string | BrowserInfo | undefined
 */
/**
 * Whether to use color in the console output.
 * @name Configuration#color
 * @type boolean | undefined
 * @default true
 */
/**
 * An array of {@link https://jasmine.github.io/api/edge/Reporter.html|reporters}
 * or names of modules defining reporters. If an entry is a string, it should be
 * the {@link https://nodejs.org/api/esm.html#esm_import_specifiers|import specifier}
 * for a module that default exports a reporter constructor. The constructor will
 * be called with no arguments.
 * @name Configuration#reporters
 * @type Array<string | Reporter>
 */
/**
 * Whether to use the built-in {@link ConsoleReporter}.
 * @name Configuration#useConsoleReporter
 * @type boolean | undefined
 * @default true
 */
/**
 * Whether the default reporter should list pending specs even if there are
 * failures.
 * @name Configuration#alwaysListPendingSpecs
 * @type boolean | undefined
 * @default true
 */
/**
 * Import maps entry to generate the `<script type="importmap">` section in the
 * `<head>`, to enable ES Module testing in the browser.
 *
 * @name Configuration#importMap
 * @type ImportMap | undefined
 * @default undefined
 */
/**
 * Whether to enable support for top-level await. This option is off by default
 * because it comes with a performance penalty.
 * @name Configuration#enableTopLevelAwait
 * @type boolean | undefined
 * @default false
 */
/**
 * If set to true jasmine loads also ES Modules which are included in SrcFiles.
 * This option is off by default because in most scenarios it is better to load the
 * module under test from the test itself.
 * But if the module has wanted side effects (like for example polyfills) you can
 * interleave ES module and classic scripts in your SrcFiles.
 * @name Configuration#modulesWithSideEffectsInSrcFiles
 * @type boolean | undefined
 * @default false
 */
/**
 * <p>An optional map from paths to Express application middleware to mount on
 * those paths. This can be used to serve static files, proxy requests to
 * another server, etc.
 * <p>Note: Requests made by jasmine-browser-runner (e.g. /, /__jasmine__/*,
 * /__spec__/*, etc) are considered private APIs for semver purposes. If you
 * configure middleware that modifies these requests and responses, there is a
 * possibility that future jasmine-browser-runner releases, including minor and
 * patch releases, may be incompatible with that middleware.
 * @example
 * // jasmine-browser.js
 * const express = require('express');
 *
 * module.exports = {
 *   // ...
 *   middleware: {
 *     '/assets': express.static('./path/to/assets')
 *   }
 * }
 * @name Configuration#middleware
 * @type object | undefined
 * @default undefined
 */

/**
 * Describes a web browser.
 * @interface BrowserInfo
 */
/**
 * Whether to run the specs on a remote Selenium grid.
 * Defaults to false.
 * @name BrowserInfo#useRemoteSeleniumGrid
 * @type boolean | undefined
 */
/**
 * The browser name. Valid values include "firefox", "headlessFirefox",
 * "safari", "MicrosoftEdge", "chrome", and "headlessChrome".
 * @name BrowserInfo#name
 * @type string | undefined
 */
/**
 * Configuration for running specs on a remote Selenium grid
 * @name BrowserInfo#remoteSeleniumGrid
 * @type RemoteSeleniumGridConfig | undefined
 */
/**
 * Configuration for running specs on a remote Selenium grid
 * Any additional properties, such as "sauce:options" or "bstack:options", will
 * be included in the capabilities object passed through to Selenium Webdriver.
 * @interface RemoteSeleniumGridConfig
 * @example
 * {
 *    "url": "https://hub-cloud.browserstack.com/wd/hub",
 *    "bstack:options": {
 *      "browserVersion": "16",
 *      "os": "OS X",
 *      "osVersion": "Monterey",
 *      "local": "true",
 *      "localIdentifier": "tunnel ID",
 *      "debug": "true",
 *      "userName": "your BrowserStack username",
 *      "accessKey": "your BrowserStack access key"
 *    }
 *  }
 */
/**
 * URL of the remote Selenium grid
 * @name RemoteSeleniumGridConfig#url
 * @type string
 */

/**
 * Describes an import map.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap}
 * @see {@link https://github.com/WICG/import-maps}
 * @interface ImportMap
 */
/**
 * A single, unscoped module specifier map.
 * @name ImportMap#imports
 * @type {Object.<string, string>}
 */
/**
 * Map of one or more scoped module specifier maps.
 * @name ImportMap#scopes
 * @type {Object.<string, Object.<string, string>>}
 */
/**
 * Optional directory that specifies the root for relative paths in import map
 * (if required).
 *
 * For example, if you only use import paths that resolve to absolute targets,
 * e.g.  'my-pkg': 'https://mycdn.url/my-pkg', then you do not need this dir
 * option. But if you need to reference a folder, e.g. `node_modules`, then this
 * is required.
 *
 * moduleRootDir is evaluated relative to the project base directory, which is
 * typically the current working directory from which jasmine-browser-runner is
 * run.
 *
 * @name ImportMap#moduleRootDir
 * @type string
 * @example 'node_modules'
 */
