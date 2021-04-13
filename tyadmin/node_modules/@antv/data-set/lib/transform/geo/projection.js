"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var d3_geo_1 = require("d3-geo");
var point_at_length_1 = tslib_1.__importDefault(require("point-at-length"));
var data_set_1 = require("../../data-set");
var registerTransform = data_set_1.DataSet.registerTransform;
var get_geo_projection_1 = tslib_1.__importDefault(require("../../util/get-geo-projection"));
var DEFAULT_OPTIONS = {
    // projection: '', // default to null
    as: ['_x', '_y', '_centroid_x', '_centroid_y'],
};
function transform(dataView, options) {
    if (dataView.dataType !== 'geo' && dataView.dataType !== 'geo-graticule') {
        throw new TypeError('Invalid dataView: this transform is for Geo data only!');
    }
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var projection = options.projection;
    if (!projection) {
        throw new TypeError('Invalid projection!');
    }
    projection = get_geo_projection_1.default(projection);
    // @ts-ignore;
    var geoPathGenerator = d3_geo_1.geoPath(projection);
    var as = options.as;
    if (!util_1.isArray(as) || as.length !== 4) {
        throw new TypeError('Invalid as: it must be an array with 4 strings (e.g. [ "x", "y", "cX", "cY" ])!');
    }
    dataView._projectedAs = as;
    var _a = tslib_1.__read(as, 4), lonField = _a[0], latField = _a[1], centroidX = _a[2], centroidY = _a[3];
    dataView.rows.forEach(function (row) {
        row[lonField] = [];
        row[latField] = [];
        var pathData = geoPathGenerator(row);
        if (pathData) {
            // TODO projection returns null
            var points = point_at_length_1.default(pathData);
            points._path.forEach(function (point) {
                row[lonField].push(point[1]);
                row[latField].push(point[2]);
            });
            var centroid = geoPathGenerator.centroid(row);
            row[centroidX] = centroid[0];
            row[centroidY] = centroid[1];
        }
    });
    dataView.rows = dataView.rows.filter(function (row) { return row[lonField].length !== 0; });
}
registerTransform('geo.projection', transform);
