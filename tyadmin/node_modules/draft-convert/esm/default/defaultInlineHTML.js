import React from 'react';
export default function defaultInlineHTML(style) {
  switch (style) {
    case 'BOLD':
      return React.createElement("strong", null);

    case 'ITALIC':
      return React.createElement("em", null);

    case 'UNDERLINE':
      return React.createElement("u", null);

    case 'CODE':
      return React.createElement("code", null);

    default:
      return {
        start: '',
        end: ''
      };
  }
}