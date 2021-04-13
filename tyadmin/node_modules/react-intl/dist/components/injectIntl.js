"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var hoistNonReactStatics_ = require("hoist-non-react-statics");
// Since rollup cannot deal with namespace being a function,
// this is to interop with TypeScript since `invariant`
// does not export a default
// https://github.com/rollup/rollup/issues/1267
var hoistNonReactStatics = hoistNonReactStatics_.default || hoistNonReactStatics_;
var utils_1 = require("../utils");
function getDisplayName(Component) {
    return Component.displayName || Component.name || 'Component';
}
// TODO: We should provide initial value here
var IntlContext = React.createContext(null);
var IntlConsumer = IntlContext.Consumer, IntlProvider = IntlContext.Provider;
exports.Provider = IntlProvider;
exports.Context = IntlContext;
function injectIntl(WrappedComponent, options) {
    var _a = options || {}, _b = _a.intlPropName, intlPropName = _b === void 0 ? 'intl' : _b, _c = _a.forwardRef, forwardRef = _c === void 0 ? false : _c, _d = _a.enforceContext, enforceContext = _d === void 0 ? true : _d;
    var WithIntl = function (props) { return (React.createElement(IntlConsumer, null, function (intl) {
        var _a;
        if (enforceContext) {
            utils_1.invariantIntlContext(intl);
        }
        return (React.createElement(WrappedComponent, __assign({}, props, (_a = {},
            _a[intlPropName] = intl,
            _a), { ref: forwardRef ? props.forwardedRef : null })));
    })); };
    WithIntl.displayName = "injectIntl(" + getDisplayName(WrappedComponent) + ")";
    WithIntl.WrappedComponent = WrappedComponent;
    if (forwardRef) {
        return hoistNonReactStatics(React.forwardRef(function (props, ref) { return (React.createElement(WithIntl, __assign({}, props, { forwardedRef: ref }))); }), WrappedComponent);
    }
    return hoistNonReactStatics(WithIntl, WrappedComponent);
}
exports.default = injectIntl;
