"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var utils_1 = require("../utils");
var injectIntl_1 = require("./injectIntl");
var DisplayName;
(function (DisplayName) {
    DisplayName["formatDate"] = "FormattedDate";
    DisplayName["formatTime"] = "FormattedTime";
    DisplayName["formatNumber"] = "FormattedNumber";
    DisplayName["formatList"] = "FormattedList";
    // Note that this DisplayName is the locale display name, not to be confused with
    // the name of the enum, which is for React component display name in dev tools.
    DisplayName["formatDisplayName"] = "FormattedDisplayName";
})(DisplayName || (DisplayName = {}));
var DisplayNameParts;
(function (DisplayNameParts) {
    DisplayNameParts["formatDate"] = "FormattedDateParts";
    DisplayNameParts["formatTime"] = "FormattedTimeParts";
    DisplayNameParts["formatNumber"] = "FormattedNumberParts";
    DisplayNameParts["formatList"] = "FormattedListParts";
})(DisplayNameParts || (DisplayNameParts = {}));
exports.FormattedNumberParts = function (props) { return (React.createElement(injectIntl_1.Context.Consumer, null, function (intl) {
    utils_1.invariantIntlContext(intl);
    var value = props.value, children = props.children, formatProps = __rest(props, ["value", "children"]);
    return children(intl.formatNumberToParts(value, formatProps));
})); };
exports.FormattedNumberParts.displayName = 'FormattedNumberParts';
function createFormattedDateTimePartsComponent(name) {
    var ComponentParts = function (props) { return (React.createElement(injectIntl_1.Context.Consumer, null, function (intl) {
        utils_1.invariantIntlContext(intl);
        var value = props.value, children = props.children, formatProps = __rest(props, ["value", "children"]);
        var date = typeof value === 'string' ? new Date(value || 0) : value;
        var formattedParts = name === 'formatDate'
            ? intl.formatDateToParts(date, formatProps)
            : intl.formatTimeToParts(date, formatProps);
        return children(formattedParts);
    })); };
    ComponentParts.displayName = DisplayNameParts[name];
    return ComponentParts;
}
exports.createFormattedDateTimePartsComponent = createFormattedDateTimePartsComponent;
function createFormattedComponent(name) {
    var Component = function (props) { return (React.createElement(injectIntl_1.Context.Consumer, null, function (intl) {
        utils_1.invariantIntlContext(intl);
        var value = props.value, children = props.children, formatProps = __rest(props, ["value", "children"]);
        // TODO: fix TS type definition for localeMatcher upstream
        var formattedValue = intl[name](value, formatProps);
        if (typeof children === 'function') {
            return children(formattedValue);
        }
        var Text = intl.textComponent || React.Fragment;
        return React.createElement(Text, null, formattedValue);
    })); };
    Component.displayName = DisplayName[name];
    return Component;
}
exports.createFormattedComponent = createFormattedComponent;
