'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  var cache = {};
  var modelPaths = {};

  function getImportRequirePath(identifierName, scope) {
    if (scope.hasBinding(identifierName)) {
      var binding = scope.bindings[identifierName];
      if (binding) {
        var parent = binding.path.parent;

        if (t.isImportDeclaration(parent)) {
          return parent.source.value;
        } else if (t.isVariableDeclaration(parent)) {
          var declarator = findDeclarator(parent.declarations, identifierName);
          if (declarator) {
            if (isRequire(declarator.init)) {
              return getArguments0(declarator.init);
            } else if (isRequireDefault(declarator.init)) {
              return getArguments0(declarator.init.object);
            }
          }
        }
      }
    }
    return null;
  }

  function isDvaCallExpression(node, scope) {
    return t.isCallExpression(node) && t.isIdentifier(node.callee) && getImportRequirePath(node.callee.name, scope) === 'dva';
  }

  function isDvaInstance(identifierName, scope) {
    if (scope.hasBinding(identifierName)) {
      var binding = scope.bindings[identifierName];
      if (binding) {
        var parent = binding.path.parent;
        if (t.isVariableDeclaration(parent)) {
          var declarator = findDeclarator(parent.declarations, identifierName);
          if (declarator && isDvaCallExpression(declarator.init, scope)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function isRouterCall(node, scope) {
    if (!t.isMemberExpression(node)) return false;
    var object = node.object,
        property = node.property;

    return t.isIdentifier(property) && property.name === 'router' && t.isIdentifier(object) && isDvaInstance(object.name, scope);
  }

  function isModelCall(node, scope) {
    if (!t.isMemberExpression(node)) return false;
    var object = node.object,
        property = node.property;

    return t.isIdentifier(property) && property.name === 'model' && t.isIdentifier(object) && isDvaInstance(object.name, scope);
  }

  function isRequire(node) {
    return t.isCallExpression(node) && t.isIdentifier(node.callee) && node.callee.name === 'require';
  }

  function isRequireDefault(node) {
    if (!t.isMemberExpression(node)) return false;
    var object = node.object,
        property = node.property;

    return isRequire(object) && t.isIdentifier(property) && property.name === 'default';
  }

  function findDeclarator(declarations, identifier) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = declarations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var d = _step.value;

        if (t.isIdentifier(d.id) && d.id.name === identifier) {
          return d;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  function getArguments0(node) {
    if (t.isLiteral(node.arguments[0])) {
      return node.arguments[0].value;
    }
  }

  function getRequirePath(node, scope) {
    switch (node.type) {
      case 'CallExpression':
        {
          var path = getArguments0(node);
          if (path) {
            return path;
          }
          break;
        }
      case 'Identifier':
        {
          var _path = getImportRequirePath(node.name, scope);
          if (_path) {
            return _path;
          }
          break;
        }
      case 'MemberExpression':
        {
          if (isRequireDefault(node)) {
            var _path2 = getArguments0(node.object);
            if (_path2) {
              return _path2;
            }
          }
          break;
        }
      default:
        break;
    }
  }

  return {
    visitor: {
      Program: {
        enter: function enter(path) {
          var filename = path.hub.file.opts.filename;

          delete cache[filename];
        }
      },
      CallExpression: function CallExpression(path, state) {
        var opts = state.opts;

        var _ref2 = path && path.hub && path.hub.file && path.hub.file.opts || state && state.file,
            filename = _ref2.filename;

        if (cache[filename]) return;
        var _path$node = path.node,
            callee = _path$node.callee,
            args = _path$node.arguments;

        if (isRouterCall(callee, path.scope)) {
          var routerPath = getRequirePath(args[0], path.scope);
          if (routerPath) {
            cache[filename] = true;
            !opts.quiet && console.info('[babel-plugin-dva-hmr][INFO] got routerPath ' + routerPath);
            path.parentPath.replaceWithSourceString(getHmrString(callee.object.name, routerPath, modelPaths[filename], opts.container, !opts.disableModel));
          } else {
            !opts.quiet && console.warn('[babel-plugin-dva-hmr][WARN] can\'t get router path in ' + filename);
          }
        } else if (isModelCall(callee, path.scope)) {
          modelPaths[filename] = modelPaths[filename] || [];
          modelPaths[filename].push(getRequirePath(args[0], path.scope));
        }
      }
    }
  };
};

var _path3 = require('path');

function getHmrString(appName, routerPath) {
  var modelPaths = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var container = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#root';
  var enableModel = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  var modelHot = enableModel ? modelPaths.map(function (modelPath) {
    return '\n  if (module.hot) {\n    const modelNamespaceMap = {};\n    let model = require(\'' + modelPath + '\');\n    if (model.default) model = model.default;\n    modelNamespaceMap[\'' + modelPath + '\'] = model.namespace;\n    module.hot.accept(\'' + modelPath + '\', () => {\n      try {\n        app.unmodel(modelNamespaceMap[\'' + modelPath + '\']);\n        let model = require(\'' + modelPath + '\');\n        if (model.default) model = model.default;\n        app.model(model);\n      } catch(e) { console.error(e); }\n    });\n  }\n';
  }).join('\n') : '';
  return '\n(function() {\n  // Generated by babel-plugin-dva-hmr\n  console.log(\'[HMR] inited with babel-plugin-dva-hmr\');\n  const router = require(\'' + routerPath + '\');\n  ' + appName + '.router(router.default || router);\n  ' + appName + '.use({\n    onHmr(render) {\n      if (module.hot) {\n        const renderNormally = render;\n        const renderException = (error) => {\n          const RedBox = require(\'redbox-react\');\n          ReactDOM.render(React.createElement(RedBox, { error: error }), document.querySelector(\'' + container + '\'));\n        };\n        const newRender = (router) => {\n          try {\n            renderNormally(router);\n          } catch (error) {\n            console.error(\'error\', error);\n            renderException(error);\n          }\n        };\n        module.hot.accept(\'' + routerPath + '\', () => {\n          const router = require(\'' + routerPath + '\');\n          newRender(router.default || router);\n        });\n      }\n    },\n  });\n  ' + modelHot + '\n})()\n    ';
}

module.exports = exports['default'];