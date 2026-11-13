import * as types from '../core/types';
export { depTreeToGraph, graphToDepTree, DepTree };
interface DepTreeDep {
    name?: string;
    version?: string;
    versionProvenance?: types.VersionProvenance;
    dependencies?: {
        [depName: string]: DepTreeDep;
    };
    labels?: {
        [key: string]: string | undefined;
        scope?: 'dev' | 'prod';
        pruned?: 'cyclic' | 'true';
    };
    purl?: string;
}
/**
 * @deprecated Use {@link DepGraph} instead of DepTree. You can construct a
 * graph with {@link DepGraphBuilder}
 */
interface DepTree extends DepTreeDep {
    type?: string;
    packageFormatVersion?: string;
    targetOS?: {
        name: string;
        version: string;
    };
}
/**
 * @deprecated Don't use dep trees as an intermediate step, because they are
 * large structures, resulting in high memory usage and high CPU costs from
 * serializing / deserializing. Instead, create a graph directly with
 * {@link DepGraphBuilder}
 */
declare function depTreeToGraph(depTree: DepTree, pkgManagerName: string): Promise<types.DepGraph>;
export interface GraphToTreeOptions {
    deduplicateWithinTopLevelDeps: boolean;
}
/**
 * @deprecated Don't use dep trees. You should adapt your code to use graphs,
 * and enhance the dep-graph library if there is missing functionality from
 * the graph structure
 */
declare function graphToDepTree(depGraphInterface: types.DepGraph, pkgType: string, opts?: GraphToTreeOptions): Promise<DepTree>;
