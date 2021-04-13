'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redo = exports.undo = exports.handleKeyCommand = exports.clear = exports.setMediaPosition = exports.removeMedia = exports.setMediaData = exports.insertMedias = exports.insertHorizontalLine = exports.insertAtomicBlock = exports.insertHTML = exports.insertText = exports.toggleSelectionLetterSpacing = exports.toggleSelectionFontFamily = exports.toggleSelectionLineHeight = exports.toggleSelectionFontSize = exports.toggleSelectionBackgroundColor = exports.toggleSelectionColor = exports.decreaseSelectionIndent = exports.increaseSelectionIndent = exports.toggleSelectionIndent = exports.toggleSelectionAlignment = exports.removeSelectionInlineStyles = exports.toggleSelectionInlineStyle = exports.selectionHasInlineStyle = exports.getSelectionInlineStyle = exports.toggleSelectionLink = exports.toggleSelectionEntity = exports.getSelectionEntityData = exports.getSelectionEntityType = exports.toggleSelectionBlockType = exports.getSelectionText = exports.getSelectionBlockType = exports.getSelectionBlockData = exports.setSelectionBlockData = exports.getSelectedBlocks = exports.updateEachCharacterOfSelection = exports.getSelectionBlock = exports.removeBlock = exports.selectNextBlock = exports.selectBlock = exports.selectionContainsStrictBlock = exports.selectionContainsBlockType = exports.isSelectionCollapsed = exports.createEditorState = exports.createEmptyEditorState = exports.isEditorState = exports.registerStrictBlockType = undefined;

var _draftJs = require('draft-js');

var _draftjsUtils = require('draftjs-utils');

var _braftConvert = require('braft-convert');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var strictBlockTypes = ['atomic'];

var registerStrictBlockType = exports.registerStrictBlockType = function registerStrictBlockType(blockType) {
  strictBlockTypes.indexOf(blockType) === -1 && strictBlockTypes.push(blockType);
};

var isEditorState = exports.isEditorState = function isEditorState(editorState) {
  return editorState instanceof _draftJs.EditorState;
};

var createEmptyEditorState = exports.createEmptyEditorState = function createEmptyEditorState(editorDecorators) {
  return _draftJs.EditorState.createEmpty(editorDecorators);
};

var createEditorState = exports.createEditorState = function createEditorState(contentState, editorDecorators) {
  return _draftJs.EditorState.createWithContent(contentState, editorDecorators);
};

var isSelectionCollapsed = exports.isSelectionCollapsed = function isSelectionCollapsed(editorState) {
  return editorState.getSelection().isCollapsed();
};

var selectionContainsBlockType = exports.selectionContainsBlockType = function selectionContainsBlockType(editorState, blockType) {
  return getSelectedBlocks(editorState).find(function (block) {
    return block.getType() === blockType;
  });
};

var selectionContainsStrictBlock = exports.selectionContainsStrictBlock = function selectionContainsStrictBlock(editorState) {
  return getSelectedBlocks(editorState).find(function (block) {
    return ~strictBlockTypes.indexOf(block.getType());
  });
};

var selectBlock = exports.selectBlock = function selectBlock(editorState, block) {

  var blockKey = block.getKey();

  return _draftJs.EditorState.forceSelection(editorState, new _draftJs.SelectionState({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: block.getLength()
  }));
};

var selectNextBlock = exports.selectNextBlock = function selectNextBlock(editorState, block) {
  var nextBlock = editorState.getCurrentContent().getBlockAfter(block.getKey());
  return nextBlock ? selectBlock(editorState, nextBlock) : editorState;
};

var removeBlock = exports.removeBlock = function removeBlock(editorState, block) {
  var lastSelection = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;


  var nextContentState = void 0,
      nextEditorState = void 0;
  var blockKey = block.getKey();

  nextContentState = _draftJs.Modifier.removeRange(editorState.getCurrentContent(), new _draftJs.SelectionState({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: block.getLength()
  }), 'backward');

  nextContentState = _draftJs.Modifier.setBlockType(nextContentState, nextContentState.getSelectionAfter(), 'unstyled');
  nextEditorState = _draftJs.EditorState.push(editorState, nextContentState, 'remove-range');
  return _draftJs.EditorState.forceSelection(nextEditorState, lastSelection || nextContentState.getSelectionAfter());
};

