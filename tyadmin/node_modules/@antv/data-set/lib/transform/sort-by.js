"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var data_set_1 = require("../data-set");
var option_parser_1 = require("../util/option-parser");
/*
 * options: {
 *   type: 'sort-by',
 *   fields: [],
 *   order: 'ASC' // 'DESC'
 * }
 */
var VALID_ORDERS = ['ASC', 'DESC'];
function transform(dataView, options) {
    var fields = option_parser_1.getFields(options, [dataView.getColumnName(0)]);
    if (!util_1.isArray(fields)) {
        throw new TypeError('Invalid fields: must be an array with strings!');
    }
    dataView.rows = util_1.sortBy(dataView.rows, fields);
    var order = options.order;
    if (order && VALID_ORDERS.indexOf(order) === -1) {
        throw new TypeError("Invalid order: " + order + " must be one of " + VALID_ORDERS.join(', '));
    }
    else if (order === 'DESC') {
        dataView.rows.reverse();
    }
}
data_set_1.DataSet.registerTransform('sort-by', transform);
data_set_1.DataSet.registerTransform('sortBy', transform);
