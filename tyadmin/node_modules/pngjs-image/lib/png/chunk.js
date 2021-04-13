// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var utils = require('./utils/utils');
var path = require('path');

/**
 * @class Chunk
 * @module PNG
 * @submodule PNGCore
 * @extends chunkUtils
 * @param {string} type Chunk-type for loading the right chunk
 * @param {object} chunks Dictionary of available chunks
 * @constructor
 */
var Chunk = function (type, chunks) {
	this._chunks = chunks;

	// Import chunk
	Chunk.applyChunkType(type, this);
};


/**
 * Gets the chunk-type as string
 *
 * Note:
 * Identifier for chunk that is the string of the chunk-type.
 *
 * @method getType
 * @return {string|null}
 */
Chunk.prototype.getType = function () {
	return null;
};

/**
 * Gets the sequence
 *
 * Note:
 * This defines the sequence the chunk will have when all chunks are written to the blob.
 * Lowest sequence numbers will be written first.
 *
 * Range:
 * * 0 - Header
 * * 500 - Data
 * * 1000 - End
 *
 * @method getSequence
 * @return {int}
 */
Chunk.prototype.getSequence = function () {
	return 750;
};


/**
 * Is value an upper-case ASCII character?
 *
 * @method _isUpperCase
 * @param {int} value
 * @return {boolean}
 * @private
 */
Chunk.prototype._isUpperCase = function (value) {
	return !(value & 0x20); // 0x20 = 32 dec -> Lowercase has bit 32 set
};


/**
 * Is the chunk a critical chunk that cannot be ignored?
 *
 * @method isCritical
 * @return {boolean}
 */
Chunk.prototype.isCritical = function () {
	return this._isUpperCase(this.getType().charCodeAt(0));
};

/**
 * Is the chunk an ancillary chunk that can be ignored when unknown?
 *
 * @method isAncillary
 * @return {boolean}
 */
Chunk.prototype.isAncillary = function () {
	return !this.isCritical();
};


/**
 * Is the chunk a public chunk?
 *
 * @method isPublic
 * @return {boolean}
 */
Chunk.prototype.isPublic = function () {
	return this._isUpperCase(this.getType().charCodeAt(1));
};

/**
 * Is the chunk a private chunk?
 *
 * @method isPrivate
 * @return {boolean}
 */
Chunk.prototype.isPrivate = function () {
	return !this.isPublic();
};


/**
 * Is the data safe to copy?
 *
 * @method isSafe
 * @return {boolean}
 */
Chunk.prototype.isSafe = function () {
	return !this.isUnsafe();
};

/**
 * Is the data safe to copy?
 *
 * @method isUnsafe
 * @return {boolean}
 */
Chunk.prototype.isUnsafe = function () {
	return this._isUpperCase(this.getType().charCodeAt(3));
};


/**
 * Parsing of chunk data
 *
 * Phase 1
 *
 * Note:
 * Use this methods to parse data for each chunk.
 *
 * @method parse
 * @param {BufferedStream} stream Data stream
 * @param {int} length Length of chunk data
 * @param {boolean} strict Should parsing be strict?
 * @param {object} options Decoding options
 */
Chunk.prototype.parse = function (stream, length, strict, options) {
	throw new Error('Unimplemented method "parse".');
};

/**
 * Decoding of chunk data before scaling
 *
 * Phase 2
 *
 * Note:
 * Use this method when you have to do some preliminary
 * modifications to the image or data like decompression,
 * applying of changes before the image is scaled, etc.
 *
 * @method decode
 * @param {Buffer} image
 * @param {boolean} strict Should parsing be strict?
 * @param {object} options Decoding options
 * @return {Buffer}
 */
Chunk.prototype.decode = function (image, strict, options) {
	// Do nothing by default
	return image;
};

/**
 * Re-working of image after scaling
 *
 * Phase 3
 *
 * Note:
 * Use this method to add modifications to the scaled image.
 *
 * @method postDecode
 * @param {Buffer} image
 * @param {boolean} strict Should parsing be strict?
 * @param {object} options Decoding options
 * @return {Buffer}
 */
Chunk.prototype.postDecode = function (image, strict, options) {
	// Do nothing by default
	return image;
};

/**
 * Finalizing image - applying changes to completed image
 *
 * Phase 4
 *
 * @method finalizeDecode
 * @param {Buffer} image
 * @param {boolean} strict Should parsing be strict?
 * @param {object} options Decoding options
 * @return {Buffer}
 */
Chunk.prototype.finalizeDecode = function (image, strict, options) {
	// Do nothing by default
	return image;
};

/**
 * Decodes chunk-data to an external data-object
 *
 * Phase 5
 *
 * Note:
 * Use this method to export data to the data-object.
 *
 * @static
 * @method decodeData
 * @param {object} decodeData Data-object that will be used to export values
 * @param {boolean} strict Should parsing be strict?
 * @param {object} options Decoding options
 */
Chunk.prototype.decodeData = function (decodeData, strict, options) {
	// Do nothing by default
};


/**
 * Encodes chunk-data from an external data-object
 *
 * Phase 1
 *
 * Note:
 * Use this method to import data from the data-object.
 *
 * @static
 * @method encodeData
 * @param {object} options Encoding options
 * @return {Chunk[]} List of chunks to encode
 */
Chunk.prototype.encodeData = function (options) {
	// Do nothing by default
	return [];
};

/**
 * Before encoding of chunk data
 *
 * Phase 2
 *
 * Note:
 * Use this method to gather image-data before scaling.
 *
 * @method preEncode
 * @param {Buffer} image
 * @param {object} options Encoding options
 * @return {Buffer}
 */
