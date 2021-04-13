import * as React from 'react';
import * as hoistNonReactStatics_ from 'hoist-non-react-statics';
// Since rollup cannot deal with namespace being a function,
// this is to interop with TypeScript since `invariant`
// does not export a default
// https://github.com/rollup/rollup/issues/1267
const hoistNonReactStatics = hoistNonReactStatics_.default || hoistNonReactStatics_;
import { invariantIntlContext } from '../utils';
function getDisplayName(Component) {
    return Component.displayName || Component.name || 'Component';
}
// TODO: We should provide initial value here
const IntlContext = React.createContext(null);
const { Consumer: IntlConsumer, Provider: IntlProvider } = IntlContext;
export const Provider = IntlProvider;
export const Context = IntlContext;
export default function injectIntl(WrappedComponent, options) {
    const { intlPropName = 'intl', forwardRef = false, enforceContext = true } = options || {};
    const WithIntl = props => (React.createElement(IntlConsumer, null, (intl) => {
        if (enforceContext) {
            invariantIntlContext(intl);
        }
        return (React.createElement(WrappedComponent, Object.assign({}, props, {
            [intlPropName]: intl,
        }, { ref: forwardRef ? props.forwardedRef : null })));
    }));
    WithIntl.displayName = `injectIntl(${getDisplayName(WrappedComponent)})`;
    WithIntl.WrappedComponent = WrappedComponent;
    if (forwardRef) {
        return hoistNonReactStatics(React.forwardRef((props, ref) => (React.createElement(WithIntl, Object.assign({}, props, { forwardedRef: ref })))), WrappedComponent);
    }
    return hoistNonReactStatics(WithIntl, WrappedComponent);
}
