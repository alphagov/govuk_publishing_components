"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYarnInfoOutput = void 0;
const parseYarnInfoOutput = (rawYarnInfoOutput) => {
    const formattedYarnInfo = rawYarnInfoOutput
        .split('\n')
        .filter(Boolean)
        .map((el) => JSON.parse(el));
    const formattedInfoOutput = formattedYarnInfo.reduce((result, { value, children }) => {
        var _a;
        const dependencies = ((_a = children.Dependencies) === null || _a === void 0 ? void 0 : _a.map((el) => el.locator.replace(/@virtual:.*#/, '@'))) || [];
        return result.set(value, dependencies);
    }, new Map());
    const rootWorkspaceKey = [...formattedInfoOutput.keys()].find((el) => el.includes('@workspace:.'));
    const topLevelDeps = formattedInfoOutput.get(rootWorkspaceKey) || [];
    // Now we have rootdeps we delete the key
    formattedInfoOutput.delete(rootWorkspaceKey);
    return { topLevelDeps, dependencies: formattedInfoOutput };
};
exports.parseYarnInfoOutput = parseYarnInfoOutput;
//# sourceMappingURL=yarn-info-parser.js.map