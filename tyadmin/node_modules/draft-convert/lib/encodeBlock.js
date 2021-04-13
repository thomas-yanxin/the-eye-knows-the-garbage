"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _updateMutation = _interopRequireDefault(require("./util/updateMutation"));

var _rangeSort = _interopRequireDefault(require("./util/rangeSort"));

var ENTITY_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '\n': '<br/>'
};

var _default = function _default(block) {
  var blockText = (0, _toConsumableArray2["default"])(block.text);
  var entities = block.entityRanges.sort(_rangeSort["default"]);
  var styles = block.inlineStyleRanges.sort(_rangeSort["default"]);
  var resultText = '';

  var _loop = function _loop(index) {
    var _char = blockText[index];

    if (ENTITY_MAP[_char] !== undefined) {
      var encoded = ENTITY_MAP[_char];
      var resultIndex = (0, _toConsumableArray2["default"])(resultText).length;
      resultText += encoded;

      var updateForChar = function updateForChar(mutation) {
        return (0, _updateMutation["default"])(mutation, resultIndex, _char.length, encoded.length, 0, 0);
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
};

exports["default"] = _default;