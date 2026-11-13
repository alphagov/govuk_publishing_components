'use strict'

function isNullishOrEmptyString(value) {
    return (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.length === 0)
    )
}

module.exports = {
    isNullishOrEmptyString
}
