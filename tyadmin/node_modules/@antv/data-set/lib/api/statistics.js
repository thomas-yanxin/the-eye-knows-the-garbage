"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var simpleStatistics = tslib_1.__importStar(require("simple-statistics"));
var util_1 = require("@antv/util");
var view_1 = require("../view");
var p_by_fraction_1 = tslib_1.__importDefault(require("../util/p-by-fraction"));
var constants_1 = tslib_1.__importDefault(require("../constants"));
var STATISTICS_METHODS = constants_1.default.STATISTICS_METHODS;
function getColumnValues(view, column) {
    var values = view.getColumn(column);
    if (util_1.isArray(values) && util_1.isArray(values[0])) {
        values = util_1.flattenDeep(values);
    }
    return values;
}
// statistics
STATISTICS_METHODS.forEach(function (method) {
    // @ts-ignore;
    view_1.View.prototype[method] = function (column) {
        // @ts-ignore
        return simpleStatistics[method](getColumnValues(this, column));
    };
});
var quantile = simpleStatistics.quantile;
util_1.assign(view_1.View.prototype, {
    average: view_1.View.prototype.mean,
    quantile: function (column, p) {
        return quantile(getColumnValues(this, column), p);
    },
    quantiles: function (column, pArr) {
        var columnArr = getColumnValues(this, column);
        return pArr.map(function (p) { return quantile(columnArr, p); });
    },
    quantilesByFraction: function (column, fraction) {
        return this.quantiles(column, p_by_fraction_1.default(fraction));
    },
    range: function (column) {
        return [this.min(column), this.max(column)];
    },
    extent: function (column) {
        // alias
        return this.range(column);
    },
});
