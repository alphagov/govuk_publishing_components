'use strict'
const assert = require('assert')
const { URL } = require('url')
const mem = require('mem')

module.exports = mem(encodeRegistry)

function encodeRegistry (registry) {
  assert(registry, '`registry` is required')
  assert(typeof registry === 'string', '`registry` should be a string')
  const host = getHost(registry)
  return escapeHost(host)
}

function escapeHost (host) {
  return host.replace(':', '+')
}

function getHost (rawUrl) {
  let urlObj
  try {
    urlObj = new URL(rawUrl)
  } catch (err) {
    throw new Error(`Failed to parse registry URL "${rawUrl}": ${err.message}`)
  }
  if (!urlObj || !urlObj.host) {
    throw new Error(`Couldn't get host from ${rawUrl}`)
  }
  return urlObj.host
}
