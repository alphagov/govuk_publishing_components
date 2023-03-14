const express = require('express'),
  glob = require('glob'),
  ejs = require('ejs'),
  path = require('path'),
  fs = require('fs'),
  os = require('os');

/**
 * @class Server
 * @classdesc Serves the specs and supporting files via HTTP.
 */
class Server {
  /**
   * @constructor
   * @param {ServerCtorOptions} options
   */
  constructor(options) {
    this.options = options;
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

    // Validate globs
    const isWindows = (options.platform || os.platform)() === 'win32';
    for (const globs of [
      options.specFiles,
      options.srcFiles,
      options.helpers,
    ]) {
      if (globs) {
        for (const g of globs) {
          if (isWindows && g.includes('\\')) {
            const fixed = g.replace(/\\/g, '/');
            console.warn(
              'Backslashes in file paths behave inconsistently ' +
                'between platforms and might not be treated as directory ' +
                'separators in a future version. Consider changing ' +
                `${g} to ${fixed}.`
            );
          }
        }
      }
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
    var urls = this.getUrls(
      this.options.srcDir,
      this.options.cssFiles,
      '/__src__'
    );
    return this.jasmineCssFiles.concat(urls);
  }

  getUrls(baseDir, globs, urlRoot) {
    return findFiles(path.join(this.projectBaseDir, baseDir), globs || []).map(
      function(p) {
        return isUrl(p) ? p : unWindows(path.join(urlRoot, p));
      }
    );
  }

  getSupportFiles() {
    var result = ['/__support__/loadEsModule.js'];
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
    var srcUrls = this.getUrls(
      this.options.srcDir,
      this.options.srcFiles,
      '/__src__'
    ).filter(function(url) {
      // Exclude ES modules. These will be loaded by other ES modules.
      return !url.endsWith('.mjs');
    });
    var helperUrls = this.getUrls(
      this.options.specDir,
      this.options.helpers,
      '/__spec__'
    );
    var specUrls = this.getUrls(
      this.options.specDir,
      this.options.specFiles,
      '/__spec__'
    );
    return [].concat(srcUrls, helperUrls, specUrls);
  }

  /**
   * Starts the server.
   * @param {ServerStartOptions} options
   * @return {Promise<undefined>} A promise that resolves upon successful start.
   */
  start(serverOptions) {
    serverOptions = serverOptions || {};
    var app = express();

    app.use('/__jasmine__', express.static(this.jasmineCore.files.path));
    app.use('/__boot__', express.static(this.jasmineCore.files.bootDir));
    app.use('/__images__', express.static(this.jasmineCore.files.imagesDir));
    app.use('/__support__', express.static(path.join(__dirname, 'support')));
    app.use(
      '/__spec__',
      express.static(path.join(this.projectBaseDir, this.options.specDir))
    );
    app.use(
      '/__src__',
      express.static(path.join(this.projectBaseDir, this.options.srcDir))
    );

    var indexTemplate = ejs.compile(
      fs.readFileSync(path.resolve(__dirname, '../run.html.ejs')).toString()
    );
    var configTemplate = ejs.compile(
      fs.readFileSync(path.resolve(__dirname, '../config.js.ejs')).toString()
    );

    var self = this;
    app.get('/', function(req, res) {
      try {
        res.send(
          indexTemplate({
            cssFiles: self.allCss(),
            jasmineJsFiles: self.jasmineJs(),
            userJsFiles: self.userJs(),
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

    var port = findPort(serverOptions.port, this.options.port);
    return new Promise(resolve => {
      this._httpServer = app.listen(port, () => {
        const runningPort = this._httpServer.address().port;
        console.log(
          `Jasmine server is running here: http://localhost:${runningPort}`
        );
        console.log(
          `Jasmine tests are here:         ${path.resolve(
            self.options.specDir
          )}`
        );
        console.log(
          `Source files are here:          ${path.resolve(self.options.srcDir)}`
        );
        resolve();
      });
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

module.exports = Server;
