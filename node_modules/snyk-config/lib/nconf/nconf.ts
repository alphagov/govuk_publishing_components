/*
 * nconf.js: Top-level include for the nconf module
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */

import * as common from './nconf/common';
import { Provider } from './nconf/provider';
import * as formats from './nconf/formats';

import { Argv } from './nconf/stores/argv';
import { Env } from './nconf/stores/env';
import { File } from './nconf/stores/file';
import { Literal } from './nconf/stores/literal';
import { Memory } from './nconf/stores/memory';

//
// `nconf` is by default an instance of `nconf.Provider`.
//
const nconf = new Provider();

nconf.Argv = Argv;
nconf.Env = Env;
nconf.File = File;
nconf.Literal = Literal;
nconf.Memory = Memory;

//
// Expose the various components included with nconf
//
nconf.key = common.key;
nconf.path = common.path;
nconf.loadFiles = common.loadFiles;
nconf.loadFilesSync = common.loadFilesSync;
nconf.formats = formats;
nconf.Provider = Provider;

export default nconf;
