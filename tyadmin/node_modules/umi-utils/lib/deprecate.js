"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deprecate;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isWindows = typeof process !== 'undefined' && process.platform === 'win32';
const EOL = isWindows ? '\r\n' : '\n';
const hits = new Set();
/**
 * Output the "discarded" warning to the standard error stream and only one warning to the same `methodName'.
 * @param methodName
 * @param args
 */

function deprecate(methodName, ...args) {
  if (hits[methodName]) return;
  hits[methodName] = true;
  const stream = process.stderr;
  const color = stream.isTTY && '\x1b[31;1m';
  stream.write(EOL);

  if (color) {
    stream.write(color);
  }

  stream.write(`Warning: ${methodName} has been deprecated.`);
  stream.write(EOL);
  args.forEach(message => {
    stream.write(message);
    stream.write(EOL);
  });

  if (color) {
    stream.write('\x1b[0m');
  }

  stream.write(EOL);
  stream.write(EOL);
}