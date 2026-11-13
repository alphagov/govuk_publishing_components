'use strict'

const { PurlError } = require('./error')

const { decodeURIComponent } = globalThis

function decodePurlComponent(comp, encodedURIComponent) {
    try {
        return decodeURIComponent(encodedURIComponent)
    } catch {}
    throw new PurlError(`unable to decode "${comp}" component`)
}

module.exports = {
    decodePurlComponent
}
