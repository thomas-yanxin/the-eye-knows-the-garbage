"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _nodeFetch() {
  const data = _interopRequireDefault(require("node-fetch"));

  _nodeFetch = function _nodeFetch() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const registryMap = {
  'github.com': 'https://github.com/ant-design/ant-design.git',
  'gitee.com': 'https://gitee.com/ant-design/pro-blocks'
};
/**
 * Get the fast registry Url(github.com or gitee.com)
 */

const getFastGithub =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* () {
    const promiseList = Object.keys(registryMap).map(
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(function* (key) {
        return (0, _nodeFetch().default)(registryMap[key]).catch(() => null).then(() => Promise.resolve(key));
      });

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    try {
      const url = yield Promise.race(promiseList);
      return url;
    } catch (e) {
      return 'github.com';
    }
  });

  return function getFastGithub() {
    return _ref.apply(this, arguments);
  };
}();

var _default = getFastGithub;
exports.default = _default;