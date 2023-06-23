# rollup-plugin-polyfill
Rollup Plugin to include a polyfill in your bundle.
Literally injects a require or import statement in the beginning of your entry files.
This is useful if you only want to include certain logic in some variants of
your build.

## API
### `polyfill(packages)`
* `packages` is a list of modules to be resolved in your bundle.

## Usage
Check out the example folder to see more configurations
```javascript
const polyfill = require('rollup-plugin-polyfill')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const plugins = [
  resolve(),
  commonjs(),
  polyfill(['es6-object-assign/auto', './string-reverse.js']),
]

export default {
  input: 'index.js',
  output: {
    file: 'bundle.js',
    format: 'iife',
    name: 'example'
  },
  plugins: plugins
}
```
