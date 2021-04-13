"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_set_1 = require("../data-set");
function defaultCallback(row) {
    return row;
}
data_set_1.DataSet.registerTransform('map', function (dataView, options) {
    dataView.rows = dataView.rows.map(options.callback || defaultCallback);
});
