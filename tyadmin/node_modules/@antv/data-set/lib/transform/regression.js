"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var regression_1 = tslib_1.__importDefault(require("regression"));
var util_1 = require("@antv/util");
var get_series_values_1 = tslib_1.__importDefault(require("../util/get-series-values"));
var data_set_1 = require("../data-set");
var option_parser_1 = require("../util/option-parser");
var bandwidth_1 = require("../util/bandwidth");
var DEFAULT_OPTIONS = {
    as: ['x', 'y'],
    // fields: [ 'x', 'y' ], // required two fields
    method: 'linear',
    // extent: [], // extent to execute regression function, default: [ min(x), max(x) ]
    // bandwidth: 1, // bandWidth to execute regression function
    order: 2,
    precision: 2,
};
var REGRESSION_METHODS = ['linear', 'exponential', 'logarithmic', 'power', 'polynomial'];
function transform(dataView, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var fields = option_parser_1.getFields(options);
    if (!util_1.isArray(fields) || fields.length !== 2) {
        throw new TypeError('invalid fields: must be an array of 2 strings.');
    }
    var _a = tslib_1.__read(fields, 2), xField = _a[0], yField = _a[1];
    var method = options.method;
    if (REGRESSION_METHODS.indexOf(method) === -1) {
        throw new TypeError("invalid method: " + method + ". Must be one of " + REGRESSION_METHODS.join(', '));
    }
    var points = dataView.rows.map(function (row) { return [row[xField], row[yField]]; });
    var regressionResult = regression_1.default[method](points, options);
    var extent = options.extent;
    if (!util_1.isArray(extent) || extent.length !== 2) {
        extent = dataView.range(xField);
    }
    var bandwidth = options.bandwidth;
    if (!util_1.isNumber(bandwidth) || bandwidth <= 0) {
        bandwidth = bandwidth_1.silverman(dataView.getColumn(xField));
    }
    var valuesToPredict = get_series_values_1.default(extent, bandwidth);
    var result = [];
    var _b = tslib_1.__read(options.as, 2), asX = _b[0], asY = _b[1];
    valuesToPredict.forEach(function (value) {
        var row = {};
        var _a = tslib_1.__read(regressionResult.predict(value), 2), x = _a[0], y = _a[1];
        row[asX] = x;
        row[asY] = y;
        if (isFinite(y)) {
            result.push(row);
        }
    });
    dataView.rows = result;
}
data_set_1.DataSet.registerTransform('regression', transform);
exports.default = {
    REGRESSION_METHODS: REGRESSION_METHODS,
};
