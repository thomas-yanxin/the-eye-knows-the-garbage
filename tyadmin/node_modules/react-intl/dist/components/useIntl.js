"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var injectIntl_1 = require("./injectIntl");
var utils_1 = require("../utils");
function useIntl() {
    var intl = react_1.useContext(injectIntl_1.Context);
    utils_1.invariantIntlContext(intl);
    return intl;
}
exports.default = useIntl;
