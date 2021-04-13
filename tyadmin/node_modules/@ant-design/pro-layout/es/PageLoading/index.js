import "antd/es/spin/style";
import _Spin from "antd/es/spin";
import React from 'react';

var PageLoading = function PageLoading(_ref) {
  var tip = _ref.tip;
  return React.createElement("div", {
    style: {
      paddingTop: 100,
      textAlign: 'center'
    }
  }, React.createElement(_Spin, {
    size: "large",
    tip: tip
  }));
};

export default PageLoading;