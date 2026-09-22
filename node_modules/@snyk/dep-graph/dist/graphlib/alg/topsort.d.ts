import { Graph } from '../graph';
export declare function topsort(g: Graph): string[];
export declare class CycleException extends Error {
}
