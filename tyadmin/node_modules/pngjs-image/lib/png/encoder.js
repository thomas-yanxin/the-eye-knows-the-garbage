// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Chunk = require('./chunk');

var CRC = require('./processor/crc');

var BufferedStream = require('./utils/bufferedStream');
var utils = require('./utils/utils');
var constants = require('./utils/constants');

var path = require('path');


/**
 * @class Encoder
 * @module PNG
 * @submodule PNGCore
 * @extends chunkUtils
 * @constructor
 */
var Encoder = function () {
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
Encoder.prototype.getChunkData = function () {
	return this._chunkData;
};


/**
 * Encodes the supplied data
 *
 * @method encode
 * @param {Buffer} image Image data
 * @param {int} width Width of image
 * @param {int} height Height of image
 * @param {object} [options] Optimization options
 */
Encoder.prototype.encode = function (image, width, height, options) {

	options = options || {};

	var i, len,
		stream,
		buffer = image,
		signature = constants.signature;

	this._chunks = {};
	this._chunkData = options;

	// Use optimization to figure out what format to safe it in
	this._optimize(buffer, width, height, options);

	// Run through all chunk-types (not chunks) to gather chunks
	// Phase 1 - Forward
	this.applyWithSortedChunks(function (chunk) {

		// Figure out which chunks we need for the image
		var chunks = Chunk.encodeTypeData(chunk.getType(), image, options, this._chunks);

		// Add all returned chunks
		chunks.forEach(function (chunk) {
			this.addChunk(chunk);
		}.bind(this));

	}.bind(this), false);

	// Run through all chunks before scaling
	// Phase 2 - Backward
	this.applyWithSortedChunks(function (chunk) {
		buffer = chunk.preEncode(buffer, options);
	}, true, true);


	// Run through all chunks after scaling
	// Phase 3 - Backward
	this.applyWithSortedChunks(function (chunk) {
		buffer = chunk.encode(buffer, options);
	}, true, true);


	// Write signature
	stream = new BufferedStream();
	for(i = 0, len = signature.length; i < len; i++) {
		stream.writeUInt8(signature[i], i);
	}

	// Write all chunks
	// Phase 4 - Forward - Write order
	this.applyWithSortedChunks(function (chunk) {
		this._encodeChunk(stream, chunk, options);
	}.bind(this), true, false);

	return stream.toBuffer(false);
};

/**
 * Encodes one chunk to the data stream
 *
 * @method _encodeChunk
 * @param {BufferedStream} stream Data stream
 * @param {Chunk} chunk Chunk that should be serialized to the stream
 * @param {object} options Encoding options
 * @private
 */
Encoder.prototype._encodeChunk = function (stream, chunk, options) {

	var crc,
		buffer,
		crcStartOffset, lengthOffset,
		chunkLength;

	// Write empty length for now
	lengthOffset = stream.writeOffset;
	stream.writeUInt32BE(0);

	// Write type but remember the start of it for CRC
	crcStartOffset = stream.writeOffset;
	if (chunk.getInternalType) { // Use this for unknown chunks
		stream.writeASCIIString(chunk.getInternalType());
	} else {
		stream.writeASCIIString(chunk.getType());
	}

	// Get the chunk-data and how much was written to the stream
	stream.writeCounter = 0;
	chunk.compose(stream, options);
	chunkLength = stream.writeCounter;

	// Calculate and write CRC
	buffer = stream.toBuffer(true);
	crc = new CRC();
	crc.write(buffer, crcStartOffset, chunkLength + 4); // Add chunk-type
	stream.writeInt32BE(crc.getValue());

	// Overwrite length
	buffer.writeUInt32BE(chunkLength, lengthOffset);
};

/**
 *
 * @method _optimize
 * @param {Buffer} image Image data
 * @param {int} width Width of image
 * @param {int} height Height of image
 * @param {object} options Encoding options
 * @private
 */
Encoder.prototype._optimize = function (image, width, height, options) {

	// Setup header data
	options.header = options.header || {};
	options.header.width = width;
	options.header.height = height;

	// Default configuration
	options.header.bitDepth = 8;
	options.header.colorType = 6; // True-color
	options.header.compression = 0; // Deflate
	options.header.filter = 0; // Default

	options.header.interlace = options.interlace || 0; // Default - non-streaming
};

module.exports = Encoder;
