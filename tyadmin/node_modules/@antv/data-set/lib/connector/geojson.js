"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var point_at_length_1 = tslib_1.__importDefault(require("point-at-length"));
var util_1 = require("@antv/util");
var d3_geo_1 = require("d3-geo");
var data_set_1 = require("../data-set");
var geoPathGenerator = d3_geo_1.geoPath();
function GeoJSONConnector(data, _options, dataView) {
    dataView.dataType = data_set_1.DataSet.CONSTANTS.GEO;
    var features = util_1.deepMix([], data.features);
    // pre-process
    features.forEach(function (feature) {
        feature.name = feature.properties.name;
        feature.longitude = [];
        feature.latitude = [];
        var pathData = (feature.pathData = geoPathGenerator(feature));
        var points = point_at_length_1.default(pathData);
        points._path.forEach(function (point) {
            feature.longitude.push(point[1]);
            feature.latitude.push(point[2]);
        });
        var centroid = geoPathGenerator.centroid(feature);
        feature.centroidX = centroid[0];
        feature.centroidY = centroid[1];
    });
    // dataView.origin = features;
    return features;
}
data_set_1.DataSet.registerConnector('geo', GeoJSONConnector);
data_set_1.DataSet.registerConnector('geojson', GeoJSONConnector);
data_set_1.DataSet.registerConnector('GeoJSON', GeoJSONConnector);
exports.default = GeoJSONConnector;
