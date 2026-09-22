'use strict'


var parseSvgHeader = require('../common/svg_header').parse
var MAX_DATA_LENGTH = require('../common/svg_header').MAX_DATA_LENGTH


module.exports = function (data) {
  var start = 0

  // Skip byte order mark, https://github.com/nodeca/probe-image-size/issues/57
  // Bytes are copied as latin1 below, so BOM would not be seen as whitespace
  // by the header parser.
  if (data[0] === 0xEF && data[1] === 0xBB && data[2] === 0xBF) start = 3

  var str = ''
  var max = Math.min(data.length, start + MAX_DATA_LENGTH)

  for (var i = start; i < max; i++) {
    // 1. We can't rely on buffer features
    // 2. Don't care about UTF16 because ascii is enougth for our goals
    str += String.fromCharCode(data[i])
  }

  return parseSvgHeader(str)
}
