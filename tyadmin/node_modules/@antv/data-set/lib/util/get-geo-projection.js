"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var d3Geo = tslib_1.__importStar(require("d3-geo"));
var d3GeoProjection = tslib_1.__importStar(require("d3-geo-projection"));
var d3CompositeProjection = tslib_1.__importStar(require("d3-composite-projections"));
/*
 * getGeoProjection
 *
 * @param {string|function} projection  projection name or projection function
 * @param {boolean} [exportRaw = false] - whether return the raw projection or not
 * */
exports.default = (function (projection, exportRaw) {
    if (exportRaw === void 0) { exportRaw = false; }
    if (util_1.isFunction(projection)) {
        return exportRaw ? projection : projection();
    }
    if (util_1.isString(projection)) {
        // @ts-ignore
        if (d3Geo[projection]) {
            // @ts-ignore
            return exportRaw ? d3Geo[projection] : d3Geo[projection]();
        }
        if (d3GeoProjection[projection]) {
            return exportRaw ? d3GeoProjection[projection] : d3GeoProjection[projection]();
        }
        if (d3CompositeProjection[projection]) {
            return exportRaw ? d3CompositeProjection[projection] : d3CompositeProjection[projection]();
        }
    }
    return null;
});
