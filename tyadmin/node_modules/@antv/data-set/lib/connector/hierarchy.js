"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var d3_hierarchy_1 = require("d3-hierarchy");
var data_set_1 = require("../data-set");
function connector(data, options, dataView) {
    dataView.dataType = data_set_1.DataSet.CONSTANTS.HIERARCHY;
    var children = options && options.children ? options.children : null;
    if (children && !util_1.isFunction(children)) {
        throw new TypeError('Invalid children: must be a function!');
    }
    if (!options.pureData) {
        // @ts-ignore
        dataView.rows = dataView.root = d3_hierarchy_1.hierarchy(data, children);
    }
    else {
        dataView.rows = dataView.root = data;
    }
    return data;
}
data_set_1.DataSet.registerConnector('hierarchy', connector);
data_set_1.DataSet.registerConnector('tree', connector);
