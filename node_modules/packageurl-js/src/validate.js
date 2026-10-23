'use strict'

const { PurlError } = require('./error')
const { isNullishOrEmptyString } = require('./lang')
const { isNonEmptyString } = require('./strings')

function validateEmptyByType(type, name, value, throws) {
    if (!isNullishOrEmptyString(value)) {
        if (throws) {
            throw new PurlError(`${type} "${name}" component must be empty`)
        }
        return false
    }
    return true
}

function validateName(name, throws) {
    return (
        validateRequired('name', name, throws) &&
        validateStrings('name', name, throws)
    )
}

function validateNamespace(namespace, throws) {
    return validateStrings('namespace', namespace, throws)
}

function validateQualifiers(qualifiers, throws) {
    if (qualifiers === null || qualifiers === undefined) {
        return true
    }
    if (typeof qualifiers !== 'object') {
        if (throws) {
            throw new PurlError('"qualifiers" must be an object')
        }
        return false
    }
    const keysIterable =
        // URL searchParams have an "keys" method that returns an iterator.
        typeof qualifiers.keys === 'function'
            ? qualifiers.keys()
            : Object.keys(qualifiers)
    for (const key of keysIterable) {
        if (!validateQualifierKey(key, throws)) {
            return false
        }
    }
    return true
}

function validateQualifierKey(key, throws) {
    // A key cannot start with a number.
    if (!validateStartsWithoutNumber('qualifier', key, throws)) {
        return false
    }
    // The key must be composed only of ASCII letters and numbers,
    // '.', '-' and '_' (period, dash and underscore).
    for (let i = 0, { length } = key; i < length; i += 1) {
        const code = key.charCodeAt(i)
        // prettier-ignore
        if (
            !(
                (
                    (code >= 48 && code <= 57)  || // 0-9
                    (code >= 65 && code <= 90)  || // A-Z
                    (code >= 97 && code <= 122) || // a-z
                    code === 46 || // .
                    code === 45 || // -
                    code === 95    // _
                )
            )
        ) {
            if (throws) {
                throw new PurlError(
                    `qualifier "${key}" contains an illegal character`
                )
            }
            return false
        }
    }
    return true
}

function validateRequired(name, value, throws) {
    if (isNullishOrEmptyString(value)) {
        if (throws) {
            throw new PurlError(`"${name}" is a required component`)
        }
        return false
    }
    return true
}

function validateRequiredByType(type, name, value, throws) {
    if (isNullishOrEmptyString(value)) {
        if (throws) {
            throw new PurlError(`${type} requires a "${name}" component`)
        }
        return false
    }
    return true
}

function validateStartsWithoutNumber(name, value, throws) {
    if (isNonEmptyString(value)) {
        const code = value.charCodeAt(0)
        if (code >= 48 /*'0'*/ && code <= 57 /*'9'*/) {
            if (throws) {
                throw new PurlError(
                    `${name} "${value}" cannot start with a number`
                )
            }
            return false
        }
    }
    return true
}

function validateStrings(name, value, throws) {
    if (value === null || value === undefined || typeof value === 'string') {
        return true
    }
    if (throws) {
        throw new PurlError(`"'${name}" must be a string`)
    }
    return false
}

function validateSubpath(subpath, throws) {
    return validateStrings('subpath', subpath, throws)
}

function validateType(type, throws) {
    // The type cannot be nullish, an empty string, or start with a number.
    if (
        !validateRequired('type', type, throws) ||
        !validateStrings('type', type, throws) ||
        !validateStartsWithoutNumber('type', type, throws)
    ) {
        return false
    }
    // The package type is composed only of ASCII letters and numbers,
    // '.', '+' and '-' (period, plus, and dash)
    for (let i = 0, { length } = type; i < length; i += 1) {
        const code = type.charCodeAt(i)
        // prettier-ignore
        if (
            !(
                (
                    (code >= 48 && code <= 57)  || // 0-9
                    (code >= 65 && code <= 90)  || // A-Z
                    (code >= 97 && code <= 122) || // a-z
                    code === 46 || // .
                    code === 43 || // +
                    code === 45    // -
                )
            )
        ) {
            if (throws) {
                throw new PurlError(
                    `type "${type}" contains an illegal character`
                )
            }
            return false
        }
    }
    return true
}

function validateVersion(version, throws) {
    return validateStrings('version', version, throws)
}

module.exports = {
    validateEmptyByType,
    validateName,
    validateNamespace,
    validateQualifiers,
    validateQualifierKey,
    validateRequired,
    validateRequiredByType,
    validateStartsWithoutNumber,
    validateStrings,
    validateSubpath,
    validateType,
    validateVersion
}
