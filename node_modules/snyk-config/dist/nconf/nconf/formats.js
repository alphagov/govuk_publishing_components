"use strict";
/*
 * formats.js: Default formats supported by nconf
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.json = void 0;
//
// ### @json
// Standard JSON format which pretty prints `.stringify()`.
//
exports.json = {
    stringify: function (obj, replacer, spacing) {
        return JSON.stringify(obj, replacer || null, spacing || 2);
    },
    parse: JSON.parse,
};
//# sourceMappingURL=formats.js.map