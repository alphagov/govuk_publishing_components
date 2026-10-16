"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPkgsFromYarnLockV2 = void 0;
const js_yaml_1 = require("js-yaml");
const yarnCore = require("@yarnpkg/core");
const utils_1 = require("./utils");
const structUtils = yarnCore.structUtils;
const parseDescriptor = structUtils.parseDescriptor;
const parseRange = structUtils.parseRange;
const keyNormalizer = (0, utils_1.yarnLockFileKeyNormalizer)(parseDescriptor, parseRange);
const extractPkgsFromYarnLockV2 = (yarnLockContent) => {
    const rawYarnLock = (0, js_yaml_1.load)(yarnLockContent, {
        json: true,
        schema: js_yaml_1.FAILSAFE_SCHEMA,
    });
    delete rawYarnLock.__metadata;
    const dependencies = {};
    Object.entries(rawYarnLock).forEach(([fullDescriptor, versionData]) => {
        keyNormalizer(fullDescriptor).forEach((descriptor) => {
            dependencies[descriptor] = versionData;
        });
    });
    return dependencies;
};
exports.extractPkgsFromYarnLockV2 = extractPkgsFromYarnLockV2;
//# sourceMappingURL=extract-yarnlock-v2-pkgs.js.map