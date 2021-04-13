"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/*
 * kernel density estimation
 */
var util_1 = require("@antv/util");
var get_series_values_1 = tslib_1.__importDefault(require("../util/get-series-values"));
var kernel_1 = tslib_1.__importDefault(require("../util/kernel"));
var bandwidth = tslib_1.__importStar(require("../util/bandwidth"));
var partition_1 = tslib_1.__importDefault(require("../util/partition"));
var data_set_1 = require("../data-set");
var option_parser_1 = require("../util/option-parser");
var simple_statistics_1 = require("simple-statistics");
var DEFAULT_OPTIONS = {
    minSize: 0.01,
    as: ['key', 'y', 'size'],
    // fields: [ 'y1', 'y2' ], // required, one or more fields
    extent: [],
    method: 'gaussian',
    bandwidth: 'nrd',
    step: 0,
    groupBy: [],
};
var KERNEL_METHODS = util_1.keys(kernel_1.default);
var BANDWIDTH_METHODS = util_1.keys(bandwidth);
function transform(dv, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var fields = option_parser_1.getFields(options);
    if (!util_1.isArray(fields) || fields.length < 1) {
        throw new TypeError('invalid fields: must be an array of at least 1 strings!');
    }
    var as = options.as;
    if (!util_1.isArray(as) || as.length !== 3) {
        throw new TypeError('invalid as: must be an array of 3 strings!');
    }
    var method = options.method;
    if (util_1.isString(method)) {
        if (KERNEL_METHODS.indexOf(method) === -1) {
            throw new TypeError("invalid method: " + method + ". Must be one of " + KERNEL_METHODS.join(', '));
        }
        method = kernel_1.default[method];
    }
    if (!util_1.isFunction(method)) {
        throw new TypeError('invalid method: kernel method must be a function!');
    }
    var extent = options.extent;
    if (!util_1.isArray(extent) || extent.length === 0) {
        var rangeArr_1 = [];
        util_1.each(fields, function (field) {
            var range = dv.range(field);
            rangeArr_1 = rangeArr_1.concat(range);
        });
        extent = [Math.min.apply(Math, tslib_1.__spread(rangeArr_1)), Math.max.apply(Math, tslib_1.__spread(rangeArr_1))];
    }
    var bw = options.bandwidth;
    if (util_1.isString(bw) && bandwidth[bw]) {
        bw = bandwidth[bw](dv.getColumn(fields[0]));
    }
    else if (util_1.isFunction(bw)) {
        bw = bw(dv.getColumn(fields[0]));
    }
    else if (!util_1.isNumber(bw) || bw <= 0) {
        bw = bandwidth.nrd(dv.getColumn(fields[0]));
    }
    var seriesValues = get_series_values_1.default(extent, options.step ? options.step : bw);
    var result = [];
    var groupBy = options.groupBy;
    var groups = partition_1.default(dv.rows, groupBy);
    util_1.forIn(groups, function (group) {
        var probalityDensityFunctionByField = {};
        util_1.each(fields, function (field) {
            var row = util_1.pick(group[0], groupBy);
            probalityDensityFunctionByField[field] = simple_statistics_1.kernelDensityEstimation(group.map(function (item) { return item[field]; }), method, bw);
            var _a = tslib_1.__read(as, 3), key = _a[0], y = _a[1], size = _a[2];
            row[key] = field;
            row[y] = [];
            row[size] = [];
            util_1.each(seriesValues, function (yValue) {
                var sizeValue = probalityDensityFunctionByField[field](yValue);
                if (sizeValue >= options.minSize) {
                    row[y].push(yValue);
                    row[size].push(sizeValue);
                }
            });
            result.push(row);
        });
    });
    dv.rows = result;
}
data_set_1.DataSet.registerTransform('kernel-density-estimation', transform);
data_set_1.DataSet.registerTransform('kde', transform);
data_set_1.DataSet.registerTransform('KDE', transform);
exports.default = {
    KERNEL_METHODS: KERNEL_METHODS,
    BANDWIDTH_METHODS: BANDWIDTH_METHODS,
};
