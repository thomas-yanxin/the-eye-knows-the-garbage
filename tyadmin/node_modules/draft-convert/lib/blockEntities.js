"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _updateMutation = _interopRequireDefault(require("./util/updateMutation"));

var _rangeSort = _interopRequireDefault(require("./util/rangeSort"));

var _getElementHTML = _interopRequireDefault(require("./util/getElementHTML"));

var _getElementTagLength = _interopRequireDefault(require("./util/getElementTagLength"));

var converter = function converter() {
  var entity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var originalText = arguments.length > 1 ? arguments[1] : undefined;
  return originalText;
};

var _default = function _default(block, entityMap) {
  var entityConverter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : converter;
  var resultText = (0, _toConsumableArray2["default"])(block.text);
  var getEntityHTML = entityConverter;

  if (entityConverter.__isMiddleware) {
    getEntityHTML = entityConverter(converter);
  }

  if (Object.prototype.hasOwnProperty.call(block, 'entityRanges') && block.entityRanges.length > 0) {
    var entities = block.entityRanges.sort(_rangeSort["default"]);
    var styles = block.inlineStyleRanges;

    var _loop = function _loop(index) {
      var entityRange = entities[index];
      var entity = entityMap[entityRange.key];
      var originalText = resultText.slice(entityRange.offset, entityRange.offset + entityRange.length).join('');
      var entityHTML = getEntityHTML(entity, originalText);
      var elementHTML = (0, _getElementHTML["default"])(entityHTML, originalText);
      var converted = void 0;

      if (!!elementHTML || elementHTML === '') {
        converted = (0, _toConsumableArray2["default"])(elementHTML);
      } else {
        converted = originalText;
      }

      var prefixLength = (0, _getElementTagLength["default"])(entityHTML, 'start');
      var suffixLength = (0, _getElementTagLength["default"])(entityHTML, 'end');

      var updateLaterMutation = function updateLaterMutation(mutation, mutationIndex) {
        if (mutationIndex > index || Object.prototype.hasOwnProperty.call(mutation, 'style')) {
          return (0, _updateMutation["default"])(mutation, entityRange.offset, entityRange.length, converted.length, prefixLength, suffixLength);
        }

        return mutation;
      };

      var updateLaterMutations = function updateLaterMutations(mutationList) {
        return mutationList.reduce(function (acc, mutation, mutationIndex) {
          var updatedMutation = updateLaterMutation(mutation, mutationIndex);

          if (Array.isArray(updatedMutation)) {
            return acc.concat(updatedMutation);
          }

          return acc.concat([updatedMutation]);
        }, []);
      };

      entities = updateLaterMutations(entities);
      styles = updateLaterMutations(styles);
      resultText = [].concat((0, _toConsumableArray2["default"])(resultText.slice(0, entityRange.offset)), (0, _toConsumableArray2["default"])(converted), (0, _toConsumableArray2["default"])(resultText.slice(entityRange.offset + entityRange.length)));
    };

    for (var index = 0; index < entities.length; index++) {
      _loop(index);
    }

    return Object.assign({}, block, {
      text: resultText.join(''),
      inlineStyleRanges: styles,
      entityRanges: entities
    });
  }

  return block;
};

exports["default"] = _default;