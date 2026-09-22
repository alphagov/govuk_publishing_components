import { YarnLockV2ProjectParseOptions, YarnLockV2WorkspaceArgs } from '../types';
import { DepGraph } from '@snyk/dep-graph';
export declare const parseYarnLockV2Project: (pkgJsonContent: string, yarnLockContent: string, options: YarnLockV2ProjectParseOptions, workspaceArgs?: YarnLockV2WorkspaceArgs) => Promise<DepGraph>;
