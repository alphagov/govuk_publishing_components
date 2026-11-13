# encode-registry

[![Status](https://travis-ci.org/pnpm/encode-registry.svg?branch=master)](https://travis-ci.org/pnpm/encode-registry "See test builds")

> Encodes a registry URL. [Memoized](https://en.wikipedia.org/wiki/Memoization).

## Install

```
<pnpm|yarn|npm> add encode-registry
```

## Usage

```js
const encodeRegistry = require('encode-registry')

encodeRegistry('https://registry.npmjs.org/')
//> registry.npmjs.org

encodeRegistry('https://localhost:4873/')
//> localhost+4873
```

## License

[MIT](LICENSE)
