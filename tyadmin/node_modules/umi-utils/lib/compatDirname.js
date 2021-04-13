"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
    return data;
  };

  return data;
}

var _winPath = _interopRequireDefault(require("./winPath"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Find module path
 * @param path module name
 * @param cwd process cwd
 * @param fallback
 */
function _default(path, cwd, fallback) {
  const pkg = findPkg(path, cwd);
  if (pkg) return pkg;

  if (cwd !== process.cwd()) {
    const pkg = findPkg(path, process.cwd());
    if (pkg) return pkg;
  }

  return fallback;
}
/**
 * Find module path
 * @param path module name
 * @param cwd
 */


function findPkg(path, cwd) {
  const pkgPath = (0, _path().join)(cwd, 'package.json');
  const library = path.split('/')[0];

  if ((0, _fs().existsSync)(pkgPath)) {
    const _require = require(pkgPath),
          _require$dependencies = _require.dependencies,
          dependencies = _require$dependencies === void 0 ? {} : _require$dependencies,
          _require$devDependenc = _require.devDependencies,
          devDependencies = _require$devDependenc === void 0 ? {} : _require$devDependenc; // eslint-disable-line


    if (dependencies[library] || devDependencies[library]) {
      const pkgPath = (0, _path().dirname)((0, _path().join)(cwd, 'node_modules', path));

      if ((0, _fs().existsSync)(pkgPath)) {
        return (0, _winPath.default)(pkgPath);
      }
    }
  }
}