const defaultExpress = require('express');
const ejs = require('ejs');
const fs = require('fs');
const glob = require('glob');
const http = require('http');
const https = require('https');
const path = require('path');

/**
 * @class Server
 * @classdesc Serves the specs and supporting files via HTTP.
 */
class Server {
  /**
   * @constructor
   * @param {ServerCtorOptions} options
   */
  constructor(options, deps) {
    this.options = { ...options };
    this._deps = deps || { http, https };
    this.express = this.options.express || defaultExpress;
    this.useHtmlReporter =
      options.useHtmlReporter === undefined ? true : options.useHtmlReporter;
    this.projectBaseDir = options.projectBaseDir || path.resolve();
    this.jasmineCore = options.jasmineCore || require('./jasmineCore');
    this.jasmineCssFiles = this.jasmineCore.files.cssFiles.map(function(
      fileName
    ) {
      return unWindows(path.join('/__jasmine__', fileName));
    });
    this.jasmineJsFiles = this.jasmineCore.files.jsFiles
      .map(function(fileName) {
        return unWindows(path.join('/__jasmine__', fileName));
      })
      .concat(this.bootFiles());

    if (!this.options.esmFilenameExtension) {
      this.options.esmFilenameExtension = '.mjs';
    } else if (this.options.esmFilenameExtension[0] !== '.') {
      this.options.esmFilenameExtension =
        '.' + this.options.esmFilenameExtension;
    }
  }

  bootFiles() {
    const bootFiles = this.jasmineCore.files.bootFiles.map(function(fileName) {
      return unWindows(path.join('/__boot__', fileName));
    });
    bootFiles.splice(1, 0, '/__config__/config.js');
    return bootFiles;
  }

  allCss() {
    const urls = this.getUrls(
      this.options.srcDir,
      this.options.cssFiles,
      '/__src__'
    );
    return this.jasmineCssFiles.concat(urls);
  }

  getUrls(baseDir, globs, urlRoot) {
    return findFiles(
      path.resolve(this.projectBaseDir, baseDir),
      globs || []
    ).map(function(p) {
      return isUrl(p) ? p : unWindows(path.join(urlRoot, p));
    });
  }

  getSupportFiles() {
    const result = ['/__support__/loaders.js'];
    if (!this.useHtmlReporter) {
      result.push('/__support__/clearReporters.js');
    }

    result.push('/__support__/batchReporter.js');
    return result;
  }

  jasmineJs() {
    return this.jasmineJsFiles.concat(this.getSupportFiles());
  }

  userJs() {
    const srcUrls = this.getUrls(
      this.options.srcDir,
      this.options.srcFiles,
      '/__src__'
    ).filter(url => {
      // Exclude ES modules. These will be loaded by other ES modules.
      return !url.endsWith(this.options.esmFilenameExtension);
    });
    const helperUrls = this.getUrls(
      this.options.specDir,
      this.options.helpers,
      '/__spec__'
    );
    const specUrls = this.getUrls(
      this.options.specDir,
      this.options.specFiles,
      '/__spec__'
    );
    return [].concat(srcUrls, helperUrls, specUrls);
  }

  // Bound property for ejs template, used to inject a `<script
  // type="importmap">` tag. This changes specifier target values for any
  // relative module paths according to `this.options.importMap.moduleRootDir`.
  // @returns ImportMap | undefined
  importMap() {
    const { importMap } = this.options;
    if (!importMap) {
      return undefined;
    }

    const resultMap = {};

    if (importMap.imports) {
      resultMap.imports = reifyRawSpecifierMap(importMap.imports);
    }

    if (importMap.scopes) {
      resultMap.scopes = {};

      for (const [scope, map] of Object.entries(importMap.scopes)) {
        resultMap.scopes[scope] = reifyRawSpecifierMap(map);
      }
    }

    return resultMap;
  }

