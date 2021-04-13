"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var simple_statistics_1 = require("simple-statistics");
function silverman(arr) {
    var stdev = simple_statistics_1.standardDeviation(arr);
    var num = 4 * Math.pow(stdev, 5);
    var denom = 3 * arr.length;
    return Math.pow(num / denom, 0.2);
}
exports.silverman = silverman;
function nrd(arr) {
    var s = simple_statistics_1.standardDeviation(arr);
    var iqr = simple_statistics_1.interquartileRange(arr);
    if (typeof iqr === 'number') {
        s = Math.min(s, iqr / 1.34);
    }
    return 1.06 * s * Math.pow(arr.length, -0.2);
}
exports.nrd = nrd;
