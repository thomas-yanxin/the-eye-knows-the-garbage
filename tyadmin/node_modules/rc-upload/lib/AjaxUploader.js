'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _uid = require('./uid');

var _uid2 = _interopRequireDefault(_uid);

var _attrAccept = require('./attr-accept');

var _attrAccept2 = _interopRequireDefault(_attrAccept);

var _traverseFileTree = require('./traverseFileTree');

var _traverseFileTree2 = _interopRequireDefault(_traverseFileTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint react/no-is-mounted:0,react/sort-comp:0,react/prop-types:0 */


var dataOrAriaAttributeProps = function dataOrAriaAttributeProps(props) {
  return Object.keys(props).reduce(function (acc, key) {
    if (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-' || key === 'role') {
      acc[key] = props[key];
    }
    return acc;
  }, {});
};

var AjaxUploader = function (_Component) {
  _inherits(AjaxUploader, _Component);

  function AjaxUploader() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AjaxUploader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AjaxUploader.__proto__ || Object.getPrototypeOf(AjaxUploader)).call.apply(_ref, [this].concat(args))), _this), _this.state = { uid: (0, _uid2['default'])() }, _this.reqs = {}, _this.onChange = function (e) {
      var files = e.target.files;
      _this.uploadFiles(files);
      _this.reset();
    }, _this.onClick = function (e) {
      var el = _this.fileInput;
      if (!el) {
        return;
      }
      var _this$props = _this.props,
          children = _this$props.children,
          onClick = _this$props.onClick;

      if (children && children.type === 'button') {
        el.parentNode.focus();
        el.parentNode.querySelector('button').blur();
      }
      el.click();
      if (onClick) {
        onClick(e);
      }
    }, _this.onKeyDown = function (e) {
      if (e.key === 'Enter') {
        _this.onClick();
      }
    }, _this.onFileDrop = function (e) {
      var multiple = _this.props.multiple;


      e.preventDefault();

      if (e.type === 'dragover') {
        return;
      }

      if (_this.props.directory) {
        (0, _traverseFileTree2['default'])(Array.prototype.slice.call(e.dataTransfer.items), _this.uploadFiles, function (_file) {
          return (0, _attrAccept2['default'])(_file, _this.props.accept);
        });
      } else {
        var files = Array.prototype.slice.call(e.dataTransfer.files).filter(function (file) {
          return (0, _attrAccept2['default'])(file, _this.props.accept);
        });

        if (multiple === false) {
          files = files.slice(0, 1);
        }

        _this.uploadFiles(files);
      }
    }, _this.uploadFiles = function (files) {
      var postFiles = Array.prototype.slice.call(files);
      postFiles.map(function (file) {
        file.uid = (0, _uid2['default'])();
        return file;
      }).forEach(function (file) {
        _this.upload(file, postFiles);
      });
    }, _this.saveFileInput = function (node) {
      _this.fileInput = node;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AjaxUploader, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._isMounted = true;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._isMounted = false;
      this.abort();
    }
  }, {
    key: 'upload',
    value: function upload(file, fileList) {
      var _this2 = this;

      var props = this.props;

      if (!props.beforeUpload) {
        // always async in case use react state to keep fileList
        return setTimeout(function () {
          return _this2.post(file);
        }, 0);
      }

      var before = props.beforeUpload(file, fileList);
      if (before && before.then) {
        before.then(function (processedFile) {
          var processedFileType = Object.prototype.toString.call(processedFile);
          if (processedFileType === '[object File]' || processedFileType === '[object Blob]') {
            return _this2.post(processedFile);
          }
          return _this2.post(file);
        })['catch'](function (e) {
          // eslint-disable-next-line no-console
          console.log(e);
        });
      } else if (before !== false) {
        setTimeout(function () {
          return _this2.post(file);
        }, 0);
      }
      return undefined;
    }
  }, {
    key: 'post',
    value: function post(file) {
      var _this3 = this;

      if (!this._isMounted) {
        return;
      }
      var props = this.props;
      var onStart = props.onStart,
          onProgress = props.onProgress,
          _props$transformFile = props.transformFile,
          transformFile = _props$transformFile === undefined ? function (originFile) {
        return originFile;
      } : _props$transformFile;


      new Promise(function (resolve) {
        var action = props.action;

        if (typeof action === 'function') {
          action = action(file);
        }
        return resolve(action);
      }).then(function (action) {
        var uid = file.uid;

        var request = props.customRequest || _request2['default'];
        var transform = Promise.resolve(transformFile(file)).then(function (transformedFile) {
          var data = props.data;

          if (typeof data === 'function') {
            data = data(transformedFile);
          }
          return Promise.all([transformedFile, data]);
        })['catch'](function (e) {
          console.error(e); // eslint-disable-line no-console
        });

        transform.then(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
              transformedFile = _ref3[0],
              data = _ref3[1];

          var requestOption = {
            action: action,
            filename: props.name,
            data: data,
            file: transformedFile,
            headers: props.headers,
            withCredentials: props.withCredentials,
            method: props.method || 'post',
            onProgress: onProgress ? function (e) {
              onProgress(e, file);
            } : null,
            onSuccess: function onSuccess(ret, xhr) {
              delete _this3.reqs[uid];
              props.onSuccess(ret, file, xhr);
            },
            onError: function onError(err, ret) {
              delete _this3.reqs[uid];
              props.onError(err, ret, file);
            }
          };
          _this3.reqs[uid] = request(requestOption);
          onStart(file);
        });
      });
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.setState({
        uid: (0, _uid2['default'])()
      });
    }
  }, {
    key: 'abort',
    value: function abort(file) {
      var reqs = this.reqs;

      if (file) {
        var uid = file;
        if (file && file.uid) {
          uid = file.uid;
        }
        if (reqs[uid] && reqs[uid].abort) {
          reqs[uid].abort();
        }
        delete reqs[uid];
      } else {
        Object.keys(reqs).forEach(function (uid) {
          if (reqs[uid] && reqs[uid].abort) {
            reqs[uid].abort();
          }
          delete reqs[uid];
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _classNames;

      var _props = this.props,
          Tag = _props.component,
          prefixCls = _props.prefixCls,
          className = _props.className,
          disabled = _props.disabled,
          id = _props.id,
          style = _props.style,
          multiple = _props.multiple,
          accept = _props.accept,
          children = _props.children,
          directory = _props.directory,
          openFileDialogOnClick = _props.openFileDialogOnClick,
          onMouseEnter = _props.onMouseEnter,
          onMouseLeave = _props.onMouseLeave,
          otherProps = _objectWithoutProperties(_props, ['component', 'prefixCls', 'className', 'disabled', 'id', 'style', 'multiple', 'accept', 'children', 'directory', 'openFileDialogOnClick', 'onMouseEnter', 'onMouseLeave']);

      var cls = (0, _classnames2['default'])((_classNames = {}, _defineProperty(_classNames, prefixCls, true), _defineProperty(_classNames, prefixCls + '-disabled', disabled), _defineProperty(_classNames, className, className), _classNames));
      var events = disabled ? {} : {
        onClick: openFileDialogOnClick ? this.onClick : function () {},
        onKeyDown: openFileDialogOnClick ? this.onKeyDown : function () {},
        onMouseEnter: onMouseEnter,
        onMouseLeave: onMouseLeave,
        onDrop: this.onFileDrop,
        onDragOver: this.onFileDrop,
        tabIndex: '0'
      };
      return _react2['default'].createElement(
        Tag,
        _extends({}, events, {
          className: cls,
          role: 'button',
          style: style
        }),
        _react2['default'].createElement('input', _extends({}, dataOrAriaAttributeProps(otherProps), {
          id: id,
          type: 'file',
          ref: this.saveFileInput,
          onClick: function onClick(e) {
            return e.stopPropagation();
          } // https://github.com/ant-design/ant-design/issues/19948
          , key: this.state.uid,
          style: { display: 'none' },
          accept: accept,
          directory: directory ? 'directory' : null,
          webkitdirectory: directory ? 'webkitdirectory' : null,
          multiple: multiple,
          onChange: this.onChange
        })),
        children
      );
    }
  }]);

  return AjaxUploader;
}(_react.Component);

exports['default'] = AjaxUploader;
module.exports = exports['default'];