import contains from './contains';
import each from './each';
var uniq = function (arr) {
    var resultArr = [];
    each(arr, function (item) {
        if (!contains(resultArr, item)) {
            resultArr.push(item);
        }
    });
    return resultArr;
};
export default uniq;
//# sourceMappingURL=uniq.js.map