  /**
   * Starts the server.
   * @param {ServerStartOptions} options
   * @return {Promise<undefined>} A promise that resolves upon successful start.
   */
  start(serverOptions) {
    serverOptions = serverOptions || {};
    const app = this.express();

    app.use('/__jasmine__', this.express.static(this.jasmineCore.files.path));
    app.use('/__boot__', this.express.static(this.jasmineCore.files.bootDir));
    app.use(
      '/__images__',
      this.express.static(this.jasmineCore.files.imagesDir)
    );
    app.use(
      '/__support__',
      this.express.static(path.join(__dirname, 'support'))
    );
    app.use(
      '/__spec__',
      this.express.static(
        path.resolve(this.projectBaseDir, this.options.specDir)
      )
    );
    app.use(
      '/__src__',
      this.express.static(
        path.resolve(this.projectBaseDir, this.options.srcDir)
      )
    );

    if (this.options.middleware) {
      for (const [path, middleware] of Object.entries(
        this.options.middleware
      )) {
        app.use(path, middleware);
      }
    }

    if (this.options.importMap) {
      const dir = this.options.importMap.moduleRootDir
        ? path.resolve(
            this.projectBaseDir,
            this.options.importMap.moduleRootDir
          )
        : this.projectBaseDir;
      app.use('/__moduleRoot__', this.express.static(dir));
    }

    const indexTemplate = ejs.compile(
      fs.readFileSync(path.resolve(__dirname, '../run.html.ejs')).toString()
    );
    const configTemplate = ejs.compile(
      fs.readFileSync(path.resolve(__dirname, '../config.js.ejs')).toString()
    );

    const self = this;
    app.get('/', function(req, res) {
      try {
        res.send(
          indexTemplate({
            cssFiles: self.allCss(),
            jasmineJsFiles: self.jasmineJs(),
            userJsFiles: self.userJs(),
            esmFilenameExtension: self.options.esmFilenameExtension,
            importMap: self.importMap(),
            enableTopLevelAwait: self.options.enableTopLevelAwait || false,
          })
        );
      } catch (error) {
        res.status(500).send('An error occurred');
        console.error(error);
      }
    });
    app.get('/__config__/config.js', function(req, res) {
      try {
        res.append('Content-type', 'application/javascript');
        res.send(
          configTemplate({
            envConfig: self.options.env || {},
          })
        );
      } catch (error) {
        res.status(500).send('An error occurred');
        console.error(error);
      }
    });

    const port = findPort(serverOptions.port, this.options.port);
    const tlsCert = serverOptions.tlsCert || this.options.tlsCert;
    const tlsKey = serverOptions.tlsKey || this.options.tlsKey;
    const hostname = serverOptions.hostname || this.options.hostname;
    // The last two fallbacks here are necessary for backwards compatibility.
    let listenAddress =
      serverOptions.listenAddress ||
      this.options.listenAddress ||
      hostname ||
      '';

    if (listenAddress === '*') {
      listenAddress = '';
    }

    const listenOptions = {
      port,
      host: listenAddress,
    };
    this._httpHostname = hostname || 'localhost';

    return new Promise(resolve => {
      const callback = () => {
        const runningPort = this._httpServer.address().port;
        const url =
          this._httpServerScheme +
          '://' +
          this._httpHostname +
          ':' +
          runningPort;
        console.log(`Jasmine server is running here: ${url}`);
        console.log(
          `Jasmine tests are here:         ${path.resolve(
            self.options.specDir
          )}`
        );
        console.log(
          `Source files are here:          ${path.resolve(self.options.srcDir)}`
        );
        resolve();
      };

      if (tlsKey && tlsCert) {
        const httpsOptions = {
          key: fs.readFileSync(tlsKey),
          cert: fs.readFileSync(tlsCert),
        };
        this._httpServer = this._deps.https
          .createServer(httpsOptions, app)
          .listen(listenOptions, callback);
        this._httpServerScheme = 'https';
      } else {
        this._httpServer = this._deps.http
          .createServer(app)
          .listen(listenOptions, callback);
        this._httpServerScheme = 'http';
      }
    });
  }

  /**
   * Stops the server.
   * @return {Promise<undefined>}
   */
  stop() {
    if (!this._httpServer) {
      throw new Error("Can't stop a server that was never started");
    }

    return new Promise(resolve => {
      this._httpServer.close(resolve);
    });
  }

  /**
   * Gets the port that the server is listening on. The server must be started
   * before this method is called.
   * @function
   * @name Server#port
   * @return {number} The port number
   */
  port() {
    if (!this._httpServer) {
      throw new Error("Can't determine port before the server is started");
    }

    return this._httpServer.address().port;
  }

  /**
   * Gets the URL scheme that the server is listening on. The server must be
   * started before this method is called.
   * @function
   * @name Server#scheme
   * @return {string} The URL scheme ('http' or 'https')
   */
  scheme() {
    return this._httpServerScheme;
  }

  /**
   * Gets the hostname that the server is listening on. The server must be
   * started before this method is called.
   * @function
   * @name Server#hostname
   * @return {string} The hostname (localhost if not specified)
   */
  hostname() {
    return this._httpHostname;
  }
}

function findPort(serverPort, optionsPort) {
  if (typeof serverPort !== 'undefined') {
    return serverPort;
  }

  if (typeof optionsPort !== 'undefined') {
    return optionsPort;
  }

  return 8888;
}

function isUrl(s) {
  return s.startsWith('http://') || s.startsWith('https://');
}

function findFiles(baseDir, globs) {
  const { includeGlobs, excludeGlobs } = globs.reduce(
    function(ongoing, g) {
      const hasNegation = g.startsWith('!');

      if (hasNegation) {
        g = g.substring(1);
      }

      return {
        includeGlobs: ongoing.includeGlobs.concat(!hasNegation ? [g] : []),
        excludeGlobs: ongoing.excludeGlobs.concat(hasNegation ? [g] : []),
      };
    },
    { includeGlobs: [], excludeGlobs: [] }
  );

  const result = [];

  for (const g of includeGlobs) {
    if (isUrl(g)) {
      result.push(g);
    } else {
      const files = glob.sync(g, { ignore: excludeGlobs, cwd: baseDir });

      for (const f of files) {
        // De-duplicate
        if (result.indexOf(f) === -1) {
          result.push(f);
        }
      }
    }
  }

  return result;
}

function unWindows(filePath) {
  return filePath.replace(/\\/g, '/');
}

// Processes the incoming `rawSpecifierMap`, converting targets to use actual
// paths that the run.html.ejs file will contain.  The `rawSpecifierMap` is not
// the entire importMap. It is a key/value map that may be the "imports" value
// or an individual map inside of "scopes"[someScope].
function reifyRawSpecifierMap(rawSpecifierMap) {
  const concreteMap = {};

  for (const [key, value] of Object.entries(rawSpecifierMap)) {
    if (value.match(/^https?:\/\//)) {
      concreteMap[key] = value; // pass through unchanged
    } else {
      concreteMap[key] = './' + unWindows(path.join('__moduleRoot__', value));
    }
  }

  return concreteMap;
}

module.exports = Server;
