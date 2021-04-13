"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
if (!('RelativeTimeFormat' in Intl)) {
    Object.defineProperty(Intl, 'RelativeTimeFormat', {
        value: core_1.default,
        writable: true,
        enumerable: false,
        configurable: true,
    });
}
//# sourceMappingURL=polyfill.js.map