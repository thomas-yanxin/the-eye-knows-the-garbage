"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getScriptPath = getScriptPath;
exports.checkIfHasDefaultExporting = checkIfHasDefaultExporting;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getScriptPath(filepath) {
  let realFilePath = '';

  if (_fs().default.existsSync(`${filepath}.ts`)) {
    realFilePath = `${filepath}.ts`;
  } else if (_fs().default.existsSync(`${filepath}.js`)) {
    realFilePath = `${filepath}.js`;
  }

  return realFilePath;
}

function checkIfHasDefaultExporting(filepath) {
  const scriptPath = getScriptPath(filepath);

  if (!scriptPath) {
    return false;
  }

  const fileContent = _fs().default.readFileSync(scriptPath, 'utf8');

  const validationRegExp = /(export\s*default)|(exports\.default)|(module.exports[\s\S]*default)|(module.exports[\s\n]*=)/m;
  return validationRegExp.test(fileContent);
}