"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var d3_hexjson_1 = require("d3-hexjson");
var data_set_1 = require("../data-set");
var DEFAULT_OPTIONS = {
    width: 1,
    height: 1,
};
function processRow(row) {
    row.cx = row.x;
    row.cy = row.y;
    row.x = [];
    row.y = [];
    row.vertices.forEach(function (v) {
        row.x.push(v.x + row.cx);
        row.y.push(v.y + row.cy);
    });
    return row;
}
function HexJSONConnector(data, options, dataView) {
    dataView.dataType = data_set_1.DataSet.CONSTANTS.HEX;
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var width = options.width, height = options.height;
    var HexJSON = util_1.deepMix([], data);
    dataView._HexJSON = HexJSON;
    var grid = (dataView._GridHexJSON = d3_hexjson_1.getGridForHexJSON(HexJSON));
    var rows = (dataView.rows = d3_hexjson_1.renderHexJSON(HexJSON, width, height).map(processRow));
    dataView._gridRows = d3_hexjson_1.renderHexJSON(grid, width, height).map(processRow);
    return rows;
}
data_set_1.DataSet.registerConnector('hex', HexJSONConnector);
data_set_1.DataSet.registerConnector('hexjson', HexJSONConnector);
data_set_1.DataSet.registerConnector('hex-json', HexJSONConnector);
data_set_1.DataSet.registerConnector('HexJSON', HexJSONConnector);
exports.default = HexJSONConnector;
