"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_set_1 = require("../data-set");
data_set_1.DataSet.registerTransform('sort', function (dataView, options) {
    var columnName = dataView.getColumnName(0);
    dataView.rows.sort(options.callback || (function (a, b) { return a[columnName] - b[columnName]; }));
});
