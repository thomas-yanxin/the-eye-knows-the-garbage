"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var simpleStatistics = tslib_1.__importStar(require("simple-statistics"));
var partition_1 = tslib_1.__importDefault(require("../util/partition"));
var data_set_1 = require("../data-set");
var registerTransform = data_set_1.DataSet.registerTransform;
var option_parser_1 = require("../util/option-parser");
var DEFAULT_OPTIONS = {
    as: [],
    fields: [],
    groupBy: [],
    operations: [],
};
var DEFAULT_OPERATION = 'count';
var aggregates = {
    count: function (data) {
        return data.length;
    },
    distinct: function (data, field) {
        var values = util_1.uniq(data.map(function (row) { return row[field]; }));
        return values.length;
    },
};
data_set_1.DataSet.CONSTANTS.STATISTICS_METHODS.forEach(function (method) {
    aggregates[method] = function (data, field) {
        var values = data.map(function (row) { return row[field]; });
        if (util_1.isArray(values) && util_1.isArray(values[0])) {
            values = util_1.flattenDeep(values);
        }
        // @ts-ignore
        return simpleStatistics[method](values);
    };
});
aggregates.average = aggregates.mean;
function transform(dataView, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var fields = option_parser_1.getFields(options);
    if (!util_1.isArray(fields)) {
        throw new TypeError('Invalid fields: it must be an array with one or more strings!');
    }
    var outputNames = options.as || [];
    if (util_1.isString(outputNames)) {
        outputNames = [outputNames];
    }
    var operations = options.operations;
    if (util_1.isString(operations)) {
        operations = [operations];
    }
    var DEFAULT_OPERATIONS = [DEFAULT_OPERATION];
    if (!util_1.isArray(operations) || !operations.length) {
        console.warn('operations is not defined, will use [ "count" ] directly.');
        operations = DEFAULT_OPERATIONS;
        outputNames = operations;
    }
    if (!(operations.length === 1 && operations[0] === DEFAULT_OPERATION)) {
        if (operations.length !== fields.length) {
            throw new TypeError("Invalid operations: it's length must be the same as fields!");
        }
        if (outputNames.length !== fields.length) {
            throw new TypeError("Invalid as: it's length must be the same as fields!");
        }
    }
    var groups = partition_1.default(dataView.rows, options.groupBy);
    var results = [];
    util_1.forIn(groups, function (group) {
        var result = group[0];
        operations.forEach(function (operation, i) {
            var outputName = outputNames[i];
            var field = fields[i];
            result[outputName] = aggregates[operation](group, field);
        });
        results.push(result);
    });
    dataView.rows = results;
}
registerTransform('aggregate', transform);
registerTransform('summary', transform);
exports.default = {
    VALID_AGGREGATES: util_1.keys(aggregates),
};
