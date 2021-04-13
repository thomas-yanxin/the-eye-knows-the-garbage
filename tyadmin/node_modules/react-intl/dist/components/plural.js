"use strict";
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var injectIntl_1 = require("./injectIntl");
var FormattedPlural = function (props) {
    var value = props.value, other = props.other, children = props.children, _a = props.intl, formatPlural = _a.formatPlural, Text = _a.textComponent;
    var pluralCategory = formatPlural(value, props);
    var formattedPlural = props[pluralCategory] || other;
    if (typeof children === 'function') {
        return children(formattedPlural);
    }
    if (Text) {
        return React.createElement(Text, null, formattedPlural);
    }
    // Work around @types/react where React.FC cannot return string
    return formattedPlural;
};
FormattedPlural.defaultProps = {
    type: 'cardinal',
};
FormattedPlural.displayName = 'FormattedPlural';
exports.default = injectIntl_1.default(FormattedPlural);
