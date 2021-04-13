"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var data_set_1 = require("../data-set");
var DEFAULT_OPTIONS = {
    nodes: function (d) {
        // optional
        return d.nodes;
    },
    edges: function (d) {
        // optional
        return d.edges;
    },
};
function connector(data, options, dataView) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    dataView.dataType = data_set_1.DataSet.CONSTANTS.GRAPH;
    var nodes = options.nodes, edges = options.edges;
    if (nodes && !util_1.isFunction(nodes)) {
        throw new TypeError('Invalid nodes: must be a function!');
    }
    if (edges && !util_1.isFunction(edges)) {
        throw new TypeError('Invalid edges: must be a function!');
    }
    // @ts-ignore
    dataView.rows = dataView.graph = {
        nodes: nodes(data),
        edges: edges(data),
    };
    util_1.assign(dataView, dataView.graph);
    return dataView.rows;
}
data_set_1.DataSet.registerConnector('graph', connector);
data_set_1.DataSet.registerConnector('diagram', connector);
