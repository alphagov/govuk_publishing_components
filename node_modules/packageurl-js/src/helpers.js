'use strict'

function createHelpersNamespaceObject(helpers, options_ = {}) {
    const { comparator, ...defaults } = { __proto__: null, ...options_ }
    const helperNames = Object.keys(helpers).sort()
    const propNames = [
        ...new Set([...Object.values(helpers)].map(Object.keys).flat())
    ].sort(comparator)
    const nsObject = Object.create(null)
    for (let i = 0, { length } = propNames; i < length; i += 1) {
        const propName = propNames[i]
        const helpersForProp = Object.create(null)
        for (
            let j = 0, { length: length_j } = helperNames;
            j < length_j;
            j += 1
        ) {
            const helperName = helperNames[j]
            const helperValue =
                helpers[helperName][propName] ?? defaults[helperName]
            if (helperValue !== undefined) {
                helpersForProp[helperName] = helperValue
            }
        }
        nsObject[propName] = helpersForProp
    }
    return nsObject
}

module.exports = {
    createHelpersNamespaceObject
}
