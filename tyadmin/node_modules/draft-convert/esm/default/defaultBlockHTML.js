import React from 'react'; // based on Draft.js' custom list depth styling

var ORDERED_LIST_TYPES = ['1', 'a', 'i'];
export default {
  unstyled: React.createElement("p", null),
  paragraph: React.createElement("p", null),
  'header-one': React.createElement("h1", null),
  'header-two': React.createElement("h2", null),
  'header-three': React.createElement("h3", null),
  'header-four': React.createElement("h4", null),
  'header-five': React.createElement("h5", null),
  'header-six': React.createElement("h6", null),
  blockquote: React.createElement("blockquote", null),
  'unordered-list-item': {
    element: React.createElement("li", null),
    nest: React.createElement("ul", null)
  },
  'ordered-list-item': {
    element: React.createElement("li", null),
    nest: function nest(depth) {
      var type = ORDERED_LIST_TYPES[depth % 3];
      return React.createElement("ol", {
        type: type
      });
    }
  },
  media: React.createElement("figure", null),
  atomic: React.createElement("figure", null)
};