var getSelectionBlock = exports.getSelectionBlock = function getSelectionBlock(editorState) {
  return editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getAnchorKey());
};

var updateEachCharacterOfSelection = exports.updateEachCharacterOfSelection = function updateEachCharacterOfSelection(editorState, callback) {

  var selectionState = editorState.getSelection();
  var contentState = editorState.getCurrentContent();
  var contentBlocks = contentState.getBlockMap();
  var selectedBlocks = getSelectedBlocks(editorState);

  if (selectedBlocks.length === 0) {
    return editorState;
  }

  var startKey = selectionState.getStartKey();
  var startOffset = selectionState.getStartOffset();
  var endKey = selectionState.getEndKey();
  var endOffset = selectionState.getEndOffset();

  var nextContentBlocks = contentBlocks.map(function (block) {

    if (selectedBlocks.indexOf(block) === -1) {
      return block;
    }

    var blockKey = block.getKey();
    var charactersList = block.getCharacterList();
    var nextCharactersList = null;

    if (blockKey === startKey && blockKey === endKey) {
      nextCharactersList = charactersList.map(function (character, index) {
        if (index >= startOffset && index < endOffset) {
          return callback(character);
        }
        return character;
      });
    } else if (blockKey === startKey) {
      nextCharactersList = charactersList.map(function (character, index) {
        if (index >= startOffset) {
          return callback(character);
        }
        return character;
      });
    } else if (blockKey === endKey) {
      nextCharactersList = charactersList.map(function (character, index) {
        if (index < endOffset) {
          return callback(character);
        }
        return character;
      });
    } else {
      nextCharactersList = charactersList.map(function (character) {
        return callback(character);
      });
    }

    return block.merge({
      'characterList': nextCharactersList
    });
  });

  return _draftJs.EditorState.push(editorState, contentState.merge({
    blockMap: nextContentBlocks,
    selectionBefore: selectionState,
    selectionAfter: selectionState
  }), 'update-selection-character-list');
};

var getSelectedBlocks = exports.getSelectedBlocks = function getSelectedBlocks(editorState) {

  var selectionState = editorState.getSelection();
  var contentState = editorState.getCurrentContent();

  var startKey = selectionState.getStartKey();
  var endKey = selectionState.getEndKey();
  var isSameBlock = startKey === endKey;
  var startingBlock = contentState.getBlockForKey(startKey);
  var selectedBlocks = [startingBlock];

  if (!isSameBlock) {
    var blockKey = startKey;

    while (blockKey !== endKey) {
      var nextBlock = contentState.getBlockAfter(blockKey);
      selectedBlocks.push(nextBlock);
      blockKey = nextBlock.getKey();
    }
  }

  return selectedBlocks;
};

var setSelectionBlockData = exports.setSelectionBlockData = function setSelectionBlockData(editorState, blockData, override) {

  var newBlockData = override ? blockData : Object.assign({}, getSelectionBlockData(editorState).toJS(), blockData);

  Object.keys(newBlockData).forEach(function (key) {
    if (newBlockData.hasOwnProperty(key) && newBlockData[key] === undefined) {
      delete newBlockData[key];
    }
  });

  return (0, _draftjsUtils.setBlockData)(editorState, newBlockData);
};

var getSelectionBlockData = exports.getSelectionBlockData = function getSelectionBlockData(editorState, name) {
  var blockData = getSelectionBlock(editorState).getData();
  return name ? blockData.get(name) : blockData;
};

var getSelectionBlockType = exports.getSelectionBlockType = function getSelectionBlockType(editorState) {
  return getSelectionBlock(editorState).getType();
};

var getSelectionText = exports.getSelectionText = function getSelectionText(editorState) {

  var selectionState = editorState.getSelection();
  var contentState = editorState.getCurrentContent();

  if (selectionState.isCollapsed() || getSelectionBlockType(editorState) === 'atomic') {
    return '';
  }

  var anchorKey = selectionState.getAnchorKey();
  var currentContentBlock = contentState.getBlockForKey(anchorKey);
  var start = selectionState.getStartOffset();
  var end = selectionState.getEndOffset();

  return currentContentBlock.getText().slice(start, end);
};

