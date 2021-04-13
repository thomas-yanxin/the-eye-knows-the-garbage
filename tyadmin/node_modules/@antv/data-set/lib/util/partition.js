"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var simple_sort_by_1 = tslib_1.__importDefault(require("./simple-sort-by"));
exports.default = (function (rows, group_by, order_by) {
    if (order_by === void 0) { order_by = []; }
    var newRows = rows;
    if (order_by && order_by.length) {
        newRows = simple_sort_by_1.default(rows, order_by);
    }
    var groupingFn;
    if (util_1.isFunction(group_by)) {
        groupingFn = group_by;
    }
    else if (util_1.isArray(group_by)) {
        groupingFn = function (row) { return "_" + group_by.map(function (col) { return row[col]; }).join('-'); };
        // NOTE: Object.keys({'b': 'b', '2': '2', '1': '1', 'a': 'a'}) => [ '1', '2', 'b', 'a' ]
        // that is why we have to add a prefix
    }
    else if (util_1.isString(group_by)) {
        groupingFn = function (row) { return "_" + row[group_by]; };
    }
    var groups = util_1.groupBy(newRows, groupingFn);
    return groups;
});
