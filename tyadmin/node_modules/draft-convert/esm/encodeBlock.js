import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import updateMutation from './util/updateMutation';
import rangeSort from './util/rangeSort';
var ENTITY_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '\n': '<br/>'
};
export default (function (block) {
  var blockText = _toConsumableArray(block.text);

  var entities = block.entityRanges.sort(rangeSort);
  var styles = block.inlineStyleRanges.sort(rangeSort);
  var resultText = '';

  var _loop = function _loop(index) {
    var _char = blockText[index];

    if (ENTITY_MAP[_char] !== undefined) {
      var encoded = ENTITY_MAP[_char];

      var resultIndex = _toConsumableArray(resultText).length;

      resultText += encoded;

      var updateForChar = function updateForChar(mutation) {
        return updateMutation(mutation, resultIndex, _char.length, encoded.length, 0, 0);
      };

      entities = entities.map(updateForChar);
      styles = styles.map(updateForChar);
    } else {
      resultText += _char;
    }
  };

  for (var index = 0; index < blockText.length; index++) {
    _loop(index);
  }

  return Object.assign({}, block, {
    text: resultText,
    inlineStyleRanges: styles,
    entityRanges: entities
  });
});