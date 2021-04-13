"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @reference: https://github.com/zeke/euclidean-distance
 */
exports.default = (function (a, b) {
    var sum = 0;
    var n;
    for (n = 0; n < a.length; n++) {
        sum += Math.pow(a[n] - b[n], 2);
    }
    return Math.sqrt(sum);
});
