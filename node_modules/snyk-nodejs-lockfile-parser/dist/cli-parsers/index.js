"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDepGraphFromCliOutput = void 0;
const dep_graph_1 = require("@snyk/dep-graph");
const __1 = require("..");
const parsers_1 = require("../parsers");
const cli_parser_utils_1 = require("./cli-parser-utils");
const yarn_info_parser_1 = require("./yarn-info-parser");
const yarn_list_parser_1 = require("./yarn-list-parser");
const buildDepGraphFromCliOutput = (rawCliOutput, lockfileContent, manifestFileContent) => {
    const manifestDependencies = JSON.parse(manifestFileContent).dependencies || {};
    const lockfileType = (0, __1.getYarnLockfileType)(lockfileContent);
    const { name: rootName, version: rootVersion } = JSON.parse(manifestFileContent);
    const pkgManagerVersion = lockfileType === parsers_1.LockfileType.yarn ? '1' : '2';
    // Build depMap object from the cli output
    const formattedCliOutput = pkgManagerVersion === '1'
        ? (0, yarn_list_parser_1.parseYarnListOutput)(rawCliOutput, manifestDependencies)
        : (0, yarn_info_parser_1.parseYarnInfoOutput)(rawCliOutput);
    const rootPkgInfo = rootName
        ? Object.assign({ name: rootName }, (rootVersion && { version: rootVersion })) : undefined;
    const pkgManager = {
        name: 'yarn',
        version: pkgManagerVersion,
    };
    const builder = new dep_graph_1.DepGraphBuilder(pkgManager, rootPkgInfo);
    const { topLevelDeps, dependencies: depMap } = formattedCliOutput;
    // Add all nodes
    [...depMap.keys()].forEach((name) => {
        const { name: pkgName, identifier: pkgVersion } = (0, cli_parser_utils_1.extractNameAndIdentifier)(name);
        builder.addPkgNode({ name: pkgName, version: pkgVersion.split(':').pop() }, name);
    });
    // Deal with root special case first
    const rootNodeId = builder.rootNodeId;
    topLevelDeps.forEach((dep) => builder.connectDep(rootNodeId, dep));
    // Now rest of deps
    [...depMap.entries()].forEach(([parent, deps]) => {
        deps.forEach((dep) => {
            builder.connectDep(parent, dep);
        });
    });
    return builder.build();
};
exports.buildDepGraphFromCliOutput = buildDepGraphFromCliOutput;
//# sourceMappingURL=index.js.map