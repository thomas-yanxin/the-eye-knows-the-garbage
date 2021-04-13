"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/*
 * @reference: https://github.com/Planeshifter/kernel-smooth/blob/master/lib/index.js
 */
var util_1 = require("@antv/util");
var get_series_values_1 = tslib_1.__importDefault(require("../../util/get-series-values"));
var kernel_1 = tslib_1.__importDefault(require("../../util/kernel"));
var data_set_1 = require("../../data-set");
var simple_statistics_1 = require("simple-statistics");
var option_parser_1 = require("../../util/option-parser");
var bandwidth_1 = require("../../util/bandwidth");
var DEFAULT_OPTIONS = {
    as: ['x', 'y'],
    // fields: [ 'x', 'y' ], // required, one or two fields
    method: 'gaussian',
};
var KERNEL_METHODS = util_1.keys(kernel_1.default);
// calculates weight for i-th obs
function weight(kernel, bandwidth, x_0, x_i) {
    var arg = (x_i - x_0) / bandwidth;
    return kernel(arg);
}
// calculates weight for i-th obs when p > 1
// function weight_vectors(kernel, bandwidth, x_0, x_i) {
//   const arg = enclideanDistance(x_i, x_0) / bandwidth;
//   return kernel(arg);
// }
function vectorize(fun) {
    return function (x) {
        if (!util_1.isArray(x)) {
            return fun(x);
        }
        return x.map(function (x) {
            return fun(x);
        });
    };
}
function transform(dv, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var fields = option_parser_1.getFields(options);
    if (!util_1.isArray(fields) || !(fields.length === 1 || fields.length === 2)) {
        throw new TypeError('invalid fields: must be an array of 1 or 2 strings!');
    }
    var _a = tslib_1.__read(options.as, 2), asX = _a[0], asY = _a[1];
    if (!util_1.isString(asX) || !util_1.isString(asY)) {
        throw new TypeError('invalid as: must be an array of 2 strings!');
    }
    var func;
    var method = options.method;
    if (util_1.isString(method)) {
        if (KERNEL_METHODS.indexOf(method) === -1) {
            throw new TypeError("invalid method: " + method + ". Must be one of " + KERNEL_METHODS.join(', '));
        }
        func = kernel_1.default[method];
    }
    var _b = tslib_1.__read(fields, 2), xField = _b[0], yField = _b[1];
    var xs = dv.getColumn(xField);
    var extent = options.extent;
    if (extent || !util_1.isArray(extent)) {
        extent = dv.range(xField);
    }
    var bandwidth = options.bandwidth;
    if (!bandwidth || !util_1.isNumber(bandwidth) || bandwidth <= 0) {
        bandwidth = bandwidth_1.silverman(xs);
    }
    var seriesValues = get_series_values_1.default(extent, bandwidth);
    var xCount = xs.length;
    var weightFunc = weight.bind(null, func, bandwidth);
    var kernelSmoother;
    if (util_1.isNil(yField)) {
        // KDE
        kernelSmoother = vectorize(function (x) {
            var weights = xs.map(function (x_i) { return weightFunc(x, x_i); });
            var num = simple_statistics_1.sum(weights);
            var denom = xCount * bandwidth;
            if (!num || !denom)
                return 0;
            return num / denom;
        });
    }
    else {
        // kernel regression smoothing
        var ys_1 = dv.getColumn(yField);
        kernelSmoother = vectorize(function (x) {
            var weights = xs.map(function (x_i) { return weightFunc(x, x_i); });
            var num = simple_statistics_1.sum(weights.map(function (w, i) { return w * ys_1[i]; }));
            var denom = simple_statistics_1.sum(weights);
            if (!num || !denom)
                return 0;
            return num / denom;
        });
    }
    var result = seriesValues.map(function (x) {
        var row = {};
        row[asX] = x;
        row[asY] = kernelSmoother(x);
        return row;
    });
    dv.rows = result;
}
data_set_1.DataSet.registerTransform('kernel-smooth.regression', transform);
data_set_1.DataSet.registerTransform('kernel.regression', transform);
exports.default = {
    KERNEL_METHODS: KERNEL_METHODS,
};
