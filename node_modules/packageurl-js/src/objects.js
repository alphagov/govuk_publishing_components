'use strict'

const { LOOP_SENTINEL } = require('./constants')

function isObject(value) {
    return value !== null && typeof value === 'object'
}

function recursiveFreeze(value_) {
    if (
        value_ === null ||
        !(typeof value_ === 'object' || typeof value_ === 'function') ||
        Object.isFrozen(value_)
    ) {
        return value_
    }
    const queue = [value_]
    let { length: queueLength } = queue
    let pos = 0
    while (pos < queueLength) {
        if (pos === LOOP_SENTINEL) {
            throw new Error(
                'Detected infinite loop in object crawl of recursiveFreeze'
            )
        }
        const obj = queue[pos++]
        Object.freeze(obj)
        if (Array.isArray(obj)) {
            for (let i = 0, { length } = obj; i < length; i += 1) {
                const item = obj[i]
                if (
                    item !== null &&
                    (typeof item === 'object' || typeof item === 'function') &&
                    !Object.isFrozen(item)
                ) {
                    queue[queueLength++] = item
                }
            }
        } else {
            const keys = Reflect.ownKeys(obj)
            for (let i = 0, { length } = keys; i < length; i += 1) {
                const propValue = obj[keys[i]]
                if (
                    propValue !== null &&
                    (typeof propValue === 'object' ||
                        typeof propValue === 'function') &&
                    !Object.isFrozen(propValue)
                ) {
                    queue[queueLength++] = propValue
                }
            }
        }
    }
    return value_
}

module.exports = {
    isObject,
    recursiveFreeze
}
