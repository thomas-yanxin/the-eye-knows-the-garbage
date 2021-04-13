function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import classnames from 'classnames';
import { ConfigConsumer } from "antd/es/config-provider/context";
import './index.less';
/**
 * 默认的 index 列容器，提供一个好看的 index
 * @param param0
 */

var IndexColumn = function IndexColumn(_ref) {
  var _ref$border = _ref.border,
      border = _ref$border === void 0 ? false : _ref$border,
      children = _ref.children;
  return React.createElement(ConfigConsumer, null, function (_ref2) {
    var _classnames;

    var getPrefixCls = _ref2.getPrefixCls;
    var className = getPrefixCls('pro-table-index-column');
    return React.createElement("div", {
      className: classnames(className, (_classnames = {}, _defineProperty(_classnames, "".concat(className, "-border"), border), _defineProperty(_classnames, 'top-three', children > 2), _classnames))
    }, children);
  });
};

export default IndexColumn;