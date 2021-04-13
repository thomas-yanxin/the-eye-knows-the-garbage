"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var partition_1 = tslib_1.__importDefault(require("../../util/partition"));
var data_set_1 = require("../../data-set");
var option_parser_1 = require("../../util/option-parser");
var DEFAULT_OPTIONS = {
    as: ['x', 'count'],
    bins: 30,
    offset: 0,
    groupBy: [],
};
function nearestBin(value, scale, offset) {
    var temp = value - offset;
    var div = Math.floor(temp / scale);
    return [div * scale + offset, (div + 1) * scale + offset];
}
function transform(dataView, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var field = option_parser_1.getField(options);
    if (dataView.rows.length === 0) {
        return;
    }
    var range = dataView.range(field);
    var width = range[1] - range[0];
    var binWidth = options.binWidth;
    if (!binWidth) {
        var bins = options.bins;
        if (bins <= 0) {
            throw new TypeError('Invalid bins: it must be a positive number!');
        }
        binWidth = width / bins;
    }
    var offset = options.offset % binWidth;
    // grouping
    var rows = [];
    var groupBy = options.groupBy;
    var groups = partition_1.default(dataView.rows, groupBy);
    util_1.forIn(groups, function (group) {
        var bins = {};
        var column = group.map(function (row) { return row[field]; });
        column.forEach(function (value) {
            var _a = tslib_1.__read(nearestBin(value, binWidth, offset), 2), x0 = _a[0], x1 = _a[1];
            var binKey = x0 + "-" + x1;
            bins[binKey] = bins[binKey] || {
                x0: x0,
                x1: x1,
                count: 0,
            };
            bins[binKey].count++;
        });
        var _a = tslib_1.__read(options.as, 2), asX = _a[0], asCount = _a[1];
        if (!asX || !asCount) {
            throw new TypeError('Invalid as: it must be an array with 2 elements (e.g. [ "x", "count" ])!');
        }
        var meta = util_1.pick(group[0], groupBy);
        util_1.forIn(bins, function (bin) {
            var row = util_1.assign({}, meta);
            row[asX] = [bin.x0, bin.x1];
            row[asCount] = bin.count;
            rows.push(row);
        });
    });
    dataView.rows = rows;
}
data_set_1.DataSet.registerTransform('bin.histogram', transform);
data_set_1.DataSet.registerTransform('bin.dot', transform);
