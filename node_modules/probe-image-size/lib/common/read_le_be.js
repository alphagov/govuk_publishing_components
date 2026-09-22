'use strict'


exports.readUInt16LE = function (data, offset) {
  return data[offset] | (data[offset + 1] << 8)
}

exports.readUInt16BE = function (data, offset) {
  return (data[offset] << 8) | data[offset + 1]
}

exports.readInt16LE = function (data, offset) {
  return (exports.readUInt16LE(data, offset) << 16) >> 16
}

exports.readInt16BE = function (data, offset) {
  return (exports.readUInt16BE(data, offset) << 16) >> 16
}

exports.readUInt32LE = function (data, offset) {
  return (data[offset] |
    (data[offset + 1] << 8) |
    (data[offset + 2] << 16)) +
    data[offset + 3] * 0x1000000
}

exports.readUInt32BE = function (data, offset) {
  return data[offset] * 0x1000000 +
    ((data[offset + 1] << 16) |
    (data[offset + 2] << 8) |
    data[offset + 3])
}

exports.readInt32LE = function (data, offset) {
  return exports.readUInt32LE(data, offset) | 0
}

exports.readInt32BE = function (data, offset) {
  return exports.readUInt32BE(data, offset) | 0
}
