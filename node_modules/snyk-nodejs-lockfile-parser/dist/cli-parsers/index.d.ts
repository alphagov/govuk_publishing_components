import { DepGraph } from '@snyk/dep-graph';
export declare const buildDepGraphFromCliOutput: (rawCliOutput: string, lockfileContent: string, manifestFileContent: string) => DepGraph;
