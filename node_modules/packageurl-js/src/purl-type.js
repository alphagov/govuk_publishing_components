'use strict'

const { isNullishOrEmptyString } = require('./lang')

const { createHelpersNamespaceObject } = require('./helpers')

const {
    isSemverString,
    lowerName,
    lowerNamespace,
    lowerVersion,
    replaceDashesWithUnderscores,
    replaceUnderscoresWithDashes
} = require('./strings')

const { validateEmptyByType, validateRequiredByType } = require('./validate')
const { PurlError } = require('./error')

const PurlTypNormalizer = (purl) => purl

const PurlTypeValidator = (_purl, _throws) => true

module.exports = {
    // PURL types:
    // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst
    PurlType: createHelpersNamespaceObject(
        {
            normalize: {
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#alpm
                alpm(purl) {
                    lowerNamespace(purl)
                    lowerName(purl)
                    return purl
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#apk
                apk(purl) {
                    lowerNamespace(purl)
                    lowerName(purl)
                    return purl
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#bitbucket
                bitbucket(purl) {
                    lowerNamespace(purl)
                    lowerName(purl)
                    return purl
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#bitnami
                bitnami(purl) {
                    lowerName(purl)
                    return purl
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#composer
                composer(purl) {
                    lowerNamespace(purl)
                    lowerName(purl)
                    return purl
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#deb
                deb(purl) {
                    lowerNamespace(purl)
                    lowerName(purl)
                    return purl
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#other-candidate-types-to-define
                gitlab(purl) {
                    lowerNamespace(purl)
                    lowerName(purl)
                    return purl
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#github
                github(purl) {
                    lowerNamespace(purl)
                    lowerName(purl)
                    return purl
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#golang
                // golang(purl) {
                //     // Ignore case-insensitive rule because go.mod are case-sensitive.
                //     // Pending spec change: https://github.com/package-url/purl-spec/pull/196
                //     lowerNamespace(purl)
                //     lowerName(purl)
                //     return purl
                // },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#hex
                hex(purl) {
                    lowerNamespace(purl)
                    lowerName(purl)
                    return purl
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#huggingface
                huggingface(purl) {
                    lowerVersion(purl)
                    return purl
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#mlflow
                mlflow(purl) {
                    if (
                        purl.qualifiers?.repository_url?.includes('databricks')
                    ) {
                        lowerName(purl)
                    }
                    return purl
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#npm
                npm(purl) {
                    lowerNamespace(purl)
                    lowerName(purl)
                    return purl
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#luarocks
                luarocks(purl) {
                    lowerVersion(purl)
                    return purl
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#oci
                oci(purl) {
                    lowerName(purl)
                    return purl
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#pub
                pub(purl) {
                    lowerName(purl)
                    purl.name = replaceDashesWithUnderscores(purl.name)
                    return purl
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#pypi
                pypi(purl) {
                    lowerNamespace(purl)
                    lowerName(purl)
                    purl.name = replaceUnderscoresWithDashes(purl.name)
                    return purl
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#qpkg
                qpkg(purl) {
                    lowerNamespace(purl)
                    return purl
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#rpm
                rpm(purl) {
                    lowerNamespace(purl)
                    return purl
                }
            },
            validate: {
                // TODO: cocoapods name validation
                // TODO: cpan namespace validation
                // TODO: swid qualifier validation
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#conan
                conan(purl, throws) {
                    if (isNullishOrEmptyString(purl.namespace)) {
                        if (purl.qualifiers?.channel) {
                            if (throws) {
                                throw new PurlError(
                                    'conan requires a "namespace" component when a "channel" qualifier is present'
                                )
                            }
                            return false
                        }
                    } else if (isNullishOrEmptyString(purl.qualifiers)) {
                        if (throws) {
                            throw new PurlError(
                                'conan requires a "qualifiers" component when a namespace is present'
                            )
                        }
                        return false
                    }
                    return true
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#cran
                cran(purl, throws) {
                    return validateRequiredByType(
                        'cran',
                        'version',
                        purl.version,
                        throws
                    )
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#golang
                golang(purl) {
                    // Still being lenient here since the standard changes aren't official.
                    // Pending spec change: https://github.com/package-url/purl-spec/pull/196
                    const { version } = purl
                    const length =
                        typeof version === 'string' ? version.length : 0
                    // If the version starts with a "v" then ensure its a valid semver version.
                    // This, by semver semantics, also supports pseudo-version number.
                    // https://go.dev/doc/modules/version-numbers#pseudo-version-number
                    if (
                        length &&
                        version.charCodeAt(0) === 118 /*'v'*/ &&
                        !isSemverString(version.slice(1))
                    ) {
                        if (throws) {
                            throw new PurlError(
                                'golang "version" component starting with a "v" must be followed by a valid semver version'
                            )
                        }
                        return false
                    }
                    return true
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#maven
                maven(purl, throws) {
                    return validateRequiredByType(
                        'maven',
                        'namespace',
                        purl.namespace,
                        throws
                    )
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#mlflow
                mlflow(purl, throws) {
                    return validateEmptyByType(
                        'mlflow',
                        'namespace',
                        purl.namespace,
                        throws
                    )
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#oci
                oci(purl, throws) {
                    return validateEmptyByType(
                        'oci',
                        'namespace',
                        purl.namespace,
                        throws
                    )
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#pub
                pub(purl, throws) {
                    const { name } = purl
                    for (let i = 0, { length } = name; i < length; i += 1) {
                        const code = name.charCodeAt(i)
                        // prettier-ignore
                        if (
                  !(
                      (
                          (code >= 48 && code <= 57)  || // 0-9
                          (code >= 97 && code <= 122) || // a-z
                          code === 95 // _
                      )
                  )
              ) {
                  if (throws) {
                      throw new PurlError(
                          'pub "name" component may only contain [a-z0-9_] characters'
                      )
                  }
                  return false
              }
                    }
                    return true
                },
                // https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#swift
                swift(purl, throws) {
                    return (
                        validateRequiredByType(
                            'swift',
                            'namespace',
                            purl.namespace,
                            throws
                        ) &&
                        validateRequiredByType(
                            'swift',
                            'version',
                            purl.version,
                            throws
                        )
                    )
                }
            }
        },
        {
            normalize: PurlTypNormalizer,
            validate: PurlTypeValidator
        }
    )
}
