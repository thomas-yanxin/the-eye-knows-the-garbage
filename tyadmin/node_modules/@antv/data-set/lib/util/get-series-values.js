"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
exports.default = (function (extent, bw) {
    var bandwidth = bw || 1;
    var _a = tslib_1.__read(extent, 2), min = _a[0], max = _a[1];
    var values = [];
    var tmp = min;
    while (tmp < max) {
        values.push(tmp);
        tmp += bandwidth;
    }
    values.push(max);
    return values;
});
