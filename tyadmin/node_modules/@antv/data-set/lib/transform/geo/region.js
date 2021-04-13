"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var data_set_1 = require("../../data-set");
var registerTransform = data_set_1.DataSet.registerTransform;
var option_parser_1 = require("../../util/option-parser");
var DEFAULT_OPTIONS = {
    // field: 'name', // required
    // geoView: view, // required
    // geoDataView: view, // alias
    as: ['_x', '_y'],
};
function transform(view, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var field = option_parser_1.getField(options);
    // @ts-ignore
    var geoView = options.geoView || options.geoDataView; // alias
    if (util_1.isString(geoView)) {
        geoView = view.dataSet.getView(geoView);
    }
    if (!geoView || geoView.dataType !== 'geo') {
        throw new TypeError('Invalid geoView: must be a DataView of GEO dataType!');
    }
    var as = options.as;
    if (!util_1.isArray(as) || as.length !== 2) {
        throw new TypeError('Invalid as: it must be an array with 2 strings (e.g. [ "x", "y" ])!');
    }
    var lonField = as[0];
    var latField = as[1];
    view.rows.forEach(function (row) {
        var feature = geoView.geoFeatureByName(row[field]);
        if (feature) {
            if (geoView._projectedAs) {
                row[lonField] = feature[geoView._projectedAs[0]];
                row[latField] = feature[geoView._projectedAs[1]];
            }
            else {
                row[lonField] = feature.longitude;
                row[latField] = feature.latitude;
            }
        }
    });
}
registerTransform('geo.region', transform);
