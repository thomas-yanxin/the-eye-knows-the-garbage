"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var data_set_1 = require("../data-set");
function transform(dataView, options) {
    var map = options.map || {};
    var cleanMap = {};
    if (util_1.isPlainObject(map)) {
        util_1.forIn(map, function (value, key) {
            if (util_1.isString(value) && util_1.isString(key)) {
                cleanMap[key] = value;
            }
        });
    }
    dataView.rows.forEach(function (row) {
        util_1.forIn(cleanMap, function (newKey, key) {
            var temp = row[key];
            delete row[key];
            row[newKey] = temp;
        });
    });
}
data_set_1.DataSet.registerTransform('rename', transform);
data_set_1.DataSet.registerTransform('rename-fields', transform);
