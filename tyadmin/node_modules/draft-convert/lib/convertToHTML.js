"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _invariant = _interopRequireDefault(require("invariant"));

var _react = _interopRequireDefault(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _draftJs = require("draft-js");

var _encodeBlock = _interopRequireDefault(require("./encodeBlock"));

var _blockEntities = _interopRequireDefault(require("./blockEntities"));

var _blockInlineStyles = _interopRequireDefault(require("./blockInlineStyles"));

var _accumulateFunction = _interopRequireDefault(require("./util/accumulateFunction"));

var _blockTypeObjectFunction = _interopRequireDefault(require("./util/blockTypeObjectFunction"));

var _getBlockTags = _interopRequireDefault(require("./util/getBlockTags"));

var _getNestedBlockTags = _interopRequireDefault(require("./util/getNestedBlockTags"));

var _defaultBlockHTML = _interopRequireDefault(require("./default/defaultBlockHTML"));

// import Immutable from 'immutable'; // eslint-disable-line no-unused-vars
var defaultEntityToHTML = function defaultEntityToHTML(entity, originalText) {
  return originalText;
};

var convertToHTML = function convertToHTML(_ref) {
  var _ref$styleToHTML = _ref.styleToHTML,
      styleToHTML = _ref$styleToHTML === void 0 ? {} : _ref$styleToHTML,
      _ref$blockToHTML = _ref.blockToHTML,
      blockToHTML = _ref$blockToHTML === void 0 ? {} : _ref$blockToHTML,
      _ref$entityToHTML = _ref.entityToHTML,
      entityToHTML = _ref$entityToHTML === void 0 ? defaultEntityToHTML : _ref$entityToHTML;
  return function (contentState) {
    (0, _invariant["default"])(contentState !== null && contentState !== undefined, 'Expected contentState to be non-null');
    var getBlockHTML;

    if (blockToHTML.__isMiddleware === true) {
      getBlockHTML = blockToHTML((0, _blockTypeObjectFunction["default"])(_defaultBlockHTML["default"]));
    } else {
      getBlockHTML = (0, _accumulateFunction["default"])((0, _blockTypeObjectFunction["default"])(blockToHTML), (0, _blockTypeObjectFunction["default"])(_defaultBlockHTML["default"]));
    }

    var rawState = (0, _draftJs.convertToRaw)(contentState);
    var listStack = [];
    var result = rawState.blocks.map(function (block) {
      var type = block.type,
          depth = block.depth;
      var closeNestTags = '';
      var openNestTags = '';
      var blockHTMLResult = getBlockHTML(block);

      if (!blockHTMLResult) {
        throw new Error("convertToHTML: missing HTML definition for block with type ".concat(block.type));
      }

      if (!blockHTMLResult.nest) {
        // this block can't be nested, so reset all nesting if necessary
        closeNestTags = listStack.reduceRight(function (string, nestedBlock) {
          return string + (0, _getNestedBlockTags["default"])(getBlockHTML(nestedBlock), depth).nestEnd;
        }, '');
        listStack = [];
      } else {
        while (depth + 1 !== listStack.length || type !== listStack[depth].type) {
          if (depth + 1 === listStack.length) {
            // depth is right but doesn't match type
            var blockToClose = listStack[depth];
            closeNestTags += (0, _getNestedBlockTags["default"])(getBlockHTML(blockToClose), depth).nestEnd;
            openNestTags += (0, _getNestedBlockTags["default"])(getBlockHTML(block), depth).nestStart;
            listStack[depth] = block;
          } else if (depth + 1 < listStack.length) {
            var _blockToClose = listStack[listStack.length - 1];
            closeNestTags += (0, _getNestedBlockTags["default"])(getBlockHTML(_blockToClose), depth).nestEnd;
            listStack = listStack.slice(0, -1);
          } else {
            openNestTags += (0, _getNestedBlockTags["default"])(getBlockHTML(block), depth).nestStart;
            listStack.push(block);
          }
        }
      }

      var innerHTML = (0, _blockInlineStyles["default"])((0, _blockEntities["default"])((0, _encodeBlock["default"])(block), rawState.entityMap, entityToHTML), styleToHTML);
      var blockHTML = (0, _getBlockTags["default"])(getBlockHTML(block));
      var html;

      if (typeof blockHTML === 'string') {
        html = blockHTML;
      } else {
        html = blockHTML.start + innerHTML + blockHTML.end;
      }

      if (innerHTML.length === 0 && Object.prototype.hasOwnProperty.call(blockHTML, 'empty')) {
        if (_react["default"].isValidElement(blockHTML.empty)) {
          html = _server["default"].renderToStaticMarkup(blockHTML.empty);
        } else {
          html = blockHTML.empty;
        }
      }

      return closeNestTags + openNestTags + html;
    }).join('');
    result = listStack.reduce(function (res, nestBlock) {
      return res + (0, _getNestedBlockTags["default"])(getBlockHTML(nestBlock), nestBlock.depth).nestEnd;
    }, result);
    return result;
  };
};

var _default = function _default() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 1 && Object.prototype.hasOwnProperty.call(args[0], '_map') && args[0].getBlockMap != null) {
    // skip higher-order function and use defaults
    return convertToHTML({}).apply(void 0, args);
  }

  return convertToHTML.apply(void 0, args);
};

exports["default"] = _default;