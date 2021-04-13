"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function invariant(condition, message, Err) {
    if (Err === void 0) { Err = Error; }
    if (!condition) {
        throw new Err(message);
    }
}
exports.invariant = invariant;
//# sourceMappingURL=invariant.js.map