"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var is_array_1 = require("./is-array");
var is_function_1 = require("./is-function");
var group_by_1 = require("./group-by");
var groupToMap = function (data, condition) {
    if (!condition) {
        return {
            0: data,
        };
    }
    if (!is_function_1.default(condition)) {
        var paramsCondition_1 = is_array_1.default(condition) ? condition : condition.replace(/\s+/g, '').split('*');
        condition = function (row) {
            var unique = '_'; // 避免出现数字作为Key的情况，会进行按照数字的排序
            for (var i = 0, l = paramsCondition_1.length; i < l; i++) {
                unique += row[paramsCondition_1[i]] && row[paramsCondition_1[i]].toString();
            }
            return unique;
        };
    }
    var groups = group_by_1.default(data, condition);
    return groups;
};
exports.default = groupToMap;
//# sourceMappingURL=group-to-map.js.map