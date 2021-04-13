export default (function (object) {
  return function (style) {
    if (typeof object === 'function') {
      return object(style);
    }

    return object[style];
  };
});