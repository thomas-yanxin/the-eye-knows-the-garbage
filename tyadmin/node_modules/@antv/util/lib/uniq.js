"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var contains_1 = require("./contains");
var each_1 = require("./each");
var uniq = function (arr) {
    var resultArr = [];
    each_1.default(arr, function (item) {
        if (!contains_1.default(resultArr, item)) {
            resultArr.push(item);
        }
    });
    return resultArr;
};
exports.default = uniq;
//# sourceMappingURL=uniq.js.map