var toggleSelectionBlockType = exports.toggleSelectionBlockType = function toggleSelectionBlockType(editorState, blockType) {

  if (selectionContainsStrictBlock(editorState)) {
    return editorState;
  }

  return _draftJs.RichUtils.toggleBlockType(editorState, blockType);
};

var getSelectionEntityType = exports.getSelectionEntityType = function getSelectionEntityType(editorState) {

  var entityKey = (0, _draftjsUtils.getSelectionEntity)(editorState);

  if (entityKey) {
    var entity = editorState.getCurrentContent().getEntity(entityKey);
    return entity ? entity.get('type') : null;
  }

  return null;
};

var getSelectionEntityData = exports.getSelectionEntityData = function getSelectionEntityData(editorState, type) {

  var entityKey = (0, _draftjsUtils.getSelectionEntity)(editorState);

  if (entityKey) {
    var entity = editorState.getCurrentContent().getEntity(entityKey);
    if (entity && entity.get('type') === type) {
      return entity.getData();
    } else {
      return {};
    }
  } else {
    return {};
  }
};

var toggleSelectionEntity = exports.toggleSelectionEntity = function toggleSelectionEntity(editorState, entity) {

  var contentState = editorState.getCurrentContent();
  var selectionState = editorState.getSelection();

  if (selectionState.isCollapsed() || getSelectionBlockType(editorState) === 'atomic') {
    return editorState;
  }

  if (!entity || !entity.type || getSelectionEntityType(editorState) === entity.type) {
    return _draftJs.EditorState.push(editorState, _draftJs.Modifier.applyEntity(contentState, selectionState, null), 'apply-entity');
  }

  try {

    var nextContentState = contentState.createEntity(entity.type, entity.mutability, entity.data);
    var entityKey = nextContentState.getLastCreatedEntityKey();

    var nextEditorState = _draftJs.EditorState.set(editorState, {
      currentContent: nextContentState
    });

    return _draftJs.EditorState.push(nextEditorState, _draftJs.Modifier.applyEntity(nextContentState, selectionState, entityKey), 'apply-entity');
  } catch (error) {
    console.warn(error);
    return editorState;
  }
};

var toggleSelectionLink = exports.toggleSelectionLink = function toggleSelectionLink(editorState, href, target) {

  var contentState = editorState.getCurrentContent();
  var selectionState = editorState.getSelection();

  var entityData = { href: href, target: target };

  if (selectionState.isCollapsed() || getSelectionBlockType(editorState) === 'atomic') {
    return editorState;
  }

  if (href === false) {
    return _draftJs.RichUtils.toggleLink(editorState, selectionState, null);
  }

  if (href === null) {
    delete entityData.href;
  }

  try {

    var nextContentState = contentState.createEntity('LINK', 'MUTABLE', entityData);
    var entityKey = nextContentState.getLastCreatedEntityKey();

    var nextEditorState = _draftJs.EditorState.set(editorState, {
      currentContent: nextContentState
    });

    nextEditorState = _draftJs.RichUtils.toggleLink(nextEditorState, selectionState, entityKey);
    nextEditorState = _draftJs.EditorState.forceSelection(nextEditorState, selectionState.merge({
      anchorOffset: selectionState.getEndOffset(),
      focusOffset: selectionState.getEndOffset()
    }));

    nextEditorState = _draftJs.EditorState.push(nextEditorState, _draftJs.Modifier.insertText(nextEditorState.getCurrentContent(), nextEditorState.getSelection(), ''), 'insert-text');

    return nextEditorState;
  } catch (error) {
    console.warn(error);
    return editorState;
  }
};

var getSelectionInlineStyle = exports.getSelectionInlineStyle = function getSelectionInlineStyle(editorState) {
  return editorState.getCurrentInlineStyle();
};

var selectionHasInlineStyle = exports.selectionHasInlineStyle = function selectionHasInlineStyle(editorState, style) {
  return getSelectionInlineStyle(editorState).has(style.toUpperCase());
};

