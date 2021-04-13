"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var partition_1 = tslib_1.__importDefault(require("../util/partition"));
var data_set_1 = require("../data-set");
var DEFAULT_OPTIONS = {
    groupBy: [],
    orderBy: [],
};
data_set_1.DataSet.registerTransform('partition', function (dataView, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    // TODO: rows 是否都只能是数组
    // @ts-ignore;
    dataView.rows = partition_1.default(dataView.rows, options.groupBy, options.orderBy);
});
function group(dataView, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    dataView.rows = util_1.values(partition_1.default(dataView.rows, options.groupBy, options.orderBy));
}
data_set_1.DataSet.registerTransform('group', group);
data_set_1.DataSet.registerTransform('groups', group);
