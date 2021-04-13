"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CLIENT_EXPORTS = exports.TMP_PLUGIN_DIR = exports.OUTPUT_SERVER_FILENAME = exports.CHUNK_NAME = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CHUNK_NAME = 'server';
exports.CHUNK_NAME = CHUNK_NAME;
const OUTPUT_SERVER_FILENAME = 'umi.server.js';
exports.OUTPUT_SERVER_FILENAME = OUTPUT_SERVER_FILENAME;
const TMP_PLUGIN_DIR = 'core/ssr';
exports.TMP_PLUGIN_DIR = TMP_PLUGIN_DIR;
const CLIENT_EXPORTS = 'clientExports';
exports.CLIENT_EXPORTS = CLIENT_EXPORTS;