import type { NormalisedPkgs, PackageJsonBase } from '../types';
import type { DepGraphBuildOptions } from '../types';
export declare const buildDepGraphYarnLockV1Workspace: (extractedYarnLockV1Pkgs: NormalisedPkgs, pkgJson: PackageJsonBase, workspacePkgNameToVersion: Record<string, string>, options: DepGraphBuildOptions) => Promise<import("@snyk/dep-graph").DepGraph>;
