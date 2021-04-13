import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import warning from "rc-util/es/warning";
export var INTERNAL_COL_DEFINE = 'RC_TABLE_INTERNAL_COL_DEFINE';
export function getExpandableProps(props) {
  var expandable = props.expandable,
      legacyExpandableConfig = _objectWithoutProperties(props, ["expandable"]);

  if ('expandable' in props) {
    return _objectSpread(_objectSpread({}, legacyExpandableConfig), expandable);
  }

  if (process.env.NODE_ENV !== 'production' && ['indentSize', 'expandedRowKeys', 'defaultExpandedRowKeys', 'defaultExpandAllRows', 'expandedRowRender', 'expandRowByClick', 'expandIcon', 'onExpand', 'onExpandedRowsChange', 'expandedRowClassName', 'expandIconColumnIndex'].some(function (prop) {
    return prop in props;
  })) {
    warning(false, 'expanded related props have been moved into `expandable`.');
  }

  return legacyExpandableConfig;
}
/**
 * Returns only data- and aria- key/value pairs
 * @param {object} props
 */

export function getDataAndAriaProps(props) {
  /* eslint-disable no-param-reassign */
  return Object.keys(props).reduce(function (memo, key) {
    if (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-') {
      memo[key] = props[key];
    }

    return memo;
  }, {});
  /* eslint-enable */
}