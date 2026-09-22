"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarnLockFileKeyNormalizer = void 0;
const _flatMap = require("lodash.flatmap");
const BUILTIN_PLACEHOLDER = 'builtin';
const MULTIPLE_KEYS_REGEXP = / *, */g;
const keyNormalizer = (parseDescriptor, parseRange) => (rawDescriptor) => {
    // See https://yarnpkg.com/features/protocols
    const descriptors = [rawDescriptor];
    const descriptor = parseDescriptor(rawDescriptor);
    const name = `${descriptor.scope ? '@' + descriptor.scope + '/' : ''}${descriptor.name}`;
    const range = parseRange(descriptor.range);
    const protocol = range.protocol;
    switch (protocol) {
        case 'npm:':
        case 'file:':
            descriptors.push(`${name}@${range.selector}`);
            descriptors.push(`${name}@${protocol}${range.selector}`);
            break;
        case 'git:':
        case 'git+ssh:':
        case 'git+http:':
        case 'git+https:':
        case 'github:':
            if (range.source) {
                descriptors.push(`${name}@${protocol}${range.source}${range.selector ? '#' + range.selector : ''}`);
            }
            else {
                descriptors.push(`${name}@${protocol}${range.selector}`);
            }
            break;
        case 'patch:':
            if (range.source && range.selector.indexOf(BUILTIN_PLACEHOLDER) === 0) {
                descriptors.push(range.source);
            }
            else {
                descriptors.push(`${name}@${protocol}${range.source}${range.selector ? '#' + range.selector : ''}`);
            }
            break;
        case null:
        case undefined:
            if (range.source) {
                descriptors.push(`${name}@${range.source}#${range.selector}`);
            }
            else {
                descriptors.push(`${name}@${range.selector}`);
            }
            break;
        case 'http:':
        case 'https:':
        case 'link:':
        case 'portal:':
        case 'exec:':
        case 'workspace:':
        case 'virtual:':
        default:
            // For user defined plugins
            descriptors.push(`${name}@${protocol}${range.selector}`);
            break;
    }
    return descriptors;
};
const yarnLockFileKeyNormalizer = (parseDescriptor, parseRange) => (fullDescriptor) => {
    const allKeys = fullDescriptor
        .split(MULTIPLE_KEYS_REGEXP)
        .map(keyNormalizer(parseDescriptor, parseRange));
    return new Set(_flatMap(allKeys));
};
exports.yarnLockFileKeyNormalizer = yarnLockFileKeyNormalizer;
//# sourceMappingURL=yarn-utils.js.map