"use strict";
/*
 * literal.js: Simple literal Object store for nconf.
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Literal = void 0;
const util = require("util");
const memory_1 = require("./memory");
const Literal = function Literal(options) {
    memory_1.Memory.call(this, options);
    options = options || {};
    this.type = 'literal';
    this.readOnly = true;
    this.store = options.store || options;
};
exports.Literal = Literal;
// Inherit from Memory store.
util.inherits(exports.Literal, memory_1.Memory);
//
// ### function loadSync (callback)
// Returns the data stored in `this.store` synchronously.
//
exports.Literal.prototype.loadSync = function () {
    return this.store;
};
//# sourceMappingURL=literal.js.map