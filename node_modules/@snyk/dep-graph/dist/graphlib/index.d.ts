export { Graph } from './graph';
import { isAcyclic } from './alg/is-acyclic';
import { postorder } from './alg/postorder';
export declare const alg: {
    isAcyclic: typeof isAcyclic;
    postorder: typeof postorder;
};
