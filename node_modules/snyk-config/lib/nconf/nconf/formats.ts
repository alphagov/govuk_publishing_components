/*
 * formats.js: Default formats supported by nconf
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */

//
// ### @json
// Standard JSON format which pretty prints `.stringify()`.
//
export const json = {
  stringify: function(obj, replacer, spacing): string {
    return JSON.stringify(obj, replacer || null, spacing || 2);
  },
  parse: JSON.parse,
};
