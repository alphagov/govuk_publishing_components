"use strict";
/*
 * nconf.js: Top-level include for the nconf module
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const common = require("./nconf/common");
const provider_1 = require("./nconf/provider");
const formats = require("./nconf/formats");
const argv_1 = require("./nconf/stores/argv");
const env_1 = require("./nconf/stores/env");
const file_1 = require("./nconf/stores/file");
const literal_1 = require("./nconf/stores/literal");
const memory_1 = require("./nconf/stores/memory");
//
// `nconf` is by default an instance of `nconf.Provider`.
//
const nconf = new provider_1.Provider();
nconf.Argv = argv_1.Argv;
nconf.Env = env_1.Env;
nconf.File = file_1.File;
nconf.Literal = literal_1.Literal;
nconf.Memory = memory_1.Memory;
//
// Expose the various components included with nconf
//
nconf.key = common.key;
nconf.path = common.path;
nconf.loadFiles = common.loadFiles;
nconf.loadFilesSync = common.loadFilesSync;
nconf.formats = formats;
nconf.Provider = provider_1.Provider;
exports.default = nconf;
//# sourceMappingURL=nconf.js.map