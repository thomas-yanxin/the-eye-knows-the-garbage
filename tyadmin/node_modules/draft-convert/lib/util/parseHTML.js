"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parseHTML;

var fallback = function fallback(html) {
  var doc = document.implementation.createHTMLDocument('');
  doc.documentElement.innerHTML = html;
  return doc;
};

function parseHTML(html) {
  var doc;

  if (typeof DOMParser !== 'undefined') {
    var parser = new DOMParser();
    doc = parser.parseFromString(html, 'text/html');

    if (doc === null || doc.body === null) {
      doc = fallback(html);
    }
  } else {
    doc = fallback(html);
  }

  return doc.body;
}