"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var hierarchy_1 = tslib_1.__importDefault(require("@antv/hierarchy"));
var data_set_1 = require("../../data-set");
var DEFAULT_OPTIONS = {};
function transform(dataView, options) {
    var root = dataView.root;
    options = Object.assign({}, DEFAULT_OPTIONS, options);
    if (dataView.dataType !== data_set_1.DataSet.CONSTANTS.HIERARCHY) {
        throw new TypeError('Invalid DataView: This transform is for Hierarchy data only!');
    }
    dataView.root = hierarchy_1.default.indented(root, options);
}
data_set_1.DataSet.registerTransform('hierarchy.indented', transform);
data_set_1.DataSet.registerTransform('indented-tree', transform);
