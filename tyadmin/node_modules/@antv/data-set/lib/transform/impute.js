"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var simpleStatistics = tslib_1.__importStar(require("simple-statistics"));
var partition_1 = tslib_1.__importDefault(require("../util/partition"));
var data_set_1 = require("../data-set");
var option_parser_1 = require("../util/option-parser");
var DEFAULT_OPTIONS = {
    // field: '', // required
    // method: 'value', // required
    // value: 10, // required if (method === 'value')
    groupBy: [],
};
function notUndefinedValues(values) {
    return values.filter(function (value) { return !util_1.isUndefined(value); });
}
var STATISTICS_METHODS = ['mean', 'median', 'max', 'min'];
var imputations = {};
STATISTICS_METHODS.forEach(function (method) {
    // @ts-ignore
    imputations[method] = function (row, values) { return simpleStatistics[method](values); };
});
imputations.value = function (_row, _values, value) { return value; };
function transform(dataView, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var field = option_parser_1.getField(options);
    var method = options.method;
    if (!method) {
        throw new TypeError('Invalid method!');
    }
    if (method === 'value' && !util_1.has(options, 'value')) {
        throw new TypeError('Invalid value: it is nil.');
    }
    var column = notUndefinedValues(dataView.getColumn(field));
    var groups = partition_1.default(dataView.rows, options.groupBy);
    util_1.forIn(groups, function (group) {
        var fieldValues = notUndefinedValues(group.map(function (row) { return row[field]; }));
        if (fieldValues.length === 0) {
            fieldValues = column;
        }
        group.forEach(function (row) {
            if (util_1.isUndefined(row[field])) {
                if (util_1.isFunction(method)) {
                    row[field] = method(row, fieldValues, options.value, group);
                }
                else if (util_1.isString(method)) {
                    row[field] = imputations[method](row, fieldValues, options.value);
                }
                else {
                    throw new TypeError("Invalid method: must be a function or one of " + STATISTICS_METHODS.join(', '));
                }
            }
        });
    });
}
data_set_1.DataSet.registerTransform('impute', transform);
