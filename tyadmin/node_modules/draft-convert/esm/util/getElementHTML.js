import _typeof from "@babel/runtime/helpers/esm/typeof";
import invariant from 'invariant';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import splitReactElement from './splitReactElement';

function hasChildren(element) {
  return React.isValidElement(element) && React.Children.count(element.props.children) > 0;
}

export default function getElementHTML(element) {
  var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (element === undefined || element === null) {
    return element;
  }

  if (typeof element === 'string') {
    return element;
  }

  if (React.isValidElement(element)) {
    if (hasChildren(element)) {
      return ReactDOMServer.renderToStaticMarkup(element);
    }

    var tags = splitReactElement(element);

    if (text !== null && _typeof(tags) === 'object') {
      var start = tags.start,
          end = tags.end;
      return start + text + end;
    }

    return tags;
  }

  invariant(Object.prototype.hasOwnProperty.call(element, 'start') && Object.prototype.hasOwnProperty.call(element, 'end'), 'convertToHTML: received conversion data without either an HTML string, ReactElement or an object with start/end tags');

  if (text !== null) {
    var _start = element.start,
        _end = element.end;
    return _start + text + _end;
  }

  return element;
}