import invariant from 'invariant';
import React from 'react';
import splitReactElement from './splitReactElement';
export default function getNestedBlockTags(blockHTML, depth) {
  invariant(blockHTML !== null && blockHTML !== undefined, 'Expected block HTML value to be non-null');

  if (typeof blockHTML.nest === 'function') {
    var _splitReactElement = splitReactElement(blockHTML.nest(depth)),
        start = _splitReactElement.start,
        end = _splitReactElement.end;

    return Object.assign({}, blockHTML, {
      nestStart: start,
      nestEnd: end
    });
  }

  if (React.isValidElement(blockHTML.nest)) {
    var _splitReactElement2 = splitReactElement(blockHTML.nest),
        _start = _splitReactElement2.start,
        _end = _splitReactElement2.end;

    return Object.assign({}, blockHTML, {
      nestStart: _start,
      nestEnd: _end
    });
  }

  invariant(Object.prototype.hasOwnProperty.call(blockHTML, 'nestStart') && Object.prototype.hasOwnProperty.call(blockHTML, 'nestEnd'), 'convertToHTML: received block information without either a ReactElement or an object with start/end tags');
  return blockHTML;
}