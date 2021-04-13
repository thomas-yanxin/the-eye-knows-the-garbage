"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var data_set_1 = require("../../data-set");
var option_parser_1 = require("../../util/option-parser");
var DEFAULT_OPTIONS = {
    as: ['x', 'y', 'count'],
    bins: [30, 30],
    offset: [0, 0],
    sizeByCount: false,
};
var SQRT3 = Math.sqrt(3);
var THIRD_PI = Math.PI / 3;
var ANGLES = [0, THIRD_PI, 2 * THIRD_PI, 3 * THIRD_PI, 4 * THIRD_PI, 5 * THIRD_PI];
function distance(x0, y0, x1, y1) {
    return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
}
function nearestBinsCenters(value, scale, offset) {
    var temp = value - offset;
    scale = scale / 2;
    var div = Math.floor(temp / scale);
    var rounded = scale * (div + (Math.abs(div % 2) === 1 ? 1 : 0));
    var roundedScaled = scale * (div + (Math.abs(div % 2) === 1 ? 0 : 1));
    return [rounded + offset, roundedScaled + offset];
}
function generateBins(points, binWidth, offset) {
    if (binWidth === void 0) { binWidth = [1, 1]; }
    if (offset === void 0) { offset = [0, 0]; }
    // processing aligned data
    var bins = {};
    var _a = tslib_1.__read(binWidth, 2), binWidthX = _a[0], binWidthY = _a[1];
    var _b = tslib_1.__read(offset, 2), offsetX = _b[0], offsetY = _b[1];
    points.forEach(function (point) {
        var _a, _b;
        var _c = tslib_1.__read(point, 2), x = _c[0], y = _c[1];
        // step3.1: nearest two centers
        var _d = tslib_1.__read(nearestBinsCenters(x, binWidthX, offsetX), 2), xRounded = _d[0], xRoundedScaled = _d[1];
        var _e = tslib_1.__read(nearestBinsCenters(y, binWidthY, offsetY), 2), yRounded = _e[0], yRoundedScaled = _e[1];
        // step3.2: compare distances
        var d1 = distance(x, y, xRounded, yRounded);
        var d2 = distance(x, y, xRoundedScaled, yRoundedScaled);
        var binKey;
        var binX;
        var binY;
        if (d1 < d2) {
            binKey = "x" + xRounded + "y" + yRounded;
            _a = tslib_1.__read([xRounded, yRounded], 2), binX = _a[0], binY = _a[1];
        }
        else {
            binKey = "x" + xRoundedScaled + "y" + yRoundedScaled;
            _b = tslib_1.__read([xRoundedScaled, yRoundedScaled], 2), binX = _b[0], binY = _b[1];
        }
        bins[binKey] = bins[binKey] || {
            x: binX,
            y: binY,
            count: 0,
        };
        bins[binKey].count++;
    });
    return bins;
}
function transform(dataView, options) {
    // step1: get binWidth, etc.
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var fields = option_parser_1.getFields(options);
    if (!util_1.isArray(fields) || fields.length !== 2) {
        throw new TypeError('Invalid fields: it must be an array with 2 strings!');
    }
    var _a = tslib_1.__read(fields, 2), fieldX = _a[0], fieldY = _a[1];
    var rangeFieldX = dataView.range(fieldX);
    var rangeFieldY = dataView.range(fieldY);
    var widthX = rangeFieldX[1] - rangeFieldX[0];
    var widthY = rangeFieldY[1] - rangeFieldY[0];
    var binWidth = options.binWidth || [];
    if (binWidth.length !== 2) {
        var _b = tslib_1.__read(options.bins, 2), binsX = _b[0], binsY = _b[1];
        if (binsX <= 0 || binsY <= 0) {
            throw new TypeError('Invalid bins: must be an array with two positive numbers (e.g. [ 30, 30 ])!');
        }
        binWidth = [widthX / binsX, widthY / binsY];
    }
    // step2: align scale (squash Y)
    /*
     * binWidthX / binWidthY should be Math.sqrt3 / 1.5
     * -: binWidthX |: binWidthY
     *           3
     *           |
     *   4       |        2
     *           |
     *           |
     *   5----------------1
     *
     *           0
     */
    var _c = tslib_1.__read(options.offset, 2), offsetX = _c[0], offsetY = _c[1];
    var yScale = (3 * binWidth[0]) / (SQRT3 * binWidth[1]);
    // const yScale = binWidth[0] / (SQRT3 * binWidth[1]);
    var points = dataView.rows.map(function (row) { return [row[fieldX], yScale * row[fieldY]]; });
    // step3: binning
    var bins = generateBins(points, [binWidth[0], yScale * binWidth[1]], [offsetX, yScale * offsetY]);
    // step4: restore scale (for Y)
    var _d = tslib_1.__read(options.as, 3), asX = _d[0], asY = _d[1], asCount = _d[2];
    if (!asX || !asY || !asCount) {
        throw new TypeError('Invalid as: it must be an array with three elements (e.g. [ "x", "y", "count" ])!');
    }
    var radius = binWidth[0] / SQRT3;
    var hexagonPoints = ANGLES.map(function (angle) { return [Math.sin(angle) * radius, -Math.cos(angle) * radius]; });
    var result = [];
    var maxCount = 0;
    if (options.sizeByCount) {
        util_1.forIn(bins, function (bin) {
            if (bin.count > maxCount) {
                maxCount = bin.count;
            }
        });
    }
    util_1.forIn(bins, function (bin) {
        var x = bin.x, y = bin.y, count = bin.count;
        var row = {};
        row[asCount] = count;
        if (options.sizeByCount) {
            row[asX] = hexagonPoints.map(function (p) { return x + (bin.count / maxCount) * p[0]; });
            row[asY] = hexagonPoints.map(function (p) { return (y + (bin.count / maxCount) * p[1]) / yScale; });
        }
        else {
            row[asX] = hexagonPoints.map(function (p) { return x + p[0]; });
            row[asY] = hexagonPoints.map(function (p) { return (y + p[1]) / yScale; });
        }
        result.push(row);
    });
    dataView.rows = result;
}
data_set_1.DataSet.registerTransform('bin.hexagon', transform);
data_set_1.DataSet.registerTransform('bin.hex', transform);
data_set_1.DataSet.registerTransform('hexbin', transform);
