"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var d3Voronoi = tslib_1.__importStar(require("d3-voronoi"));
var util_1 = require("@antv/util");
var data_set_1 = require("../../data-set");
var registerTransform = data_set_1.DataSet.registerTransform;
var option_parser_1 = require("../../util/option-parser");
var DEFAULT_OPTIONS = {
    // fields: [ 'x', 'y' ] // field x and field y, required
    // extend: [[x0, y0], [x1, y1]], // optional
    // size: [width, height], // optional
    as: ['_x', '_y'],
};
function transform(dataView, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var as = options.as;
    if (!util_1.isArray(as) || as.length !== 2) {
        throw new TypeError('Invalid as: must be an array with two strings!');
    }
    var xField = as[0];
    var yField = as[1];
    var fields = option_parser_1.getFields(options);
    if (!util_1.isArray(fields) || fields.length !== 2) {
        throw new TypeError('Invalid fields: must be an array with two strings!');
    }
    var x = fields[0];
    var y = fields[1];
    var rows = dataView.rows;
    var data = rows.map(function (row) { return [row[x], row[y]]; });
    var voronoi = d3Voronoi.voronoi();
    if (options.extend) {
        voronoi.extent(options.extend);
    }
    if (options.size) {
        voronoi.size(options.size);
    }
    var polygons = voronoi(data).polygons();
    rows.forEach(function (row, i) {
        var polygon = polygons[i].filter(function (point) { return !!point; }); // some points are null
        row[xField] = polygon.map(function (point) { return point[0]; });
        row[yField] = polygon.map(function (point) { return point[1]; });
    });
}
registerTransform('diagram.voronoi', transform);
registerTransform('voronoi', transform);
