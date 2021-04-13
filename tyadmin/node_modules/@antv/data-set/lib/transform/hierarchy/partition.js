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
    round: false,
    // ratio: 1.618033988749895, // golden ratio
    padding: 0,
    sort: true,
    as: ['x', 'y'],
};
function transform(dataView, options) {
    if (dataView.dataType !== data_set_1.DataSet.CONSTANTS.HIERARCHY) {
        throw new TypeError('Invalid DataView: This transform is for Hierarchy data only!');
    }
    var root = dataView.root;
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var as = options.as;
    if (!util_1.isArray(as) || as.length !== 2) {
        throw new TypeError('Invalid as: it must be an array with 2 strings (e.g. [ "x", "y" ])!');
    }
    var field;
    try {
        field = option_parser_1.getField(options);
    }
    catch (e) {
        console.warn(e);
    }
    if (field) {
        root.sum(function (d) { return d[field]; });
    }
    var partitionLayout = d3Hierarchy.partition();
    partitionLayout
        .size(options.size)
        .round(options.round)
        .padding(options.padding);
    partitionLayout(root);
    /*
     * points:
     *   3  2
     *   0  1
     */
    var x = as[0];
    var y = as[1];
    root.each(function (node) {
        node[x] = [node.x0, node.x1, node.x1, node.x0];
        node[y] = [node.y1, node.y1, node.y0, node.y0];
        ['x0', 'x1', 'y0', 'y1'].forEach(function (prop) {
            if (as.indexOf(prop) === -1) {
                delete node[prop];
            }
        });
    });
}
data_set_1.DataSet.registerTransform('hierarchy.partition', transform);
data_set_1.DataSet.registerTransform('adjacency', transform);
