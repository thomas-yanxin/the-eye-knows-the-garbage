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

function _marked() {
  const data = _interopRequireDefault(require("marked"));

  _marked = function _marked() {
    return data;
  };

  return data;
}

function _markedTerminal() {
  const data = _interopRequireDefault(require("marked-terminal"));

  _markedTerminal = function _markedTerminal() {
    return data;
  };

  return data;
}

function _utils() {
  const data = require("@umijs/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

var _UmiError = _interopRequireWildcard(require("./UmiError"));

var _Common = _interopRequireDefault(require("./Common"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_marked().default.setOptions({
  renderer: new (_markedTerminal().default)()
});

class Logger extends _Common.default {
  constructor() {
    super(...arguments);
    this.LOG = _utils().chalk.black.bgBlue('LOG');
    this.INFO = _utils().chalk.black.bgBlue('INFO');
    this.WARN = _utils().chalk.black.bgHex('#faad14')('WARN');
    this.ERROR = _utils().chalk.black.bgRed('ERROR');
    this.PROFILE = _utils().chalk.black.bgCyan('PROFILE');
  }

  isUmiError(error) {
    return !!(error instanceof _UmiError.default);
  }
  /**
   *
   * @param e only print UmiError
   * @param opts
   */


  printUmiError(e, opts = {}) {
    const detailsOnly = opts.detailsOnly;
    const code = e.code;
    if (!code) return;
    const _ERROR_CODE_MAP$code = _UmiError.ERROR_CODE_MAP[code],
          message = _ERROR_CODE_MAP$code.message,
          details = _ERROR_CODE_MAP$code.details;
    console.error(`\n${_utils().chalk.bgRed.black('ERROR CODE')} ${_utils().chalk.red(code)}`);

    if (!detailsOnly) {
      console.error(`\n${_utils().chalk.bgRed.black('ERROR')} ${_utils().chalk.red(e.message || message)}`);
    }

    const osLocale = require('os-locale');

    const lang = osLocale.sync();

    if (lang === 'zh-CN') {
      console.error(`\n${_utils().chalk.bgMagenta.black(' DETAILS ')}\n\n${(0, _marked().default)(details['zh-CN'])}`);
    } else {
      console.error(`\n${_utils().chalk.bgMagenta.black(' DETAILS ')}\n\n${(0, _marked().default)(details.en)}`);
    }

    if (!detailsOnly && e.stack) {
      console.error(`${_utils().chalk.bgRed.black(' STACK ')}\n\n${e.stack.split('\n').slice(1).join('\n')}`);
    }
  }

  log(...args) {
    // TODO: node env production
    console.log(this.LOG, ...args);
  }
  /**
   * The {@link logger.info} function is an alias for {@link logger.log()}.
   * @param args
   */


  info(...args) {
    console.log(this.INFO, ...args);
  }

  error(...args) {
    if (this.isUmiError(args === null || args === void 0 ? void 0 : args[0])) {
      // @ts-ignore
      this.printUmiError(...args);
    } else {
      console.error(this.ERROR, ...args);
    }
  }

  warn(...args) {
    console.warn(this.WARN, ...args);
  }

  profile(id, message) {
    const time = Date.now();
    const namespace = `${this.namespace}:${id}`; // for test

    let msg;

    if (this.profilers[id]) {
      const timeEnd = this.profilers[id];
      delete this.profilers[id];
      process.stderr.write(this.PROFILE + ' ');
      msg = `${this.PROFILE} ${_utils().chalk.cyan(`└ ${namespace}`)} Completed in ${this.formatTiming(time - timeEnd)}`;
      console.log(msg);
    } else {
      msg = `${this.PROFILE} ${_utils().chalk.cyan(`┌ ${namespace}`)} ${message || ''}`;
      console.log(msg);
    }

    this.profilers[id] = time;
    return msg;
  }

}

exports.default = Logger;