Chunk.prototype.preEncode = function (image, options) {
	// Do nothing by default
	return image;
};

/**
 * Encoding of chunk data
 *
 * Phase 3
 *
 * Note:
 * Use this method to add data to the image after scaling.
 *
 * @method encode
 * @param {Buffer} image
 * @param {object} options Encoding options
 * @return {Buffer}
 */
Chunk.prototype.encode = function (image, options) {
	// Do nothing by default
	return image;
};

/**
 * Composing of image data
 *
 * Phase 4
 *
 * Note:
 * Use this method to compose each chunks data.
 *
 * @method compose
 * @param {BufferedStream} stream Data stream
 * @param {object} options Encoding options
 */
Chunk.prototype.compose = function (stream, options) {
	throw new Error('Unimplemented method "compose".');
};


/**
 * Registry
 *
 * @static
 * @type {object}
 * @private
 */
Chunk._registry = {};

/**
 * Modifies the data-object with the contents of the decoded chunks
 *
 * @static
 * @method decodeTypeData
 * @param {string} type Chunk-type
 * @param {object} decodeData Object that will holds all the data from the decoded chunks
 * @param {object} chunks Dictionary of already decoded chunks
 * @param {boolean} strict Should parsing be strict?
 * @param {object} [options]
 */
Chunk.decodeTypeData = function (type, decodeData, chunks, strict, options) {
	var methods = this.getChunkType(type);

	if (!methods) {
		throw new Error('Unknown chunk-type ' + type);
	}

	if (methods.decodeData) {
		methods._staticChunks = chunks;
		methods.decodeData(decodeData, strict, options);
	}
};

/**
 * Determines a list of chunks to encode of the same type from the data-object
 *
 * @static
 * @method encodeTypeData
 * @param {string} type Chunk-type
 * @param {Buffer} image Image data
 * @param {object} options Encoding options
 * @param {object} chunks Dictionary of already determined chunks
 * @return {Chunk[]} List of chunks to encode
 */
Chunk.encodeTypeData = function (type, image, options, chunks) {
	var methods = this.getChunkType(type);

	if (!methods) {
		throw new Error('Unknown chunk-type ' + type);
	}

	if (methods.encodeData) {
		methods._staticChunks = chunks;
		return methods.encodeData(image, options);
	} else {
		return [];
	}
};

/**
 * Adds a new chunk-type to the registry
 *
 * @static
 * @method addChunkType
 * @param {string} type Name of the chunk
 * @param {object} module List of methods specific for the chunk-type
 */
Chunk.addChunkType = function (type, module) {

	// Add utils
	utils.loadModule(path.join(__dirname, 'utils', 'chunkUtils.js'), module);

	// This is needed for static access!!!
	module.getType = function () {
		return type;
	};

	this._registry[type] = module;
};

/**
 * Gets a specific chunk-type module, listing all chunk-type specific methods
 *
 * @static
 * @method getChunkType
 * @param {string} type Name of the chunk
 * @return {object} Chunk module
 */
Chunk.getChunkType = function (type) {
	return this._registry[type];
};

/**
 * Gets a list of registered chunk types
 *
 * @static
 * @method getChunkTypes
 * @return {string[]}
 */
Chunk.getChunkTypes = function () {

	var result = [],
		i;

	for (i in this._registry) {
		if (this._registry.hasOwnProperty(i)) {
			result.push(i);
		}
	}

	return result;
};

/**
 * Applies the chunk-module on an object
 *
 * @static
 * @method applyChunkType
 * @param {string} type Name of the chunk
 * @param {object} obj Object the module to apply to
 */
Chunk.applyChunkType = function (type, obj) {
	var methods = this.getChunkType(type),
		unknownType = false;

	// Use default chunk for unknown types
	if (!methods) {
		methods = this.getChunkType('zzZz');
		unknownType = type;
		type = 'zzZz';
	}

	if (methods) {
		utils.copyModule(methods, obj);

		// Remember the original type if it is an unknown chunk-type
		if (unknownType) {
			obj.setInternalType(unknownType);
		}

		// This is needed for dynamic access, specifically for the default chunk!!!
		obj.getType = function () {
			return type;
		};

	} else {
		throw new Error('Unknown chunk-type ' + type);
	}
};

/**
 * Initializes all official chunk types
 *
 * @static
 * @method initDefaultChunkTypes
 */
Chunk.initDefaultChunkTypes = function () {
	var chunks = [
			'bKGD', 'cHRM', 'gAMA', 'hIST', 'iCCP', 'IDAT', 'IEND', 'IHDR', // 'iTXt'
			'pHYs', 'PLTE', 'sRGB', 'tEXt', 'tIME', 'tRNS', 'zTXt', // 'sBIT', 'sPLT'
			'oFFs', 'sCAL', 'sTER' // 'pCAL'
		],
		module;

	chunks.forEach(function (chunkType) {
		module = require(path.join(__dirname, 'chunks', chunkType));
		this.addChunkType(chunkType, module);
	}.bind(this));
};

/**
 * Initializes all known custom chunk types
 *
 * @static
 * @method initCustomChunkTypes
 */
Chunk.initCustomChunkTypes = function () {
	var chunks = ['stRT', 'jsOn', 'zzZz'],
		module;

	chunks.forEach(function (chunkType) {
		module = require(path.join(__dirname, 'custom', chunkType));
		this.addChunkType(chunkType, module);
	}.bind(this));
};

// Initialize
Chunk.initDefaultChunkTypes();
Chunk.initCustomChunkTypes();

module.exports = Chunk;
