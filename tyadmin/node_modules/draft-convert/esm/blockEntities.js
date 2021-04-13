import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import updateMutation from './util/updateMutation';
import rangeSort from './util/rangeSort';
import getElementHTML from './util/getElementHTML';
import getElementTagLength from './util/getElementTagLength';

var converter = function converter() {
  var entity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var originalText = arguments.length > 1 ? arguments[1] : undefined;
  return originalText;
};

export default (function (block, entityMap) {
  var entityConverter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : converter;

  var resultText = _toConsumableArray(block.text);

  var getEntityHTML = entityConverter;

  if (entityConverter.__isMiddleware) {
    getEntityHTML = entityConverter(converter);
  }

  if (Object.prototype.hasOwnProperty.call(block, 'entityRanges') && block.entityRanges.length > 0) {
    var entities = block.entityRanges.sort(rangeSort);
    var styles = block.inlineStyleRanges;

    var _loop = function _loop(index) {
      var entityRange = entities[index];
      var entity = entityMap[entityRange.key];
      var originalText = resultText.slice(entityRange.offset, entityRange.offset + entityRange.length).join('');
      var entityHTML = getEntityHTML(entity, originalText);
      var elementHTML = getElementHTML(entityHTML, originalText);
      var converted = void 0;

      if (!!elementHTML || elementHTML === '') {
        converted = _toConsumableArray(elementHTML);
      } else {
        converted = originalText;
      }

      var prefixLength = getElementTagLength(entityHTML, 'start');
      var suffixLength = getElementTagLength(entityHTML, 'end');

      var updateLaterMutation = function updateLaterMutation(mutation, mutationIndex) {
        if (mutationIndex > index || Object.prototype.hasOwnProperty.call(mutation, 'style')) {
          return updateMutation(mutation, entityRange.offset, entityRange.length, converted.length, prefixLength, suffixLength);
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
      resultText = [].concat(_toConsumableArray(resultText.slice(0, entityRange.offset)), _toConsumableArray(converted), _toConsumableArray(resultText.slice(entityRange.offset + entityRange.length)));
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
});