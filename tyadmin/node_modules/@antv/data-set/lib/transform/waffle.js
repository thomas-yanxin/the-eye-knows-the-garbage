"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var simple_statistics_1 = require("simple-statistics");
var partition_1 = tslib_1.__importDefault(require("../util/partition"));
var data_set_1 = require("../data-set");
var option_parser_1 = require("../util/option-parser");
var DEFAULT_OPTIONS = {
    fields: ['name', 'value'],
    rows: 5,
    size: [1, 1],
    scale: 1,
    groupBy: [],
    maxCount: 1000,
    gapRatio: 0.1,
    as: ['x', 'y'],
};
function transform(dataView, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var fields = option_parser_1.getFields(options);
    var _a = tslib_1.__read(fields, 2), nameField = _a[0], valueField = _a[1];
    var _b = tslib_1.__read(options.as, 2), asX = _b[0], asY = _b[1];
    var groupBy = options.groupBy;
    var groups = partition_1.default(dataView.rows, groupBy);
    var groupKeys = util_1.keys(groups);
    var _c = tslib_1.__read(options.size, 2), width = _c[0], height = _c[1];
    var maxCount = options.maxCount;
    var groupCount = groupKeys.length;
    var partHeight = height / groupCount;
    var rows = options.rows;
    var gapRatio = options.gapRatio;
    var result = [];
    var scale = options.scale;
    var currentGroupIndex = 0;
    var wStep = 0;
    // getting suitable scale and width step
    util_1.forIn(groups, function (group) {
        var totalValue = simple_statistics_1.sum(util_1.map(group, function (row) { return row[valueField]; }));
        var cols = Math.ceil((totalValue * scale) / rows);
        if (totalValue * scale > maxCount) {
            scale = maxCount / totalValue;
            cols = Math.ceil((totalValue * scale) / rows);
        }
        wStep = width / cols;
    });
    // distributing values into grid
    util_1.forIn(groups, function (group) {
        var heightRange = [currentGroupIndex * partHeight, (currentGroupIndex + 1) * partHeight];
        var h = heightRange[1] - heightRange[0];
        var hStep = (h * (1 - gapRatio)) / rows;
        var currentCol = 0;
        var currentRow = 0;
        util_1.each(group, function (row) {
            var value = row[valueField];
            var count = Math.round(value * scale);
            for (var i = 0; i < count; i++) {
                if (currentRow === rows) {
                    currentRow = 0;
                    currentCol++;
                }
                var resultRow = util_1.pick(row, [nameField, valueField].concat(groupBy));
                resultRow[asX] = currentCol * wStep + wStep / 2;
                resultRow[asY] = currentRow * hStep + hStep / 2 + heightRange[0];
                resultRow._wStep = wStep;
                resultRow._hStep = hStep;
                currentRow++;
                result.push(resultRow);
            }
        });
        currentGroupIndex += 1;
    });
    dataView.rows = result;
}
data_set_1.DataSet.registerTransform('waffle', transform);
