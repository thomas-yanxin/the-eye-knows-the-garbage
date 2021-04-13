"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (fraction) {
    var step = 1 / fraction;
    var pArr = [];
    for (var i = 0; i <= 1; i = i + step) {
        pArr.push(i);
    }
    return pArr;
});
