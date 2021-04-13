export default (function (newFn, rest) {
  return function () {
    var newResult = newFn.apply(void 0, arguments);

    if (newResult !== undefined && newResult !== null) {
      return newResult;
    }

    return rest.apply(void 0, arguments);
  };
});