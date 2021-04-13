"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ERROR_CODE_MAP = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _errorCodeMap() {
  const data = _interopRequireDefault(require("@umijs/error-code-map"));

  _errorCodeMap = function _errorCodeMap() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore
// 支持内部框架扩展 error code map
const ERROR_CODE_MAP = process.env.ERROR_CODE_MAP_PATH ? require(process.env.ERROR_CODE_MAP_PATH) : _errorCodeMap().default;
exports.ERROR_CODE_MAP = ERROR_CODE_MAP;

class UmiError extends Error {
  constructor(opts, ...params) {
    const message = opts.message,
          code = opts.code,
          context = opts.context; // @ts-ignore

    super(message, ...params);
    this.code = code;
    this.context = context || {};
    this.test();
  }

  test() {
    if (this.code) {
      return;
    }

    for (var _i = 0, _Object$keys = Object.keys(ERROR_CODE_MAP); _i < _Object$keys.length; _i++) {
      const c = _Object$keys[_i];
      const test = ERROR_CODE_MAP[c].test;

      if (test && test({
        error: this,
        context: this.context
      })) {
        this.code = c;
        break;
      }
    }
  }

}

exports.default = UmiError;