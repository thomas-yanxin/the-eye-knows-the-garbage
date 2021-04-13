"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var data_set_1 = require("../../data-set");
var registerTransform = data_set_1.DataSet.registerTransform;
var option_parser_1 = require("../../util/option-parser");
var DEFAULT_OPTIONS = {
    as: ['x', 'y', 'count'],
    bins: [30, 30],
    offset: [0, 0],
    sizeByCount: false,
};
function nearestBin(value, scale, offset) {
    var temp = value - offset;
    var div = Math.floor(temp / scale);
    return [div * scale + offset, (div + 1) * scale + offset];
}
function transform(dataView, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var _a = tslib_1.__read(option_parser_1.getFields(options), 2), fieldX = _a[0], fieldY = _a[1];
    if (!fieldX || !fieldY) {
        throw new TypeError('Invalid fields: must be an array with 2 strings!');
    }
    var rangeFieldX = dataView.range(fieldX);
    var rangeFieldY = dataView.range(fieldY);
    var widthX = rangeFieldX[1] - rangeFieldX[0];
    var widthY = rangeFieldY[1] - rangeFieldY[0];
    var binWidth = options.binWidth || [];
    if (binWidth.length !== 2) {
        var _b = tslib_1.__read(options.bins, 2), binsX = _b[0], binsY = _b[1];
        if (binsX <= 0 || binsY <= 0) {
            throw new TypeError('Invalid bins: must be an array with 2 positive numbers (e.g. [ 30, 30 ])!');
        }
        binWidth = [widthX / binsX, widthY / binsY];
    }
    var points = dataView.rows.map(function (row) { return [row[fieldX], row[fieldY]]; });
    var bins = {};
    var _c = tslib_1.__read(options.offset, 2), offsetX = _c[0], offsetY = _c[1];
    points.forEach(function (point) {
        var _a = tslib_1.__read(nearestBin(point[0], binWidth[0], offsetX), 2), x0 = _a[0], x1 = _a[1];
        var _b = tslib_1.__read(nearestBin(point[1], binWidth[1], offsetY), 2), y0 = _b[0], y1 = _b[1];
        var binKey = x0 + "-" + x1 + "-" + y0 + "-" + y1;
        bins[binKey] = bins[binKey] || {
            x0: x0,
            x1: x1,
            y0: y0,
            y1: y1,
            count: 0,
        };
        bins[binKey].count++;
    });
    var rows = [];
    var _d = tslib_1.__read(options.as, 3), asX = _d[0], asY = _d[1], asCount = _d[2];
    if (!asX || !asY || !asCount) {
        throw new TypeError('Invalid as: it must be an array with 3 strings (e.g. [ "x", "y", "count" ])!');
    }
    /* points
     * 3---2
     * |   |
     * 0---1
     */
    if (!options.sizeByCount) {
        util_1.forIn(bins, function (bin) {
            var row = {};
            row[asX] = [bin.x0, bin.x1, bin.x1, bin.x0];
            row[asY] = [bin.y0, bin.y0, bin.y1, bin.y1];
            row[asCount] = bin.count;
            rows.push(row);
        });
    }
    else {
        var maxCount_1 = 0;
        util_1.forIn(bins, function (bin) {
            if (bin.count > maxCount_1) {
                maxCount_1 = bin.count;
            }
        });
        util_1.forIn(bins, function (bin) {
            var x0 = bin.x0, x1 = bin.x1, y0 = bin.y0, y1 = bin.y1, count = bin.count;
            var scale = count / maxCount_1;
            var _a = tslib_1.__read([(x0 + x1) / 2, (y0 + y1) / 2], 2), cx = _a[0], cy = _a[1];
            var rx = ((x1 - x0) * scale) / 2;
            var ry = ((y1 - y0) * scale) / 2;
            var x01 = cx - rx;
            var x11 = cx + rx;
            var y01 = cy - ry;
            var y11 = cy + ry;
            var row = {};
            row[asX] = [x01, x11, x11, x01];
            row[asY] = [y01, y01, y11, y11];
            row[asCount] = count;
            rows.push(row);
        });
    }
    dataView.rows = rows;
}
registerTransform('bin.rectangle', transform);
registerTransform('bin.rect', transform);
