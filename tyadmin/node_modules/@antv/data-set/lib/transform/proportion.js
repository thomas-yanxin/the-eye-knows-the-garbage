"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var partition_1 = tslib_1.__importDefault(require("../util/partition"));
var data_set_1 = require("../data-set");
var option_parser_1 = require("../util/option-parser");
var DEFAULT_OPTIONS = {
    // field: 'y', // required
    // dimension: 'x', // required
    groupBy: [],
    as: '_proportion',
};
function transform(dataView, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var field = option_parser_1.getField(options);
    var dimension = options.dimension;
    var groupBy = options.groupBy;
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
        var totalCount = group.length;
        var innerGroups = partition_1.default(group, [dimension]);
        util_1.forIn(innerGroups, function (innerGroup) {
            var innerCount = innerGroup.length;
            // const resultRow = pick(innerGroup[0], union(groupBy, [ dimension ]));
            var resultRow = innerGroup[0];
            // FIXME in case dimension and field is the same
            var dimensionValue = resultRow[dimension];
            resultRow[field] = innerCount;
            resultRow[dimension] = dimensionValue;
            resultRow[as] = innerCount / totalCount;
            result.push(resultRow);
        });
    });
    dataView.rows = result;
}
data_set_1.DataSet.registerTransform('proportion', transform);
