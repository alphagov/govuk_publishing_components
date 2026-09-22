import { DepGraph } from './types';
/**
 * Creates an induced subgraph of  {@param graphB} with only packages
 * that are not present in {@param graphA} or have a different version.
 *
 * @param graphA
 * @param graphB
 */
export declare function createChangedPackagesGraph(graphA: DepGraph, graphB: DepGraph): Promise<DepGraph>;
