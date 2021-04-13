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
var option_parser_1 = require("../../util/option-parser");
var bandwidth_1 = require("../../util/bandwidth");
var DEFAULT_OPTIONS = {
    as: ['x', 'y', 'z'],
    // fields: [ 'x', 'y' ], // required, one or two fields
    method: 'gaussian',
};
var KERNEL_METHODS = util_1.keys(kernel_1.default);
function transform(dv, options) {
    var _a, _b;
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var fields = option_parser_1.getFields(options);
    if (!util_1.isArray(fields) || fields.length !== 2) {
        throw new TypeError('invalid fields: must be an array of 2 strings!');
    }
    var _c = tslib_1.__read(options.as, 3), asX = _c[0], asY = _c[1], asZ = _c[2];
    if (!util_1.isString(asX) || !util_1.isString(asY) || !util_1.isString(asZ)) {
        throw new TypeError('invalid as: must be an array of 3 strings!');
    }
    var method;
    if (util_1.isString(options.method)) {
        if (KERNEL_METHODS.indexOf(options.method) === -1) {
            throw new TypeError("invalid method: " + options.method + ". Must be one of " + KERNEL_METHODS.join(', '));
        }
        method = kernel_1.default[options.method];
    }
    var _d = tslib_1.__read(fields, 2), xField = _d[0], yField = _d[1];
    var extent = options.extent, bandwidth = options.bandwidth;
    var extentX;
    var extentY;
    if (extent && Array.isArray(extent) && Array.isArray(extent[0]) && Array.isArray(extent[1])) {
        _a = tslib_1.__read(extent, 2), extentX = _a[0], extentY = _a[1];
    }
    else {
        extentX = dv.range(xField);
        extentY = dv.range(yField);
    }
    var bwX, bwY;
    if (bandwidth &&
        Array.isArray(bandwidth) &&
        bandwidth.slice(0, 2).every(util_1.isNumber) &&
        bandwidth.slice(0, 2).every(function (item) { return item > 0; })) {
        _b = tslib_1.__read(bandwidth, 2), bwX = _b[0], bwY = _b[1];
    }
    else {
        bwX = bandwidth_1.silverman(dv.getColumn(xField));
        bwY = bandwidth_1.silverman(dv.getColumn(yField));
    }
    var seriesValuesX = get_series_values_1.default(extentX, bwX);
    var seriesValuesY = get_series_values_1.default(extentY, bwY);
    var count = dv.rows.length;
    var result = [];
    for (var i = 0; i < seriesValuesX.length; i++) {
        for (var j = 0; j < seriesValuesY.length; j++) {
            var sum = 0;
            var x = seriesValuesX[i];
            var y = seriesValuesY[j];
            for (var k = 0; k < count; k++) {
                sum += method((x - dv.rows[k][xField]) / bwX) * method((y - dv.rows[k][yField]) / bwY);
            }
            var z = (1 / (count * bwX * bwY)) * sum;
            var row = {};
            row[asX] = x;
            row[asY] = y;
            row[asZ] = z;
            result.push(row);
        }
    }
    dv.rows = result;
}
data_set_1.DataSet.registerTransform('kernel-smooth.density', transform);
data_set_1.DataSet.registerTransform('kernel.density', transform);
exports.default = {
    KERNEL_METHODS: KERNEL_METHODS,
};
