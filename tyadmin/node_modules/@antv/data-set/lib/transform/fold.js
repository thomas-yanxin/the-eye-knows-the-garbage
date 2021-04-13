"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var data_set_1 = require("../data-set");
var option_parser_1 = require("../util/option-parser");
var DEFAULT_OPTIONS = {
    fields: [],
    key: 'key',
    retains: [],
    value: 'value',
};
data_set_1.DataSet.registerTransform('fold', function (dataView, options) {
    var columns = dataView.getColumnNames();
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var fields = option_parser_1.getFields(options);
    if (fields.length === 0) {
        console.warn('warning: option fields is not specified, will fold all columns.');
        fields = columns;
    }
    var key = options.key;
    var value = options.value;
    var retains = options.retains;
    if (!retains || retains.length === 0) {
        retains = util_1.difference(columns, fields);
    }
    var resultRows = [];
    dataView.rows.forEach(function (row) {
        fields.forEach(function (field) {
            var resultRow = util_1.pick(row, retains);
            resultRow[key] = field;
            resultRow[value] = row[field];
            resultRows.push(resultRow);
        });
    });
    dataView.rows = resultRows;
});