var toggleSelectionInlineStyle = exports.toggleSelectionInlineStyle = function toggleSelectionInlineStyle(editorState, style) {
  var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';


  var nextEditorState = editorState;
  style = prefix + style.toUpperCase();

  if (prefix) {

    nextEditorState = updateEachCharacterOfSelection(nextEditorState, function (characterMetadata) {

      return characterMetadata.toJS().style.reduce(function (characterMetadata, characterStyle) {
        if (characterStyle.indexOf(prefix) === 0 && style !== characterStyle) {
          return _draftJs.CharacterMetadata.removeStyle(characterMetadata, characterStyle);
        } else {
          return characterMetadata;
        }
      }, characterMetadata);
    });
  }

  return _draftJs.RichUtils.toggleInlineStyle(nextEditorState, style);
};

var removeSelectionInlineStyles = exports.removeSelectionInlineStyles = function removeSelectionInlineStyles(editorState) {

  return updateEachCharacterOfSelection(editorState, function (characterMetadata) {
    return characterMetadata.merge({
      style: _immutable2.default.OrderedSet([])
    });
  });
};

var toggleSelectionAlignment = exports.toggleSelectionAlignment = function toggleSelectionAlignment(editorState, alignment) {
  return setSelectionBlockData(editorState, {
    textAlign: getSelectionBlockData(editorState, 'textAlign') !== alignment ? alignment : undefined
  });
};

var toggleSelectionIndent = exports.toggleSelectionIndent = function toggleSelectionIndent(editorState, textIndent) {
  var maxIndent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 6;

  return textIndent < 0 || textIndent > maxIndent || isNaN(textIndent) ? editorState : setSelectionBlockData(editorState, {
    textIndent: textIndent || undefined
  });
};

var increaseSelectionIndent = exports.increaseSelectionIndent = function increaseSelectionIndent(editorState) {
  var maxIndent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;

  var currentIndent = getSelectionBlockData(editorState, 'textIndent') || 0;
  return toggleSelectionIndent(editorState, currentIndent + 1, maxIndent);
};

var decreaseSelectionIndent = exports.decreaseSelectionIndent = function decreaseSelectionIndent(editorState) {
  var currentIndent = getSelectionBlockData(editorState, 'textIndent') || 0;
  return toggleSelectionIndent(editorState, currentIndent - 1);
};

var toggleSelectionColor = exports.toggleSelectionColor = function toggleSelectionColor(editorState, color) {
  return toggleSelectionInlineStyle(editorState, color.replace('#', ''), 'COLOR-');
};

var toggleSelectionBackgroundColor = exports.toggleSelectionBackgroundColor = function toggleSelectionBackgroundColor(editorState, color) {
  return toggleSelectionInlineStyle(editorState, color.replace('#', ''), 'BGCOLOR-');
};

var toggleSelectionFontSize = exports.toggleSelectionFontSize = function toggleSelectionFontSize(editorState, fontSize) {
  return toggleSelectionInlineStyle(editorState, fontSize, 'FONTSIZE-');
};

var toggleSelectionLineHeight = exports.toggleSelectionLineHeight = function toggleSelectionLineHeight(editorState, lineHeight) {
  return toggleSelectionInlineStyle(editorState, lineHeight, 'LINEHEIGHT-');
};

var toggleSelectionFontFamily = exports.toggleSelectionFontFamily = function toggleSelectionFontFamily(editorState, fontFamily) {
  return toggleSelectionInlineStyle(editorState, fontFamily, 'FONTFAMILY-');
};

var toggleSelectionLetterSpacing = exports.toggleSelectionLetterSpacing = function toggleSelectionLetterSpacing(editorState, letterSpacing) {
  return toggleSelectionInlineStyle(editorState, letterSpacing, 'LETTERSPACING-');
};

var insertText = exports.insertText = function insertText(editorState, text, inlineStyle, entity) {

  var selectionState = editorState.getSelection();
  var currentSelectedBlockType = getSelectionBlockType(editorState);

  if (currentSelectedBlockType === 'atomic') {
    return editorState;
  }

  var entityKey = void 0;
  var contentState = editorState.getCurrentContent();

  if (entity && entity.type) {
    contentState = contentState.createEntity(entity.type, entity.mutability || 'MUTABLE', entity.data || entityData);
    entityKey = contentState.getLastCreatedEntityKey();
  }

  if (!selectionState.isCollapsed()) {
    return _draftJs.EditorState.push(editorState, _draftJs.Modifier.replaceText(contentState, selectionState, text, inlineStyle, entityKey), 'replace-text');
  } else {
    return _draftJs.EditorState.push(editorState, _draftJs.Modifier.insertText(contentState, selectionState, text, inlineStyle, entityKey), 'insert-text');
  }
};

