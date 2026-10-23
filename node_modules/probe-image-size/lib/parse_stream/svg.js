'use strict'


var Transform = require('stream').Transform
var parseSvgHeader = require('../common/svg_header').parse
var MAX_DATA_LENGTH = require('../common/svg_header').MAX_DATA_LENGTH

var STATE_IDENTIFY = 0 // look for '<'
var STATE_PARSE = 1 // extract width and height from svg tag
var STATE_IGNORE = 2 // we got all the data we want, skip the rest


// The only things allowed before the root tag.
// Note, `\s` includes BOM (U+FEFF), no need to mention it separately.
var IDENTIFY_RE = new RegExp('^\\s{0,' + MAX_DATA_LENGTH + '}(?:<|$)')


module.exports = function () {
  var state = STATE_IDENTIFY
  var data_len = 0
  var str = ''

  var parser = new Transform({
    readableObjectMode: true,
    transform: function (chunk, encoding, next) {
      if (state !== STATE_IGNORE) {
        data_len += chunk.length

        // Strictly speaking, unicode should be decoded with a streaming decoder,
        // to avoid mangling chars split by a chunk border. But the only char we
        // care about is BOM, and the chance of it being cut is about zero.
        // Everything else can be broken without affecting the result.
        str += chunk.toString()

        // bound what gets scanned, the same way the sync parser slices its
        // input, otherwise a single large chunk would be parsed in full
        if (str.length > MAX_DATA_LENGTH) str = str.slice(0, MAX_DATA_LENGTH)
      }

      switch (state) {
        // identify step is needed to fail fast if the file isn't SVG
        case STATE_IDENTIFY:
          // everything seen so far must fit the allowed prefix
          if (!IDENTIFY_RE.test(str)) {
            state = STATE_IGNORE
            parser.push(null)
            break
          }

          if (str.indexOf('<') === -1) {
            // root tag has not arrived yet
            if (data_len > MAX_DATA_LENGTH) {
              state = STATE_IGNORE
              parser.push(null)
            }

            break
          }

          state = STATE_PARSE

          // falls through

        case STATE_PARSE:
          // the header parser needs a closed tag to match anything, so there is
          // no point in rescanning all accumulated data until '>' arrives
          if (chunk.indexOf(0x3e /* > */) !== -1) {
            var result = parseSvgHeader(str)

            if (result) {
              state = STATE_IGNORE
              parser.push(result)
              parser.push(null)
              break
            }
          }

          if (data_len > MAX_DATA_LENGTH) {
            state = STATE_IGNORE
            parser.push(null)
          }

          break
      }

      next()
    },

    flush: function () {
      state = STATE_IGNORE
      parser.push(null)
    }
  })

  return parser
}
