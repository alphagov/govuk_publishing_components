/*
 * env.js: Simple memory-based store for environment variables
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */

import * as util from 'util';
import * as common from '../common';
import { Memory } from './memory';

//
// ### function Env (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Env nconf store, a simple abstraction
// around the Memory store that can read process environment variables.
//
export const Env = function(this: any, options) {
  Memory.call(this, options);

  options = options || {};
  this.type = 'env';
  this.readOnly = options.readOnly !== undefined ? options.readOnly : true;
  this.whitelist = options.whitelist || [];
  this.separator = options.separator || '';
  this.lowerCase = options.lowerCase || false;
  this.parseValues = options.parseValues || false;
  this.transform = options.transform || false;

  if (
    {}.toString.call(options.match) === '[object RegExp]' &&
    typeof options !== 'string'
  ) {
    this.match = options.match;
  }

  if (options instanceof Array) {
    this.whitelist = options;
  }
  if (typeof options === 'string' || options instanceof RegExp) {
    this.separator = options;
  }
};

// Inherit from the Memory store
util.inherits(Env, Memory);

//
// ### function loadSync ()
// Loads the data passed in from `process.env` into this instance.
//
Env.prototype.loadSync = function() {
  this.loadEnv();
  return this.store;
};

//
// ### function loadEnv ()
// Loads the data passed in from `process.env` into this instance.
//
Env.prototype.loadEnv = function() {
  const self = this;

  let env = process.env;

  if (this.lowerCase) {
    env = {};
    Object.keys(process.env).forEach(function(key) {
      env[key.toLowerCase()] = process.env[key];
    });
  }

  if (this.transform) {
    env = common.transform(env, this.transform);
  }

  let tempWrite = false;

  if (this.readOnly) {
    this.readOnly = false;
    tempWrite = true;
  }

  Object.keys(env)
    .filter(function(key) {
      if (self.match && self.whitelist.length) {
        return key.match(self.match) || self.whitelist.indexOf(key) !== -1;
      } else if (self.match) {
        return key.match(self.match);
      } else {
        return !self.whitelist.length || self.whitelist.indexOf(key) !== -1;
      }
    })
    .forEach(function(key) {
      /**
       * Snyk modification ahead:
       * monkey patch nconf to support TRUE & FALSE on env & arg to port to bool
       */
      let val: string | undefined | boolean = env[key];

      if (val === 'TRUE' || val === 'true') {
        val = true;
      } else if (val === 'FALSE' || val === 'false') {
        val = false;
      }
      /**
       * Snyk modification end
       */

      if (self.parseValues) {
        val = common.parseValues(val);
      }

      if (self.separator) {
        self.set(common.key.apply(common, key.split(self.separator)), val);
      } else {
        self.set(key, val);
      }
    });

  if (tempWrite) {
    this.readOnly = true;
  }

  return this.store;
};
