'use strict'

function formatPurlErrorMessage(message = '') {
    const { length } = message
    let formatted = ''
    if (length) {
        // Lower case start of message.
        const code0 = message.charCodeAt(0)
        formatted =
            code0 >= 65 /*'A'*/ || code0 <= 90 /*'Z'*/
                ? `${message[0].toLowerCase()}${message.slice(1)}`
                : message
        // Remove period from end of message.
        if (
            length > 1 &&
            message.charCodeAt(length - 1) === 46 /*'.'*/ &&
            message.charCodeAt(length - 2) !== 46
        ) {
            formatted = formatted.slice(0, -1)
        }
    }
    return `Invalid purl: ${formatted}`
}

class PurlError extends Error {
    constructor(message) {
        super(formatPurlErrorMessage(message))
    }
}

module.exports = {
    formatPurlErrorMessage,
    PurlError
}
