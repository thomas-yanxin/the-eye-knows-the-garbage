"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * for Arc Diagram (edges without weight) / Chord Diagram (edges with source and target weight)
 * graph data required (nodes, edges)
 */
var util_1 = require("@antv/util");
var data_set_1 = require("../../data-set");
var DEFAULT_OPTIONS = {
    y: 0,
    thickness: 0.05,
    weight: false,
    marginRatio: 0.1,
    id: function (node) { return node.id; },
    source: function (edge) { return edge.source; },
    target: function (edge) { return edge.target; },
    sourceWeight: function (edge) { return edge.value || 1; },
    targetWeight: function (edge) { return edge.value || 1; },
    sortBy: null,
};
function _nodesFromEdges(edges, options, map) {
    if (map === void 0) { map = {}; }
    edges.forEach(function (edge) {
        var sId = options.edgeSource(edge);
        var tId = options.edgeTarget(edge);
        if (!map[sId]) {
            map[sId] = {
                id: sId,
            };
        }
        if (!map[tId]) {
            map[tId] = {
                id: tId,
            };
        }
    });
    return util_1.values(map);
}
function _processGraph(nodeById, edges, options) {
    util_1.forIn(nodeById, function (node, id) {
        // in edges, out edges
        node.inEdges = edges.filter(function (edge) { return "" + options.target(edge) === "" + id; });
        node.outEdges = edges.filter(function (edge) { return "" + options.source(edge) === "" + id; });
        // frequency
        node.edges = node.outEdges.concat(node.inEdges);
        node.frequency = node.edges.length;
        // weight
        node.value = 0;
        node.inEdges.forEach(function (edge) {
            node.value += options.targetWeight(edge);
        });
        node.outEdges.forEach(function (edge) {
            node.value += options.sourceWeight(edge);
        });
    });
}
function _sortNodes(nodes, options) {
    var sortMethods = {
        weight: function (a, b) { return b.value - a.value; },
        frequency: function (a, b) { return b.frequency - a.frequency; },
        id: function (a, b) { return ("" + options.id(a)).localeCompare("" + options.id(b)); },
    };
    var method = sortMethods[options.sortBy];
    if (!method && util_1.isFunction(options.sortBy)) {
        method = options.sortBy;
    }
    if (method) {
        nodes.sort(method);
    }
}
function _layoutNodes(nodes, options) {
    var len = nodes.length;
    if (!len) {
        throw new TypeError("Invalid nodes: it's empty!");
    }
    if (options.weight) {
        var marginRatio_1 = options.marginRatio;
        if (marginRatio_1 < 0 || marginRatio_1 >= 1) {
            throw new TypeError('Invalid marginRatio: it must be in range [0, 1)!');
        }
        var margin_1 = marginRatio_1 / (2 * len);
        var thickness_1 = options.thickness;
        if (thickness_1 <= 0 || thickness_1 >= 1) {
            throw new TypeError('Invalid thickness: it must be in range (0, 1)!');
        }
        var totalValue_1 = 0;
        nodes.forEach(function (node) {
            totalValue_1 += node.value;
        });
        nodes.forEach(function (node) {
            node.weight = node.value / totalValue_1;
            node.width = node.weight * (1 - marginRatio_1);
            node.height = thickness_1;
        });
        nodes.forEach(function (node, index) {
            // x
            var deltaX = 0;
            for (var i = index - 1; i >= 0; i--) {
                deltaX += nodes[i].width + 2 * margin_1;
            }
            var minX = (node.minX = margin_1 + deltaX);
            var maxX = (node.maxX = node.minX + node.width);
            var minY = (node.minY = options.y - thickness_1 / 2);
            var maxY = (node.maxY = minY + thickness_1);
            node.x = [minX, maxX, maxX, minX];
            node.y = [minY, minY, maxY, maxY];
            /* points
             * 3---2
             * |   |
             * 0---1
             */
            // node.x = minX + 0.5 * node.width;
            // node.y = options.y;
        });
    }
    else {
        var deltaX_1 = 1 / len;
        nodes.forEach(function (node, index) {
            node.x = (index + 0.5) * deltaX_1;
            node.y = options.y;
        });
    }
}
function _locatingEdges(nodeById, edges, options) {
    if (options.weight) {
        var valueById_1 = {};
        util_1.forIn(nodeById, function (node, id) {
            valueById_1[id] = node.value;
        });
        edges.forEach(function (edge) {
            var sId = options.source(edge);
            var tId = options.target(edge);
            var sNode = nodeById[sId];
            var tNode = nodeById[tId];
            if (sNode && tNode) {
                var sValue = valueById_1[sId];
                var currentSValue = options.sourceWeight(edge);
                var sStart = sNode.minX + ((sNode.value - sValue) / sNode.value) * sNode.width;
                var sEnd = sStart + (currentSValue / sNode.value) * sNode.width;
                valueById_1[sId] -= currentSValue;
                var tValue = valueById_1[tId];
                var currentTValue = options.targetWeight(edge);
                var tStart = tNode.minX + ((tNode.value - tValue) / tNode.value) * tNode.width;
                var tEnd = tStart + (currentTValue / tNode.value) * tNode.width;
                valueById_1[tId] -= currentTValue;
                var y = options.y;
                edge.x = [sStart, sEnd, tStart, tEnd];
                edge.y = [y, y, y, y];
            }
        });
    }
    else {
        edges.forEach(function (edge) {
            var sNode = nodeById[options.source(edge)];
            var tNode = nodeById[options.target(edge)];
            if (sNode && tNode) {
                edge.x = [sNode.x, tNode.x];
                edge.y = [sNode.y, tNode.y];
            }
        });
    }
}
function transform(dv, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var nodeById = {};
    var nodes = dv.nodes;
    var edges = dv.edges;
    if (!util_1.isArray(nodes) || nodes.length === 0) {
        nodes = _nodesFromEdges(edges, options, nodeById);
    }
    nodes.forEach(function (node) {
        var id = options.id(node);
        nodeById[id] = node;
    });
    _processGraph(nodeById, edges, options);
    _sortNodes(nodes, options);
    _layoutNodes(nodes, options);
    _locatingEdges(nodeById, edges, options);
    dv.nodes = nodes;
    dv.edges = edges;
}
data_set_1.DataSet.registerTransform('diagram.arc', transform);
data_set_1.DataSet.registerTransform('arc', transform);
