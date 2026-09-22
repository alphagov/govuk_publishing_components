'use strict'

const {
    encodeNamespace,
    encodeVersion,
    encodeQualifiers,
    encodeQualifierParam,
    encodeSubpath,
    encodeURIComponent
} = require('./encode')

const { createHelpersNamespaceObject } = require('./helpers')

const {
    normalizeType,
    normalizeNamespace,
    normalizeName,
    normalizeVersion,
    normalizeQualifiers,
    normalizeSubpath
} = require('./normalize')

const { localeCompare, isNonEmptyString } = require('./strings')

const {
    validateType,
    validateNamespace,
    validateName,
    validateVersion,
    validateQualifiers,
    validateQualifierKey,
    validateSubpath
} = require('./validate')

const PurlComponentEncoder = (comp) =>
    isNonEmptyString(comp) ? encodeURIComponent(comp) : ''

const PurlComponentStringNormalizer = (comp) =>
    typeof comp === 'string' ? comp : undefined

const PurlComponentValidator = (_comp, _throws) => true

const componentSortOrderLookup = {
    __proto__: null,
    type: 0,
    namespace: 1,
    name: 2,
    version: 3,
    qualifiers: 4,
    qualifierKey: 5,
    qualifierValue: 6,
    subpath: 7
}

function componentSortOrder(comp) {
    return componentSortOrderLookup[comp] ?? comp
}

function componentComparator(compA, compB) {
    return localeCompare(componentSortOrder(compA), componentSortOrder(compB))
}

module.exports = {
    // Rules for each purl component:
    // https://github.com/package-url/purl-spec/blob/master/PURL-SPECIFICATION.rst#rules-for-each-purl-component
    PurlComponent: createHelpersNamespaceObject(
        {
            encode: {
                namespace: encodeNamespace,
                version: encodeVersion,
                qualifiers: encodeQualifiers,
                qualifierKey: encodeQualifierParam,
                qualifierValue: encodeQualifierParam,
                subpath: encodeSubpath
            },
            normalize: {
                type: normalizeType,
                namespace: normalizeNamespace,
                name: normalizeName,
                version: normalizeVersion,
                qualifiers: normalizeQualifiers,
                subpath: normalizeSubpath
            },
            validate: {
                type: validateType,
                namespace: validateNamespace,
                name: validateName,
                version: validateVersion,
                qualifierKey: validateQualifierKey,
                qualifiers: validateQualifiers,
                subpath: validateSubpath
            }
        },
        {
            comparator: componentComparator,
            encode: PurlComponentEncoder,
            normalize: PurlComponentStringNormalizer,
            validate: PurlComponentValidator
        }
    )
}
