"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
function sortBy(arr, keys) {
    if (keys === void 0) { keys = []; }
    var comparer = undefined;
    if (util_1.isFunction(keys)) {
        comparer = keys;
    }
    else if (util_1.isArray(keys)) {
        comparer = function (a, b) {
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (a[key] < b[key]) {
                    return -1;
                }
                if (a[key] > b[key]) {
                    return 1;
                }
            }
            return 0;
        };
    }
    else if (util_1.isString(keys)) {
        comparer = function (a, b) {
            if (a[keys] < b[keys]) {
                return -1;
            }
            if (a[keys] > b[keys]) {
                return 1;
            }
            return 0;
        };
    }
    return arr.sort(comparer);
}
exports.default = sortBy;
