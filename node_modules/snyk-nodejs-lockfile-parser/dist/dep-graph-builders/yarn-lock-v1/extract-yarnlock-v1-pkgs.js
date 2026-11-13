"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPkgsFromYarnLockV1 = void 0;
const yarnLockfileParser = require("@yarnpkg/lockfile");
const extractPkgsFromYarnLockV1 = (yarnLockContent) => {
    return yarnLockfileParser.parse(yarnLockContent).object;
};
exports.extractPkgsFromYarnLockV1 = extractPkgsFromYarnLockV1;
//# sourceMappingURL=extract-yarnlock-v1-pkgs.js.map