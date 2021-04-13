// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Chunk = require('./chunk');

var CRC = require('./processor/crc');

var BufferedStream = require('./utils/bufferedStream');
var utils = require('./utils/utils');
var constants = require('./utils/constants');

var path = require('path');


/**
 * @class Decoder
 * @module PNG
 * @submodule PNGCore
 * @extends chunkUtils
 * @constructor
 */
var Decoder = function () {
	this._chunks = {};
	this._chunkData = {};

	utils.loadModule(path.join(__dirname, 'utils', 'chunkUtils.js'), this);
};


/**
 * Gets the data supplied by each chunk
 *
 * @method getChunkData
 * @return {object}
 */
Decoder.prototype.getChunkData = function () {
	return this._chunkData;
};


/**
 * Decodes the supplied data
 *
 * @method decode
 * @param {Buffer} buffer Image data
 * @param {object} [options] Decoding options
 * @param {boolean} [options.strict=false] Strict decoding
 */
Decoder.prototype.decode = function (buffer, options) {

	options = options || {};

	var i, len,
		chunk, image = null,
		signature = constants.signature,
		streamSignature,
		strict = !!options.strict,
		stream = new BufferedStream(buffer, false);

	this._chunks = {};
	this._chunkData = {};

	// Check signature
	streamSignature = stream.readBuffer(signature.length);
	for (i = 0, len = signature.length; i < len; i++) {
		if (streamSignature[i] !== signature[i]) {
			// Always throw error (even with strict=false) - need to be sure it is a PNG
			throw new Error('Invalid signature for a PNG image.');
		}
	}

	// Load all chunks until end is reached
	// Phase 1 - Forward
	do {
		chunk = this._parseChunk(stream, strict, options);
	} while (chunk.getType() !== 'IEND');

	// Run through all chunks before scaling
	// Phase 2 - Forward
	this.applyWithSortedChunks(function (chunk) {

		try {
			image = chunk.decode(image, strict, options);

		} catch (err) {

			// Ignore non-critical errors - not required for image reading
			// If strict is requested, then re-throw
			if (strict || chunk.isCritical()) {
				throw err;
			}
		}
	}, true);

	// Run through all chunks after scaling
	// Phase 3 - Forward
	this.applyWithSortedChunks(function (chunk) {

		try {
			image = chunk.postDecode(image, strict, options);

		} catch (err) {

			// Ignore non-critical errors - not required for image reading
			// If strict is requested, then re-throw
			if (strict || chunk.isCritical()) {
				throw err;
			}
		}
	}, true);

	// Run through all chunks after image is complete
	// Phase 4 - Forward
	this.applyWithSortedChunks(function (chunk) {

		try {
			image = chunk.finalizeDecode(image, strict, options);

		} catch (err) {

			// Ignore non-critical errors - not required for image reading
			// If strict is requested, then re-throw
			if (strict || chunk.isCritical()) {
				throw err;
			}
		}
	}, true);

	// Run through all chunks-types (not chunks) to gather chunk-data
	// Phase 5 - Forward
	this.applyWithSortedChunks(function (chunk) {
		Chunk.decodeTypeData(chunk.getType(), this._chunkData, this._chunks, strict, options);
	}.bind(this), false);

	return image;
};

/**
 * Reads the next chunk in the stream
 *
 * @method _parseChunk
 * @param {BufferedStream} stream Data stream
 * @param {boolean} strict Should decoding be strict?
 * @param {object} options Decoding options
 * @return {Chunk} Chunk read
 * @private
 */
Decoder.prototype._parseChunk = function (stream, strict, options) {

	var chunkLength,
		chunkType,
		chunkCrc,
		calculatedCrc,
		crc,
		chunk,
		chunkOffset;

	// Read chunk-length
	chunkLength = stream.readUInt32BE();
	if (chunkLength + 8 > stream.length) {
		throw new Error('Chunk length is greater than the input data.');
	}
	chunkOffset = stream.readOffset + chunkLength + 8; // 8 for type and CRC value

	// Load chunk for crc calculation
	crc = new CRC();
	crc.write(stream.toBuffer(true), stream.readOffset, chunkLength + 4); // Including chunk-type

	// Create chunk that is suggested by the data
	chunkType = stream.readString(4, 'ascii');
	chunk = new Chunk(chunkType, this._chunks);

	try {

		// Parsing of chunk data
		chunk.parse(stream, chunkLength, strict, options);

		// Load crc and compare with calculated one
		chunkCrc = stream.readInt32BE();
		calculatedCrc = crc.getValue();
		if (strict && (chunkCrc !== calculatedCrc)) {
			//throw new Error('CRC error.');
			//TODO: Something is not working; overflow?
		}

		// Add to parsed chunks
		this.addChunk(chunk);

	} catch (err) {

		// Ignore non-critical errors - not required for image reading
		// If strict is requested, then re-throw
		if (strict || chunk.isCritical()) {
			throw err;
		}
	} finally {
		// Make sure the chunk did not read over bounds - resetting of reader offset
		stream.readOffset = chunkOffset;
	}

	return chunk;
};

module.exports = Decoder;
