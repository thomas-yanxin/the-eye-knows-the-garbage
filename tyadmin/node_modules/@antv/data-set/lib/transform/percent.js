"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var simple_statistics_1 = require("simple-statistics");
var partition_1 = tslib_1.__importDefault(require("../util/partition"));
var data_set_1 = require("../data-set");
var option_parser_1 = require("../util/option-parser");
var DEFAULT_OPTIONS = {
    // field: 'y', // required
    // dimension: 'x', // required
    groupBy: [],
    as: '_percent',
};
function transform(dataView, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var field = option_parser_1.getField(options);
    var dimension = options.dimension, groupBy = options.groupBy;
    var as = options.as;
    if (!util_1.isString(dimension)) {
        throw new TypeError('Invalid dimension: must be a string!');
    }
    if (util_1.isArray(as)) {
        console.warn('Invalid as: must be a string, will use the first element of the array specified.');
        as = as[0];
    }
    if (!util_1.isString(as)) {
        throw new TypeError('Invalid as: must be a string!');
    }
    var rows = dataView.rows;
    var result = [];
    var groups = partition_1.default(rows, groupBy);
    util_1.forIn(groups, function (group) {
        var totalSum = simple_statistics_1.sum(group.map(function (row) { return row[field]; }));
        if (totalSum === 0) {
            console.warn("Invalid data: total sum of field " + field + " is 0!");
        }
        var innerGroups = partition_1.default(group, [dimension]);
        util_1.forIn(innerGroups, function (innerGroup) {
            var innerSum = simple_statistics_1.sum(innerGroup.map(function (row) { return row[field]; }));
            // const resultRow = pick(innerGroup[0], union(groupBy, [ dimension ]));
            var resultRow = innerGroup[0];
            // FIXME in case dimension and field is the same
            var dimensionValue = resultRow[dimension];
            resultRow[field] = innerSum;
            resultRow[dimension] = dimensionValue;
            if (totalSum === 0) {
                resultRow[as] = 0;
            }
            else {
                resultRow[as] = innerSum / totalSum;
            }
            result.push(resultRow);
        });
    });
    dataView.rows = result;
}
data_set_1.DataSet.registerTransform('percent', transform);
