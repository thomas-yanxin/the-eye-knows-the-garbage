"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_set_1 = require("../data-set");
var option_parser_1 = require("../util/option-parser");
data_set_1.DataSet.registerTransform('subset', function (dataView, options) {
    var startIndex = options.startRowIndex || 0;
    var endIndex = options.endRowIndex || dataView.rows.length - 1;
    var columns = option_parser_1.getFields(options, dataView.getColumnNames());
    dataView.rows = dataView.getSubset(startIndex, endIndex, columns);
});
