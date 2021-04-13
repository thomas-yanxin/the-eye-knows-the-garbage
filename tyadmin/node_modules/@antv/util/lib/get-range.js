"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var is_array_1 = require("./is-array");
var getRange = function (values) {
    // 存在 NaN 时，min,max 判定会出问题
    var filterValues = values.filter(function (v) { return !isNaN(v); });
    if (!filterValues.length) { // 如果没有数值则直接返回0
        return {
            min: 0,
            max: 0,
        };
    }
    if (is_array_1.default(values[0])) {
        var tmp = [];
        for (var i = 0; i < values.length; i++) {
            tmp = tmp.concat(values[i]);
        }
        filterValues = tmp;
    }
    var max = Math.max.apply(null, filterValues);
    var min = Math.min.apply(null, filterValues);
    return {
        min: min,
        max: max,
    };
};
exports.default = getRange;
//# sourceMappingURL=get-range.js.map