"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var d3_dsv_1 = require("d3-dsv");
var data_set_1 = require("../data-set");
data_set_1.DataSet.registerConnector('dsv', function (str, options) {
    if (options === void 0) { options = {}; }
    var delimiter = options.delimiter || ',';
    if (!util_1.isString(delimiter)) {
        throw new TypeError('Invalid delimiter: must be a string!');
    }
    return d3_dsv_1.dsvFormat(delimiter).parse(str);
});
data_set_1.DataSet.registerConnector('csv', function (str) {
    return d3_dsv_1.csvParse(str);
});
data_set_1.DataSet.registerConnector('tsv', function (str) {
    return d3_dsv_1.tsvParse(str);
});
