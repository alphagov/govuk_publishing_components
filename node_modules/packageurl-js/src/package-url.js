/*!
Copyright (c) the purl authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
'use strict'

const { decodePurlComponent } = require('./decode')
const { isObject, recursiveFreeze } = require('./objects')
const { isBlank, isNonEmptyString, trimLeadingSlashes } = require('./strings')

const { PurlComponent } = require('./purl-component')
const { PurlQualifierNames } = require('./purl-qualifier-names')
const { PurlType } = require('./purl-type')
const { PurlError } = require('./error')

class PackageURL {
    static Component = recursiveFreeze(PurlComponent)
    static KnownQualifierNames = recursiveFreeze(PurlQualifierNames)
    static Type = recursiveFreeze(PurlType)

    constructor(
        rawType,
        rawNamespace,
        rawName,
        rawVersion,
        rawQualifiers,
        rawSubpath
    ) {
        const type = isNonEmptyString(rawType)
            ? PurlComponent.type.normalize(rawType)
            : rawType
        PurlComponent.type.validate(type, true)

        const namespace = isNonEmptyString(rawNamespace)
            ? PurlComponent.namespace.normalize(rawNamespace)
            : rawNamespace
        PurlComponent.namespace.validate(namespace, true)

        const name = isNonEmptyString(rawName)
            ? PurlComponent.name.normalize(rawName)
            : rawName
        PurlComponent.name.validate(name, true)

        const version = isNonEmptyString(rawVersion)
            ? PurlComponent.version.normalize(rawVersion)
            : rawVersion
        PurlComponent.version.validate(version, true)

        const qualifiers =
            typeof rawQualifiers === 'string' || isObject(rawQualifiers)
                ? PurlComponent.qualifiers.normalize(rawQualifiers)
                : rawQualifiers
        PurlComponent.qualifiers.validate(qualifiers, true)

        const subpath = isNonEmptyString(rawSubpath)
            ? PurlComponent.subpath.normalize(rawSubpath)
            : rawSubpath
        PurlComponent.subpath.validate(subpath, true)

        this.type = type
        this.name = name
        this.namespace = namespace ?? undefined
        this.version = version ?? undefined
        this.qualifiers = qualifiers ?? undefined
        this.subpath = subpath ?? undefined

        const typeHelpers = PurlType[type]
        if (typeHelpers) {
            typeHelpers.normalize(this)
            typeHelpers.validate(this, true)
        }
    }

    toString() {
        const { namespace, name, version, qualifiers, subpath, type } = this
        let purlStr = `pkg:${PurlComponent.type.encode(type)}/`
        if (namespace) {
            purlStr = `${purlStr}${PurlComponent.namespace.encode(namespace)}/`
        }
        purlStr = `${purlStr}${PurlComponent.name.encode(name)}`
        if (version) {
            purlStr = `${purlStr}@${PurlComponent.version.encode(version)}`
        }
        if (qualifiers) {
            purlStr = `${purlStr}?${PurlComponent.qualifiers.encode(qualifiers)}`
        }
        if (subpath) {
            purlStr = `${purlStr}#${PurlComponent.subpath.encode(subpath)}`
        }
        return purlStr
    }

    static fromString(purlStr) {
        return new PackageURL(...PackageURL.parseString(purlStr))
    }

    static parseString(purlStr) {
        // https://github.com/package-url/purl-spec/blob/master/PURL-SPECIFICATION.rst#how-to-parse-a-purl-string-in-its-components
        if (typeof purlStr !== 'string') {
            throw new Error('A purl string argument is required.')
        }
        if (isBlank(purlStr)) {
            return [
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ]
        }

        // Split the remainder once from left on ':'.
        const colonIndex = purlStr.indexOf(':')
        // Use WHATWG URL to split up the purl string.
        //   - Split the purl string once from right on '#'
        //   - Split the remainder once from right on '?'
        //   - Split the remainder once from left on ':'
        let url
        let maybeUrlWithAuth
        if (colonIndex !== -1) {
            try {
                // Since a purl never contains a URL Authority, its scheme
                // must not be suffixed with double slash as in 'pkg://'
                // and should use instead 'pkg:'. Purl parsers must accept
                // URLs such as 'pkg://' and must ignore the '//'
                const beforeColon = purlStr.slice(0, colonIndex)
                const afterColon = purlStr.slice(colonIndex + 1)
                const trimmedAfterColon = trimLeadingSlashes(afterColon)
                url = new URL(`${beforeColon}:${trimmedAfterColon}`)
                maybeUrlWithAuth =
                    afterColon.length === trimmedAfterColon.length
                        ? url
                        : new URL(purlStr)
            } catch (e) {
                throw new PurlError('failed to parse as URL', {
                    cause: e
                })
            }
        }
        // The scheme is a constant with the value "pkg".
        if (url?.protocol !== 'pkg:') {
            throw new PurlError('missing required "pkg" scheme component')
        }
        // A purl must NOT contain a URL Authority i.e. there is no support for
        // username, password, host and port components.
        if (
            maybeUrlWithAuth.username !== '' ||
            maybeUrlWithAuth.password !== ''
        ) {
            throw new PurlError('cannot contain a "user:pass@host:port"')
        }

        const { pathname } = url
        const firstSlashIndex = pathname.indexOf('/')
        const rawType = decodePurlComponent(
            'type',
            firstSlashIndex === -1
                ? pathname
                : pathname.slice(0, firstSlashIndex)
        )
        if (firstSlashIndex < 1) {
            return [
                rawType,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ]
        }

        let rawVersion
        let atSignIndex = pathname.lastIndexOf('@')
        // Handle unencoded leading '@' characters. This is a small break from
        // the specification to make parsing more forgiving so that users don't
        // have to deal with it.
        if (
            atSignIndex !== -1 &&
            pathname.charCodeAt(atSignIndex - 1) === 47 /*'/'*/
        ) {
            atSignIndex = -1
        }
        const beforeVersion = pathname.slice(
            rawType.length + 1,
            atSignIndex === -1 ? pathname.length : atSignIndex
        )
        if (atSignIndex !== -1) {
            // Split the remainder once from right on '@'.
            rawVersion = decodePurlComponent(
                'version',
                pathname.slice(atSignIndex + 1)
            )
        }

        let rawNamespace
        let rawName
        const lastSlashIndex = beforeVersion.lastIndexOf('/')
        if (lastSlashIndex === -1) {
            // Split the remainder once from right on '/'.
            rawName = decodePurlComponent('name', beforeVersion)
        } else {
            // Split the remainder once from right on '/'.
            rawName = decodePurlComponent(
                'name',
                beforeVersion.slice(lastSlashIndex + 1)
            )
            // Split the remainder on '/'.
            rawNamespace = decodePurlComponent(
                'namespace',
                beforeVersion.slice(0, lastSlashIndex)
            )
        }

        let rawQualifiers
        const { searchParams } = url
        if (searchParams.size !== 0) {
            searchParams.forEach((value) =>
                decodePurlComponent('qualifiers', value)
            )
            // Split the remainder once from right on '?'.
            rawQualifiers = searchParams
        }

        let rawSubpath
        const { hash } = url
        if (hash.length !== 0) {
            // Split the purl string once from right on '#'.
            rawSubpath = decodePurlComponent('subpath', hash.slice(1))
        }

        return [
            rawType,
            rawNamespace,
            rawName,
            rawVersion,
            rawQualifiers,
            rawSubpath
        ]
    }
}

for (const staticProp of ['Component', 'KnownQualifierNames', 'Type']) {
    Reflect.defineProperty(PackageURL, staticProp, {
        ...Reflect.getOwnPropertyDescriptor(PackageURL, staticProp),
        writable: false
    })
}

Reflect.setPrototypeOf(PackageURL.prototype, null)

module.exports = {
    PackageURL,
    PurlComponent,
    PurlQualifierNames,
    PurlType
}
