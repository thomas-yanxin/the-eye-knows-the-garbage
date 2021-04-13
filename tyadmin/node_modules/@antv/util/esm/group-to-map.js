import isArray from './is-array';
import isFunction from './is-function';
import groupBy from './group-by';
var groupToMap = function (data, condition) {
    if (!condition) {
        return {
            0: data,
        };
    }
    if (!isFunction(condition)) {
        var paramsCondition_1 = isArray(condition) ? condition : condition.replace(/\s+/g, '').split('*');
        condition = function (row) {
            var unique = '_'; // 避免出现数字作为Key的情况，会进行按照数字的排序
            for (var i = 0, l = paramsCondition_1.length; i < l; i++) {
                unique += row[paramsCondition_1[i]] && row[paramsCondition_1[i]].toString();
            }
            return unique;
        };
    }
    var groups = groupBy(data, condition);
    return groups;
};
export default groupToMap;
//# sourceMappingURL=group-to-map.js.map