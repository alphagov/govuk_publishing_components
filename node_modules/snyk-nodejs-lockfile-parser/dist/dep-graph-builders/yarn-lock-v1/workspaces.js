"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYarnLockV1WorkspaceProject = void 0;
const build_depgraph_workspace_package_pruned_1 = require("./build-depgraph-workspace-package-pruned");
const build_depgraph_workspace_package_1 = require("./build-depgraph-workspace-package");
const extract_yarnlock_v1_pkgs_1 = require("./extract-yarnlock-v1-pkgs");
const util_1 = require("../util");
const c_map_1 = require("../../c-map");
const parseYarnLockV1WorkspaceProject = async (yarnLockContent, workspacePackagesPkgJsons, options) => {
    const { includeDevDeps, includeOptionalDeps, pruneCycles, strictOutOfSync } = options;
    const extractedYarnLockV1Pkgs = (0, extract_yarnlock_v1_pkgs_1.extractPkgsFromYarnLockV1)(yarnLockContent);
    // Parse all package.json files and also extract names cross referencing later
    const workspacePkgNameToVersion = {};
    const parsedWorkspacePkgJsons = workspacePackagesPkgJsons.map((wsPkgJsonContent) => {
        const parsedPkgJson = (0, util_1.parsePkgJson)(wsPkgJsonContent);
        workspacePkgNameToVersion[parsedPkgJson.name] = parsedPkgJson.version;
        return parsedPkgJson;
    });
    const depGraphs = (0, c_map_1.cMap)(parsedWorkspacePkgJsons, async (parsedPkgJson) => {
        return pruneCycles
            ? await (0, build_depgraph_workspace_package_pruned_1.buildDepGraphYarnLockV1WorkspaceCyclesPruned)(extractedYarnLockV1Pkgs, parsedPkgJson, workspacePkgNameToVersion, {
                includeDevDeps,
                strictOutOfSync,
                includeOptionalDeps,
            })
            : await (0, build_depgraph_workspace_package_1.buildDepGraphYarnLockV1Workspace)(extractedYarnLockV1Pkgs, parsedPkgJson, workspacePkgNameToVersion, {
                includeDevDeps,
                strictOutOfSync,
                includeOptionalDeps,
            });
    });
    return depGraphs;
};
exports.parseYarnLockV1WorkspaceProject = parseYarnLockV1WorkspaceProject;
//# sourceMappingURL=workspaces.js.map