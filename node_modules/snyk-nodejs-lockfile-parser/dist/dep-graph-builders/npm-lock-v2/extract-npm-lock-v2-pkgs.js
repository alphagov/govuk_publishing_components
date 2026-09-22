"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPkgsFromNpmLockV2 = void 0;
const extractPkgsFromNpmLockV2 = (pkgLockContent) => {
    return JSON.parse(pkgLockContent).packages;
};
exports.extractPkgsFromNpmLockV2 = extractPkgsFromNpmLockV2;
//# sourceMappingURL=extract-npm-lock-v2-pkgs.js.map