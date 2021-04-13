import invariant from 'invariant';
import React from 'react';
import ReactDOMServer from 'react-dom/server'; // see http://w3c.github.io/html/syntax.html#writing-html-documents-elements

var VOID_TAGS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
export default function splitReactElement(element) {
  if (VOID_TAGS.indexOf(element.type) !== -1) {
    return ReactDOMServer.renderToStaticMarkup(element);
  }

  var tags = ReactDOMServer.renderToStaticMarkup(React.cloneElement(element, {}, '\r')).split('\r');
  invariant(tags.length > 1, "convertToHTML: Element of type ".concat(element.type, " must render children"));
  invariant(tags.length < 3, "convertToHTML: Element of type ".concat(element.type, " cannot use carriage return character"));
  return {
    start: tags[0],
    end: tags[1]
  };
}