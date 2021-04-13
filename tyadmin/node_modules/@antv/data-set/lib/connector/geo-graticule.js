"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3_geo_1 = require("d3-geo");
var data_set_1 = require("../data-set");
function connector(_options, dataView) {
    dataView.dataType = 'geo-graticule';
    var data = d3_geo_1.geoGraticule().lines();
    data.map(function (row, index) {
        row.index = "" + index;
        return row;
    });
    dataView.rows = data;
    return data;
}
exports.default = connector;
data_set_1.DataSet.registerConnector('geo-graticule', connector);
