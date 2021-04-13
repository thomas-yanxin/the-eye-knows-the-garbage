import "antd/es/badge/style";
import _Badge from "antd/es/badge";
import React from 'react';
import './index.less';
/**
 * 快捷操作，用于快速的展示一个状态
 */

var Status = {
  Success: function Success(_ref) {
    var children = _ref.children;
    return React.createElement(_Badge, {
      status: "success",
      text: children
    });
  },
  Error: function Error(_ref2) {
    var children = _ref2.children;
    return React.createElement(_Badge, {
      status: "error",
      text: children
    });
  },
  Default: function Default(_ref3) {
    var children = _ref3.children;
    return React.createElement(_Badge, {
      status: "default",
      text: children
    });
  },
  Processing: function Processing(_ref4) {
    var children = _ref4.children;
    return React.createElement(_Badge, {
      status: "processing",
      text: children
    });
  },
  Warning: function Warning(_ref5) {
    var children = _ref5.children;
    return React.createElement(_Badge, {
      status: "warning",
      text: children
    });
  }
};
export default Status;