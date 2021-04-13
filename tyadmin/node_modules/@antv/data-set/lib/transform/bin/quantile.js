"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var simple_statistics_1 = require("simple-statistics");
var partition_1 = tslib_1.__importDefault(require("../../util/partition"));
var p_by_fraction_1 = tslib_1.__importDefault(require("../../util/p-by-fraction"));
var data_set_1 = require("../../data-set");
var registerTransform = data_set_1.DataSet.registerTransform;
var option_parser_1 = require("../../util/option-parser");
var DEFAULT_OPTIONS = {
    as: '_bin',
    groupBy: [],
    fraction: 4,
};
function transform(dataView, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var field = option_parser_1.getField(options);
    var as = options.as;
    if (!util_1.isString(as)) {
        throw new TypeError('Invalid as: it must be a string (e.g. "_bin")!');
    }
    var pArray = options.p;
    var fraction = options.fraction;
    if (!util_1.isArray(pArray) || pArray.length === 0) {
        pArray = p_by_fraction_1.default(fraction);
    }
    var rows = dataView.rows;
    var groupBy = options.groupBy;
    var groups = partition_1.default(rows, groupBy);
    var result = [];
    util_1.forIn(groups, function (group) {
        // const resultRow = pick(group[0], groupBy);
        var resultRow = group[0];
        var binningColumn = group.map(function (row) { return row[field]; });
        var quantiles = pArray.map(function (p) { return simple_statistics_1.quantile(binningColumn, p); });
        resultRow[as] = quantiles;
        result.push(resultRow);
    });
    dataView.rows = result;
}
registerTransform('bin.quantile', transform);
