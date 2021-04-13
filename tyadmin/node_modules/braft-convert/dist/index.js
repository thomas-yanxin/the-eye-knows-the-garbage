'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertRawToEditorState = exports.convertEditorStateToRaw = exports.convertHTMLToEditorState = exports.convertEditorStateToHTML = exports.convertHTMLToRaw = exports.convertRawToHTML = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _draftConvert = require('draft-convert');

var _configs = require('./configs');

var _draftJs = require('draft-js');

var defaultConvertOptions = {
  fontFamilies: _configs.defaultFontFamilies
};

var convertRawToHTML = exports.convertRawToHTML = function convertRawToHTML(rawContent, options) {

  options = _extends({}, defaultConvertOptions, options);

  try {
    var contentState = (0, _draftJs.convertFromRaw)(rawContent);
    options.contentState = contentState;
    return (0, _draftConvert.convertToHTML)((0, _configs.getToHTMLConfig)(options))(contentState);
  } catch (error) {
    console.warn(error);
    return '';
  }
};

var convertHTMLToRaw = exports.convertHTMLToRaw = function convertHTMLToRaw(HTMLString, options, source) {

  options = _extends({}, defaultConvertOptions, options);

  try {
    var contentState = (0, _draftConvert.convertFromHTML)((0, _configs.getFromHTMLConfig)(options, source))(HTMLString);
    return (0, _draftJs.convertToRaw)(contentState);
  } catch (error) {
    console.warn(error);
    return {};
  }
};

var convertEditorStateToHTML = exports.convertEditorStateToHTML = function convertEditorStateToHTML(editorState, options) {

  options = _extends({}, defaultConvertOptions, options);

  try {
    var contentState = editorState.getCurrentContent();
    options.contentState = contentState;
    return (0, _draftConvert.convertToHTML)((0, _configs.getToHTMLConfig)(options))(contentState);
  } catch (error) {
    console.warn(error);
    return '';
  }
};

var convertHTMLToEditorState = exports.convertHTMLToEditorState = function convertHTMLToEditorState(HTMLString, editorDecorators, options, source) {

  options = _extends({}, defaultConvertOptions, options);

  try {
    return _draftJs.EditorState.createWithContent((0, _draftConvert.convertFromHTML)((0, _configs.getFromHTMLConfig)(options, source))(HTMLString), editorDecorators);
  } catch (error) {
    console.warn(error);
    return _draftJs.EditorState.createEmpty(editorDecorators);
  }
};

var convertEditorStateToRaw = exports.convertEditorStateToRaw = function convertEditorStateToRaw(editorState) {
  return (0, _draftJs.convertToRaw)(editorState.getCurrentContent());
};

var convertRawToEditorState = exports.convertRawToEditorState = function convertRawToEditorState(rawContent, editorDecorators) {

  try {
    return _draftJs.EditorState.createWithContent((0, _draftJs.convertFromRaw)(rawContent), editorDecorators);
  } catch (error) {
    console.warn(error);
    return _draftJs.EditorState.createEmpty(editorDecorators);
  }
};
//# sourceMappingURL=index.js.map