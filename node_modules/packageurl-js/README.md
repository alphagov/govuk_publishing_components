# packageurl-js

### Installing

To install `packageurl-js` in your project, simply run:
```bash
npm install packageurl-js
```

This command will download the `packageurl-js` npm package for use in your application.

### Local Development

Clone the `packageurl-js` repo and `cd` into the directory.

Then run:
```bash
npm install
```

### Testing

To run the test suite:
```bash
npm test
```

### Usage Examples

#### Importing

As an ES6 module
```js
import { PackageURL } from 'packageurl-js'
```

As a CommonJS module
```js
const { PackageURL } = require('packageurl-js')
```

#### Parsing

```js
const purlStr = 'pkg:maven/org.springframework.integration/spring-integration-jms@5.5.5'
console.log(PackageURL.fromString(purlStr))
console.log(new PackageURL(...PackageURL.parseString(purlStr)))
```

will both log

```
PackageURL {
    type: 'maven',
    name: 'spring-integration-jms',
    namespace: 'org.springframework.integration',
    version: '5.5.5',
    qualifiers: undefined,
    subpath: undefined
}
```

#### Constructing

```js
const pkg = new PackageURL(
    'maven',
    'org.springframework.integration',
    'spring-integration-jms',
    '5.5.5'
)
console.log(pkg.toString())
```

=>

```
pkg:maven/org.springframework.integration/spring-integration-jms@5.5.5
```

#### Error Handling

```js
try {
    PackageURL.fromString('not-a-purl')
} catch (e) {
    console.error(e.message)
}
```

=>

```
Invalid purl: missing required "pkg" scheme component
```

#### Helper Objects

Helpers for encoding, normalizing, and validating purl components and types can
be imported directly from the module or found on the PackageURL class as static
properties.
```js
import {
    PackageURL,
    PurlComponent,
    PurlType
} from 'packageurl-js'

PurlComponent === PackageURL.Component // => true
PurlType === PackageURL.Type // => true
```

#### PurlComponent

Contains the following properties each with their own `encode`, `normalize`,
and `validate` methods, e.g. `PurlComponent.name.validate(nameStr)`:
  - type
  - namespace
  - name
  - version
  - qualifiers
  - qualifierKey
  - qualifierValue
  - subpath

#### PurlType

Contains the following properties each with their own `normalize`, and `validate`
methods, e.g. `PurlType.npm.validate(purlObj)`:
  - alpm
  - apk
  - bitbucket
  - bitnami
  - composer
  - conan
  - cran
  - deb
  - github
  - gitlab
  - golang
  - hex
  - huggingface
  - luarocks
  - maven
  - mlflow
  - npm
  - oci
  - pub
  - pypi
  - qpkg
  - rpm
  - swift
