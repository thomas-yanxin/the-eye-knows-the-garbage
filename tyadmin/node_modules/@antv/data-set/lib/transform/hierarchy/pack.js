"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var d3Hierarchy = tslib_1.__importStar(require("d3-hierarchy"));
var data_set_1 = require("../../data-set");
var option_parser_1 = require("../../util/option-parser");
var DEFAULT_OPTIONS = {
    field: 'value',
    size: [1, 1],
    padding: 0,
    as: ['x', 'y', 'r'],
};
function transform(dataView, options) {
    if (dataView.dataType !== data_set_1.DataSet.CONSTANTS.HIERARCHY) {
        throw new TypeError('Invalid DataView: This transform is for Hierarchy data only!');
    }
    var root = dataView.root;
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var as = options.as;
    if (!util_1.isArray(as) || as.length !== 3) {
        throw new TypeError('Invalid as: it must be an array with 3 strings (e.g. [ "x", "y", "r" ])!');
    }
    var field;
    try {
        field = option_parser_1.getField(options);
    }
    catch (e) {
        console.warn(e);
    }
    if (field) {
        root.sum(function (d) { return d[field]; }).sort(function (a, b) { return b[field] - a[field]; });
    }
    var packLayout = d3Hierarchy.pack();
    packLayout.size(options.size);
    if (options.padding) {
        packLayout.padding(options.padding);
    }
    packLayout(root);
    var x = as[0];
    var y = as[1];
    var r = as[2];
    root.each(function (node) {
        node[x] = node.x;
        node[y] = node.y;
        node[r] = node.r;
    });
}
data_set_1.DataSet.registerTransform('hierarchy.pack', transform);
data_set_1.DataSet.registerTransform('hierarchy.circle-packing', transform);
data_set_1.DataSet.registerTransform('circle-packing', transform);
