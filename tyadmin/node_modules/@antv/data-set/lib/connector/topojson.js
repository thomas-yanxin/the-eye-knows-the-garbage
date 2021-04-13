"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var topojson_client_1 = require("topojson-client");
var geojson_1 = tslib_1.__importDefault(require("./geojson"));
var data_set_1 = require("../data-set");
function TopoJSONConnector(data, options, dataView) {
    var object = options.object;
    if (!util_1.isString(object)) {
        throw new TypeError('Invalid object: must be a string!');
    }
    var geoData = topojson_client_1.feature(data, data.objects[object]);
    return geojson_1.default(geoData, undefined, dataView);
}
data_set_1.DataSet.registerConnector('topojson', TopoJSONConnector);
data_set_1.DataSet.registerConnector('TopoJSON', TopoJSONConnector);
