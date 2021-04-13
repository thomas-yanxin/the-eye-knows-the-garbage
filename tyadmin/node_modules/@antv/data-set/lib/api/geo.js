"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var d3_geo_1 = require("d3-geo");
var d3_geo_projection_1 = require("d3-geo-projection");
var view_1 = require("../view");
var get_geo_projection_1 = tslib_1.__importDefault(require("../util/get-geo-projection"));
var api = {
    // geo maintain
    geoArea: function (feature) {
        return d3_geo_1.geoArea(feature);
    },
    geoAreaByName: function (name) {
        return d3_geo_1.geoArea(this.geoFeatureByName(name));
    },
    geoCentroid: function (feature) {
        return d3_geo_1.geoCentroid(feature);
    },
    geoCentroidByName: function (name) {
        return d3_geo_1.geoCentroid(this.geoFeatureByName(name));
    },
    geoDistance: function (p1, p2) {
        return d3_geo_1.geoDistance(p1, p2);
    },
    geoLength: function (feature) {
        return d3_geo_1.geoLength(feature);
    },
    geoLengthByName: function (name) {
        return d3_geo_1.geoLength(this.geoFeatureByName(name));
    },
    geoContains: function (feature, position /* [longitude, latitude] */) {
        return d3_geo_1.geoContains(feature, position);
    },
    geoFeatureByName: function (name) {
        var rows = this.rows;
        var result;
        rows.some(function (feature) {
            if (feature.name === name) {
                result = feature;
                return true;
            }
            return false;
        });
        return result;
    },
    geoFeatureByPosition: function (position) {
        var rows = this.rows;
        var result;
        rows.some(function (feature) {
            if (d3_geo_1.geoContains(feature, position)) {
                result = feature;
                return true;
            }
            return false;
        });
        return result;
    },
    geoNameByPosition: function (position) {
        var feature = this.geoFeatureByPosition(position);
        if (feature) {
            return feature.name;
        }
    },
    // projection
    // export getGeoProjection for custom used.
    getGeoProjection: get_geo_projection_1.default,
    geoProject: function (feature, projection, exportRaw) {
        projection = get_geo_projection_1.default(projection, exportRaw);
        return d3_geo_projection_1.geoProject(feature, projection);
    },
    geoProjectByName: function (name, projection, exportRaw) {
        projection = get_geo_projection_1.default(projection, exportRaw);
        return d3_geo_projection_1.geoProject(this.geoFeatureByName(name), projection);
    },
    geoProjectPosition: function (position, projection, exportRaw) {
        var func = get_geo_projection_1.default(projection, exportRaw);
        return func(position);
    },
    geoProjectInvert: function (position /* [x, y] */, projection, exportRaw) {
        var func = get_geo_projection_1.default(projection, exportRaw);
        return func.invert(position);
    },
};
util_1.assign(view_1.View.prototype, api);
