"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var partition_1 = tslib_1.__importDefault(require("../util/partition"));
var data_set_1 = require("../data-set");
var DEFAULT_OPTIONS = {
    fillBy: 'group',
    groupBy: [],
    orderBy: [],
};
function arrayDifference(arr1, arr2) {
    // arrayDifference([1, 1, 1, 2], [1, 2]) => [1, 1]
    var shadow = arr1.map(function (item) { return item; }); // shadow copy
    arr2.forEach(function (item) {
        var index = shadow.indexOf(item);
        if (index > -1) {
            shadow.splice(index, 1);
        }
    });
    return shadow;
}
function transform(dataView, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var rows = dataView.rows;
    var groupBy = options.groupBy;
    var orderBy = options.orderBy;
    var groups = partition_1.default(rows, groupBy, orderBy);
    var maxLength = 0;
    var referenceGroup = [];
    util_1.forIn(groups, function (group) {
        if (group.length > maxLength) {
            maxLength = group.length;
            referenceGroup = group;
        }
    });
    var referenceOrderByKeys = [];
    var referenceRowByOrderByKey = {};
    referenceGroup.forEach(function (row) {
        var key = orderBy.map(function (col) { return row[col]; }).join('-');
        referenceOrderByKeys.push(key);
        referenceRowByOrderByKey[key] = row;
    });
    if (options.fillBy === 'order') {
        var first_1 = referenceGroup[0];
        var allOrderByKeys_1 = [];
        var rowByOrderByKey_1 = {};
        rows.forEach(function (row) {
            var key = orderBy.map(function (col) { return row[col]; }).join('-');
            if (allOrderByKeys_1.indexOf(key) === -1) {
                allOrderByKeys_1.push(key);
                rowByOrderByKey_1[key] = row;
            }
        });
        var _missingOrderByKeys = arrayDifference(allOrderByKeys_1, referenceOrderByKeys);
        _missingOrderByKeys.forEach(function (key) {
            var row = {};
            groupBy.forEach(function (col) {
                row[col] = first_1[col];
            });
            orderBy.forEach(function (col) {
                row[col] = rowByOrderByKey_1[key][col];
            });
            rows.push(row);
            referenceGroup.push(row);
            referenceOrderByKeys.push(key);
            referenceRowByOrderByKey[key] = row;
        });
        maxLength = referenceGroup.length;
    }
    util_1.forIn(groups, function (group) {
        if (group !== referenceGroup && group.length < maxLength) {
            var first_2 = group[0];
            // missing orderBy keys
            var orderByKeys_1 = [];
            group.forEach(function (row) {
                orderByKeys_1.push(orderBy.map(function (col) { return row[col]; }).join('-'));
            });
            var missingOrderByKeys = arrayDifference(referenceOrderByKeys, orderByKeys_1);
            missingOrderByKeys.some(function (key, i) {
                if (i >= maxLength - group.length) {
                    // group length overflow
                    return true;
                }
                var referenceRow = referenceRowByOrderByKey[key];
                var row = {};
                groupBy.forEach(function (col) {
                    row[col] = first_2[col];
                });
                orderBy.forEach(function (col) {
                    row[col] = referenceRow[col];
                });
                rows.push(row);
                return false;
            });
        }
    });
}
data_set_1.DataSet.registerTransform('fill-rows', transform);
data_set_1.DataSet.registerTransform('fillRows', transform);
