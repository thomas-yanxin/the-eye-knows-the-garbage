"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var data_set_1 = require("../data-set");
var option_parser_1 = require("../util/option-parser");
data_set_1.DataSet.registerTransform('pick', function (dataView, options) {
    var columns = option_parser_1.getFields(options, dataView.getColumnNames());
    dataView.rows = dataView.rows.map(function (row) { return util_1.pick(row, columns); });
});
