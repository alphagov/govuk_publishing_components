import { YarnLockV1ProjectParseOptions } from '../types';
export declare const parseYarnLockV1Project: (pkgJsonContent: string, yarnLockContent: string, options: YarnLockV1ProjectParseOptions) => Promise<import("@snyk/dep-graph").DepGraph>;
