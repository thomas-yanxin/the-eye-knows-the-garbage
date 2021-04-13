"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
if (!core_1.isUnitSupported('bit')) {
    Intl.NumberFormat = core_1.UnifiedNumberFormat;
}
//# sourceMappingURL=polyfill.js.map