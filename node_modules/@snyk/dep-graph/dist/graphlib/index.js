"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alg = exports.Graph = void 0;
var graph_1 = require("./graph");
Object.defineProperty(exports, "Graph", { enumerable: true, get: function () { return graph_1.Graph; } });
const is_acyclic_1 = require("./alg/is-acyclic");
const postorder_1 = require("./alg/postorder");
exports.alg = {
    isAcyclic: is_acyclic_1.isAcyclic,
    postorder: postorder_1.postorder,
};
//# sourceMappingURL=index.js.map