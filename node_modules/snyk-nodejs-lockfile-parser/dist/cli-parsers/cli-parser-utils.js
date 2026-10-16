"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCorrectIdentifierBySemver = exports.extractNameAndIdentifier = void 0;
const semver = require("semver");
const extractNameAndIdentifier = (candidate) => {
    let name, identifier;
    if (candidate.includes('@')) {
        const index = candidate.indexOf('@', 1);
        name = candidate.slice(0, index);
        identifier = candidate.slice(index + 1);
    }
    else {
        name = candidate;
        identifier = 'unknown';
    }
    return { name, identifier };
};
exports.extractNameAndIdentifier = extractNameAndIdentifier;
// This function will choose an item in a particular list that satisfies the semver provided
// i.e. possibleMatches = [debug@1.2.0, debug@2.2.6] and versionToMatch = debug@~2.2.0
// will result in debug@2.2.6 - This is required as yarn list does not have the resolved semver
// in dependencies.
const extractCorrectIdentifierBySemver = (possibleMatches, versionToMatch) => {
    const { name: nameToMatch, identifier: identifierToMatch } = (0, exports.extractNameAndIdentifier)(versionToMatch);
    const hasQualifiers = isNaN(parseInt(identifierToMatch[0]));
    if (!hasQualifiers) {
        return versionToMatch;
    }
    // Check for matching name, if only one found shortcircuit
    const match = possibleMatches
        .filter((name) => name.startsWith(nameToMatch))
        .filter((name) => semver.satisfies((0, exports.extractNameAndIdentifier)(name).identifier, identifierToMatch))
        .map((name) => ({
        name,
        identifier: (0, exports.extractNameAndIdentifier)(name).identifier,
    }))
        .reduce((acc, item) => semver.gt(item.identifier, acc.identifier) ? item : acc);
    return match.name;
};
exports.extractCorrectIdentifierBySemver = extractCorrectIdentifierBySemver;
//# sourceMappingURL=cli-parser-utils.js.map