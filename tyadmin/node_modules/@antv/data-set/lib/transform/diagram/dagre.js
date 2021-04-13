"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/*
 * for DAG
 * graph data required (nodes, edges)
 */
var util_1 = require("@antv/util");
var dagre_1 = tslib_1.__importDefault(require("dagre"));
var data_set_1 = require("../../data-set");
var DEFAULT_OPTIONS = {
    // nodeId: node => node.index,
    rankdir: 'TB',
    align: 'TB',
    nodesep: 50,
    edgesep: 10,
    ranksep: 50,
    source: function (edge) { return edge.source; },
    target: function (edge) { return edge.target; },
};
function transform(dv, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var g = new dagre_1.default.graphlib.Graph();
    // Set an object for the graph label
    g.setGraph({});
    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function () {
        return {};
    });
    dv.nodes.forEach(function (node) {
        var nodeId = options.nodeId ? options.nodeId(node) : node.id;
        if (!node.height && !node.width) {
            node.height = node.width = options.edgesep;
        }
        g.setNode(nodeId, node);
    });
    dv.edges.forEach(function (edge) {
        g.setEdge(options.source(edge), options.target(edge));
    });
    dagre_1.default.layout(g);
    var nodes = [];
    var edges = [];
    g.nodes().forEach(function (node) {
        var n = g.node(node);
        var x = n.x, y = n.y, height = n.height, width = n.width;
        /* points
         * 3---2
         * |   |
         * 0---1
         */
        // @ts-ignore
        n.x = [x - width / 2, x + width / 2, x + width / 2, x - width / 2];
        // @ts-ignore
        n.y = [y + height / 2, y + height / 2, y - height / 2, y - height / 2];
        nodes.push(n);
    });
    g.edges().forEach(function (edge) {
        var points = g.edge(edge).points;
        var e = {};
        e.x = points.map(function (p) { return p.x; });
        e.y = points.map(function (p) { return p.y; });
        edges.push(e);
    });
    dv.nodes = nodes;
    dv.edges = edges;
}
data_set_1.DataSet.registerTransform('diagram.dagre', transform);
data_set_1.DataSet.registerTransform('dagre', transform);
