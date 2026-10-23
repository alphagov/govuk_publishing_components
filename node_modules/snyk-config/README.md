# snyk-config

Loads the configuration for your module.


## Usage

Although you can require this module directly, it's recommended you create your
own `config.ts` file that can be cached by the require system and called *without* a path:

```typescript
// config.ts
import { loadConfig } from 'snyk-config';
export const config = loadConfig('<directory with config files>');

// in app.ts
import { config } from './config';

// in foo.ts
import { config } from './config'; // matches config in app.ts
```


## Method

The config loader will look for the following values in order of priority,
specifically, if a property appears in multiple layers of config (below) the
first found is used:

- process environment values prefixed with `SNYK_`
- process arguments
- a `config.secret.json` file in the path specified by:
   * the `secretConfig` option, or
   * the environment variable `CONFIG_SECRET_FILE`, or
   * in the specified config directory
- a `config.${SERVICE_ENV}.json` file in the specified config directory,
   * where `SERVICE_ENV` defaults to `local`, if not set
- a `config.default.json` file in the specified config directory


## Example

### config.local.json

```json
{
  "from": "file"
}
```


### app.js

```typescript
import { loadConfig } from 'snyk-config';
// as we're in the same directory as the config.local.json, there's no arg
const config = loadConfig();
console.log(config);
```


### cli

```shell
$ SNYK_from=cli node app.js
=> { from: "cli" }
```


## Notes

* Values read from the environment or from the process arguments will *always* be `strings`
  or `boolean`s. This is important to differentiate from values parsed in the config files
  as these can be `numbers`.
* Environment property names strip *off* the preceding `SNYK_` string, so `SNYK_foo = 10`
  becomes `foo = "10"`
* To create a nested object structure from the environment values, use two underscores:
  `SNYK_foo__bar = 10` becomes `foo = { bar: "10" }`
* By default, environment variable values will not be JSON-parsed.
  Parsing can be enabled by adding the `parseEnvValues` option, or by setting
  the `CONFIG_PARSE_ENV_VALUES` environment variable.
