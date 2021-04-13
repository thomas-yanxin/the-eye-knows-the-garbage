"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts = __importStar(require("typescript"));
function getTypeScriptPerformance() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ts.performance;
}
function connectTypeScriptPerformance(performance) {
    const typeScriptPerformance = getTypeScriptPerformance();
    if (typeScriptPerformance) {
        const { mark, measure } = typeScriptPerformance;
        const { enable, disable } = performance;
        typeScriptPerformance.mark = (name) => {
            mark(name);
            performance.mark(name);
        };
        typeScriptPerformance.measure = (name, startMark, endMark) => {
            measure(name, startMark, endMark);
            performance.measure(name, startMark, endMark);
        };
        return Object.assign(Object.assign({}, performance), { enable() {
                enable();
                typeScriptPerformance.enable();
            },
            disable() {
                disable();
                typeScriptPerformance.disable();
            } });
    }
    else {
        return performance;
    }
}
exports.connectTypeScriptPerformance = connectTypeScriptPerformance;
