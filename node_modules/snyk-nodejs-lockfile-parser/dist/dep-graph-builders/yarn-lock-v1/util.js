"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChildNodeYarnLockV1Workspace = void 0;
const errors_1 = require("../../errors");
const parsers_1 = require("../../parsers");
const util_1 = require("../util");
const getChildNodeYarnLockV1Workspace = (name, depInfo, workspacePkgNameToVersion, pkgs, strictOutOfSync, includeOptionalDeps) => {
    let childNode;
    if (workspacePkgNameToVersion[name]) {
        const version = workspacePkgNameToVersion[name];
        // This is just to mimic old behavior where when StrictOutOfSync is turned on,
        // any cross referencing between workspace packages will lead to a throw
        if (strictOutOfSync) {
            throw new errors_1.OutOfSyncError(`${name}@${version}`, parsers_1.LockfileType.yarn);
        }
        childNode = {
            id: `${name}@${version}`,
            name: name,
            version: version,
            dependencies: {},
            isDev: depInfo.isDev,
        };
    }
    else {
        childNode = (0, util_1.getChildNode)(name, depInfo, pkgs, strictOutOfSync, includeOptionalDeps);
    }
    return childNode;
};
exports.getChildNodeYarnLockV1Workspace = getChildNodeYarnLockV1Workspace;
//# sourceMappingURL=util.js.map