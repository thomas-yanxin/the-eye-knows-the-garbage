// import Immutable from 'immutable'; // eslint-disable-line no-unused-vars
import invariant from 'invariant';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { convertToRaw } from 'draft-js';
import encodeBlock from './encodeBlock';
import blockEntities from './blockEntities';
import blockInlineStyles from './blockInlineStyles';
import accumulateFunction from './util/accumulateFunction';
import blockTypeObjectFunction from './util/blockTypeObjectFunction';
import getBlockTags from './util/getBlockTags';
import getNestedBlockTags from './util/getNestedBlockTags';
import defaultBlockHTML from './default/defaultBlockHTML';

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
    invariant(contentState !== null && contentState !== undefined, 'Expected contentState to be non-null');
    var getBlockHTML;

    if (blockToHTML.__isMiddleware === true) {
      getBlockHTML = blockToHTML(blockTypeObjectFunction(defaultBlockHTML));
    } else {
      getBlockHTML = accumulateFunction(blockTypeObjectFunction(blockToHTML), blockTypeObjectFunction(defaultBlockHTML));
    }

    var rawState = convertToRaw(contentState);
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
          return string + getNestedBlockTags(getBlockHTML(nestedBlock), depth).nestEnd;
        }, '');
        listStack = [];
      } else {
        while (depth + 1 !== listStack.length || type !== listStack[depth].type) {
          if (depth + 1 === listStack.length) {
            // depth is right but doesn't match type
            var blockToClose = listStack[depth];
            closeNestTags += getNestedBlockTags(getBlockHTML(blockToClose), depth).nestEnd;
            openNestTags += getNestedBlockTags(getBlockHTML(block), depth).nestStart;
            listStack[depth] = block;
          } else if (depth + 1 < listStack.length) {
            var _blockToClose = listStack[listStack.length - 1];
            closeNestTags += getNestedBlockTags(getBlockHTML(_blockToClose), depth).nestEnd;
            listStack = listStack.slice(0, -1);
          } else {
            openNestTags += getNestedBlockTags(getBlockHTML(block), depth).nestStart;
            listStack.push(block);
          }
        }
      }

      var innerHTML = blockInlineStyles(blockEntities(encodeBlock(block), rawState.entityMap, entityToHTML), styleToHTML);
      var blockHTML = getBlockTags(getBlockHTML(block));
      var html;

      if (typeof blockHTML === 'string') {
        html = blockHTML;
      } else {
        html = blockHTML.start + innerHTML + blockHTML.end;
      }

      if (innerHTML.length === 0 && Object.prototype.hasOwnProperty.call(blockHTML, 'empty')) {
        if (React.isValidElement(blockHTML.empty)) {
          html = ReactDOMServer.renderToStaticMarkup(blockHTML.empty);
        } else {
          html = blockHTML.empty;
        }
      }

      return closeNestTags + openNestTags + html;
    }).join('');
    result = listStack.reduce(function (res, nestBlock) {
      return res + getNestedBlockTags(getBlockHTML(nestBlock), nestBlock.depth).nestEnd;
    }, result);
    return result;
  };
};

export default (function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 1 && Object.prototype.hasOwnProperty.call(args[0], '_map') && args[0].getBlockMap != null) {
    // skip higher-order function and use defaults
    return convertToHTML({}).apply(void 0, args);
  }

  return convertToHTML.apply(void 0, args);
});