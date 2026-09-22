/*
 * argv.js: Simple memory-based store for command-line arguments.
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */

import * as path from 'path';
import * as util from 'util';
import * as common from '../common';
import { Memory } from './memory';
import * as minimist from 'minimist';

//
// ### function Argv (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Argv nconf store, a simple abstraction
// around the Memory store that can read command-line arguments.
//
export const Argv = function(this: any, options, usage) {
  Memory.call(this, options);

  options = options || {};
  this.type = 'argv';
  this.readOnly = options.readOnly !== undefined ? options.readOnly : true;
  this.options = options;
  this.usage = usage;

  if (typeof options.readOnly === 'boolean') {
    this.readOnly = options.readOnly;
    delete options.readOnly;
    // FIXME; should not mutate options!!!!
  } else {
    this.readOnly = true;
  }

  if (typeof options.parseValues === 'boolean') {
    this.parseValues = options.parseValues;
    delete options.parseValues;
  } else {
    this.parseValues = false;
  }
  if (typeof options.transform === 'function') {
    this.transform = options.transform;
    delete options.transform;
  } else {
    this.transform = false;
  }
  if (
    typeof options.separator === 'string' ||
    options.separator instanceof RegExp
  ) {
    this.separator = options.separator;
    delete options.separator;
  } else {
    this.separator = '';
  }
};

// Inherit from the Memory store
util.inherits(Argv, Memory);

//
// ### function loadSync ()
// Loads the data passed in from `process.argv` into this instance.
//
Argv.prototype.loadSync = function() {
  this.loadArgv();
  return this.store;
};

//
// ### function loadArgv ()
// Loads the data passed in from the command-line arguments
// into this instance.
//
Argv.prototype.loadArgv = function() {
  let self = this,
    argv;

  // Adapted from the original yargs library that we are replacing
  // Source: https://github.com/yargs/yargs/blob/cb01c98c44e30f55c2dc9434caef524ae433d9a4/lib/yargs-factory.ts#L96-L109

  /*
    MIT License

    Copyright 2010 James Halliday (mail@substack.net); Modified work Copyright 2014 Contributors (ben@npmjs.com)

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
  */
  let default$0: string[];
  if (/\b(node|iojs|electron)(\.exe)?$/.test(process.argv[0])) {
    default$0 = process.argv.slice(1, 2);
  } else {
    default$0 = process.argv.slice(0, 1);
  }

  const scriptName = default$0
    .map((x) => {
      const b = path.relative(process.cwd(), x);
      return x.match(/^(\/|([a-zA-Z]:)?\\)/) && b.length < x.length ? b : x;
    })
    .join(' ')
    .trim();
  // End of yargs block

  // we don't support passing options to minimist
  const minimistOutput = {
    ...minimist(process.argv.slice(2)),
    $0: scriptName, // yargs return this extra "scriptName" (parsed argv[1] above)
  };

  // Minimist does not support usage - we don't set it anywhere
  // if (typeof this.usage === 'string') {
  //   yargs.usage(this.usage);
  // }

  argv = minimistOutput;

  if (!argv) {
    return;
  }

  if (this.transform) {
    argv = common.transform(argv, this.transform);
  }

  let tempWrite = false;

  if (this.readOnly) {
    this.readOnly = false;
    tempWrite = true;
  }
  Object.keys(argv).forEach(function(key) {
    let val = argv[key];

    if (typeof val !== 'undefined') {
      if (self.parseValues) {
        val = common.parseValues(val);
      }

      if (self.separator) {
        self.set(common.key.apply(common, key.split(self.separator)), val);
      } else {
        self.set(key, val);
      }
    }
  });

  // minimist does not support these options
  // this.showHelp = yargs.showHelp;
  // this.help = yargs.help;

  if (tempWrite) {
    this.readOnly = true;
  }
  return this.store;
};