var insertHTML = exports.insertHTML = function insertHTML(editorState, htmlString, source) {

  if (!htmlString) {
    return editorState;
  }

  var selectionState = editorState.getSelection();
  var contentState = editorState.getCurrentContent();
  var options = editorState.convertOptions || {};

  try {
    var _convertFromRaw = (0, _draftJs.convertFromRaw)((0, _braftConvert.convertHTMLToRaw)(htmlString, options, source)),
        blockMap = _convertFromRaw.blockMap;

    return _draftJs.EditorState.push(editorState, _draftJs.Modifier.replaceWithFragment(contentState, selectionState, blockMap), 'insert-fragment');
  } catch (error) {
    console.warn(error);
    return editorState;
  }
};

var insertAtomicBlock = exports.insertAtomicBlock = function insertAtomicBlock(editorState, type) {
  var immutable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};


  if (selectionContainsStrictBlock(editorState)) {
    return insertAtomicBlock(selectNextBlock(editorState, getSelectionBlock(editorState)), type, immutable, data);
  }

  var selectionState = editorState.getSelection();
  var contentState = editorState.getCurrentContent();

  if (!selectionState.isCollapsed() || getSelectionBlockType(editorState) === 'atomic') {
    return editorState;
  }

  var contentStateWithEntity = contentState.createEntity(type, immutable ? 'IMMUTABLE' : 'MUTABLE', data);
  var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  var newEditorState = _draftJs.AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');

  return newEditorState;
};

var insertHorizontalLine = exports.insertHorizontalLine = function insertHorizontalLine(editorState) {
  return insertAtomicBlock(editorState, 'HR');
};

var insertMedias = exports.insertMedias = function insertMedias(editorState) {
  var medias = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];


  if (!medias.length) {
    return editorState;
  }

  return medias.reduce(function (editorState, media) {
    var url = media.url,
        link = media.link,
        link_target = media.link_target,
        name = media.name,
        type = media.type,
        width = media.width,
        height = media.height,
        meta = media.meta;

    return insertAtomicBlock(editorState, type, true, { url: url, link: link, link_target: link_target, name: name, type: type, width: width, height: height, meta: meta });
  }, editorState);
};

var setMediaData = exports.setMediaData = function setMediaData(editorState, entityKey, data) {
  return _draftJs.EditorState.push(editorState, editorState.getCurrentContent().mergeEntityData(entityKey, data), 'change-block-data');
};

var removeMedia = exports.removeMedia = function removeMedia(editorState, mediaBlock) {
  return removeBlock(editorState, mediaBlock);
};

var setMediaPosition = exports.setMediaPosition = function setMediaPosition(editorState, mediaBlock, position) {

  var newPosition = {};
  var float = position.float,
      alignment = position.alignment;


  if (typeof float !== 'undefined') {
    newPosition.float = mediaBlock.getData().get('float') === float ? null : float;
  }

  if (typeof alignment !== 'undefined') {
    newPosition.alignment = mediaBlock.getData().get('alignment') === alignment ? null : alignment;
  }

  return setSelectionBlockData(selectBlock(editorState, mediaBlock), newPosition);
};

var clear = exports.clear = function clear(editorState) {

  var contentState = editorState.getCurrentContent();

  var firstBlock = contentState.getFirstBlock();
  var lastBlock = contentState.getLastBlock();

  var allSelected = new _draftJs.SelectionState({
    anchorKey: firstBlock.getKey(),
    anchorOffset: 0,
    focusKey: lastBlock.getKey(),
    focusOffset: lastBlock.getLength(),
    hasFocus: true
  });

  return _draftJs.RichUtils.toggleBlockType(_draftJs.EditorState.push(editorState, _draftJs.Modifier.removeRange(contentState, allSelected, 'backward'), 'remove-range'), 'unstyled');
};

var handleKeyCommand = exports.handleKeyCommand = function handleKeyCommand(editorState, command) {
  return _draftJs.RichUtils.handleKeyCommand(editorState, command);
};

var undo = exports.undo = function undo(editorState) {
  return _draftJs.EditorState.undo(editorState);
};

var redo = exports.redo = function redo(editorState) {
  return _draftJs.EditorState.redo(editorState);
};