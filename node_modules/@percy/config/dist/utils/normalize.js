import merge from './merge.js';
import { getSchema } from '../validate.js'; // Edge case camelizations

const CAMELCASE_MAP = new Map([['css', 'CSS'], ['javascript', 'JavaScript']]); // Converts kebab-cased and snake_cased strings to camelCase.

const KEBAB_SNAKE_REG = /[-_]([^-_]+)/g;
export function camelcase(str) {
  if (typeof str !== 'string') return str;
  return str.replace(KEBAB_SNAKE_REG, (match, word) => CAMELCASE_MAP.get(word) || word[0].toUpperCase() + word.slice(1));
} // Coverts camelCased and snake_cased strings to kebab-case.

const CAMEL_SNAKE_REG = /([a-z])([A-Z]+)|_([^_]+)/g;
export function kebabcase(str) {
  if (typeof str !== 'string') return str;
  return Array.from(CAMELCASE_MAP).reduce((str, [word, camel]) => str.replace(camel, `-${word}`), str).replace(CAMEL_SNAKE_REG, (match, p, n, w) => `${p || ''}-${(n || w).toLowerCase()}`);
} // Removes undefined empty values and renames kebab-case properties to camelCase. Optionally
// allows deep merging with options.overrides, converting keys to kebab-case with options.kebab,
// and normalizing against a schema with options.schema.

export function normalize(object, options) {
  var _options, _options2;

  if (typeof options === 'string') options = {
    schema: options
  };
  let keycase = (_options = options) !== null && _options !== void 0 && _options.kebab ? kebabcase : camelcase;
  return merge([object, (_options2 = options) === null || _options2 === void 0 ? void 0 : _options2.overrides], (path, value) => {
    var _options3, _schemas$shift;

    let schemas = getSchema((_options3 = options) === null || _options3 === void 0 ? void 0 : _options3.schema, path.map(camelcase));
    let skip = ((_schemas$shift = schemas.shift()) === null || _schemas$shift === void 0 ? void 0 : _schemas$shift.normalize) === false;
    let mapped = []; // skip normalizing paths of class instances

    if (!skip && typeof value === 'object' && value !== null && value !== void 0 && value.constructor) {
      skip = Object.getPrototypeOf(value) !== Object.prototype;
    }

    for (let [i, k] of path.entries()) {
      var _options4, _options4$skip, _schemas$i;

      skip || (skip = (_options4 = options) === null || _options4 === void 0 ? void 0 : (_options4$skip = _options4.skip) === null || _options4$skip === void 0 ? void 0 : _options4$skip.call(_options4, mapped.concat(k)));
      mapped.push(skip ? k : keycase(k));
      skip || (skip = ((_schemas$i = schemas[i]) === null || _schemas$i === void 0 ? void 0 : _schemas$i.normalize) === false);
    }

    return [mapped];
  });
}
export default normalize;