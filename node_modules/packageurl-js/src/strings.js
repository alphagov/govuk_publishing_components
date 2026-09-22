'use strict'

// Intl.Collator is faster than String#localeCompare
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare:
// > When comparing large numbers of strings, such as in sorting large arrays,
// > it is better to create an Intl.Collator object and use the function provided
// > by its compare() method.
const { compare: localeCompare } = new Intl.Collator()

// This regexp is valid as of 2024-08-01.
// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
const regexSemverNumberedGroups =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

function isBlank(str) {
    for (let i = 0, { length } = str; i < length; i += 1) {
        const code = str.charCodeAt(i)
        // prettier-ignore
        if (
            !(
                // Whitespace characters according to ECMAScript spec:
                // https://tc39.es/ecma262/#sec-white-space
                (
                    code === 0x0020 || // Space
                    code === 0x0009 || // Tab
                    code === 0x000a || // Line Feed
                    code === 0x000b || // Vertical Tab
                    code === 0x000c || // Form Feed
                    code === 0x000d || // Carriage Return
                    code === 0x00a0 || // No-Break Space
                    code === 0x1680 || // Ogham Space Mark
                    code === 0x2000 || // En Quad
                    code === 0x2001 || // Em Quad
                    code === 0x2002 || // En Space
                    code === 0x2003 || // Em Space
                    code === 0x2004 || // Three-Per-Em Space
                    code === 0x2005 || // Four-Per-Em Space
                    code === 0x2006 || // Six-Per-Em Space
                    code === 0x2007 || // Figure Space
                    code === 0x2008 || // Punctuation Space
                    code === 0x2009 || // Thin Space
                    code === 0x200a || // Hair Space
                    code === 0x2028 || // Line Separator
                    code === 0x2029 || // Paragraph Separator
                    code === 0x202f || // Narrow No-Break Space
                    code === 0x205f || // Medium Mathematical Space
                    code === 0x3000 || // Ideographic Space
                    code === 0xfeff    // Byte Order Mark
                )
            )
        ) {
            return false
        }
    }
    return true
}

function isNonEmptyString(value) {
    return typeof value === 'string' && value.length > 0
}

function isSemverString(value) {
    return typeof value === 'string' && regexSemverNumberedGroups.test(value)
}

function lowerName(purl) {
    purl.name = purl.name.toLowerCase()
}

function lowerNamespace(purl) {
    const { namespace } = purl
    if (typeof namespace === 'string') {
        purl.namespace = namespace.toLowerCase()
    }
}

function lowerVersion(purl) {
    const { version } = purl
    if (typeof version === 'string') {
        purl.version = version.toLowerCase()
    }
}

function replaceDashesWithUnderscores(str) {
    // Replace all "-" with "_"
    let result = ''
    let fromIndex = 0
    let index = 0
    while ((index = str.indexOf('-', fromIndex)) !== -1) {
        result = result + str.slice(fromIndex, index) + '_'
        fromIndex = index + 1
    }
    return fromIndex ? result + str.slice(fromIndex) : str
}

function replaceUnderscoresWithDashes(str) {
    // Replace all "_" with "-"
    let result = ''
    let fromIndex = 0
    let index = 0
    while ((index = str.indexOf('_', fromIndex)) !== -1) {
        result = result + str.slice(fromIndex, index) + '-'
        fromIndex = index + 1
    }
    return fromIndex ? result + str.slice(fromIndex) : str
}

function trimLeadingSlashes(str) {
    let start = 0
    while (str.charCodeAt(start) === 47 /*'/'*/) {
        start += 1
    }
    return start === 0 ? str : str.slice(start)
}

module.exports = {
    isBlank,
    isNonEmptyString,
    isSemverString,
    localeCompare,
    lowerName,
    lowerNamespace,
    lowerVersion,
    replaceDashesWithUnderscores,
    replaceUnderscoresWithDashes,
    trimLeadingSlashes
}
