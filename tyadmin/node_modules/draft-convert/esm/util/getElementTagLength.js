import _typeof from "@babel/runtime/helpers/esm/typeof";
import React from 'react';
import splitReactElement from './splitReactElement';

var getElementTagLength = function getElementTagLength(element) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'start';

  if (React.isValidElement(element)) {
    var splitElement = splitReactElement(element);

    if (typeof splitElement === 'string') {
      return 0;
    }

    var length = splitElement[type].length;
    var child = React.Children.toArray(element.props.children)[0];
    return length + (child && React.isValidElement(child) ? getElementTagLength(child, type) : 0);
  }

  if (_typeof(element) === 'object') {
    return element[type] ? element[type].length : 0;
  }

  return 0;
};

export default getElementTagLength;