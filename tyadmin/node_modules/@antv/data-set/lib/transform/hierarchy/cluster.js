"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var d3Hierarchy = tslib_1.__importStar(require("d3-hierarchy"));
var util_1 = require("@antv/util");
var data_set_1 = require("../../data-set");
var option_parser_1 = require("../../util/option-parser");
var DEFAULT_OPTIONS = {
    field: 'value',
    size: [1, 1],
    nodeSize: null,
    separation: null,
    as: ['x', 'y'],
};
function transform(dataView, options) {
    if (dataView.dataType !== data_set_1.DataSet.CONSTANTS.HIERARCHY || !dataView.root) {
        throw new TypeError('Invalid DataView: This transform is for Hierarchy data only!');
    }
    var root = dataView.root;
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var as = options.as;
    if (!util_1.isArray(as) || as.length !== 2) {
        throw new TypeError('Invalid as: it must be an array with 2 strings (e.g. [ "x", "y" ])!');
    }
    var field = undefined;
    try {
        field = option_parser_1.getField(options);
    }
    catch (e) {
        console.warn(e);
    }
    if (field) {
        root.sum(function (d) { return d[field]; });
    }
    var clusterLayout = d3Hierarchy.cluster();
    clusterLayout.size(options.size);
    if (options.nodeSize) {
        clusterLayout.nodeSize(options.nodeSize);
    }
    if (options.separation) {
        clusterLayout.separation(options.separation);
    }
    clusterLayout(root);
    var x = as[0];
    var y = as[1];
    root.each(function (node) {
        node[x] = node.x;
        node[y] = node.y;
    });
}
data_set_1.DataSet.registerTransform('hierarchy.cluster', transform);
data_set_1.DataSet.registerTransform('dendrogram', transform);
