import { NormalisedPkgs } from '../types';
import { PkgNode } from '../util';
export declare const getChildNodeYarnLockV1Workspace: (name: string, depInfo: {
    version: string;
    isDev: boolean;
}, workspacePkgNameToVersion: Record<string, string>, pkgs: NormalisedPkgs, strictOutOfSync: boolean, includeOptionalDeps: boolean) => PkgNode;
