// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Interlace = require('./interlace');
var BufferedStream = require('../utils/bufferedStream');

/**
 * @class Scanline Parser
 * @module PNG
 * @submodule PNGCore
 * @param {Chunk} headerChunk Header chunk of data stream
 * @param {object} [options] Options for the compressor
 * @constructor
 */
var Parser = function (headerChunk, options) {
	this._headerChunk = headerChunk;
	this._options = options || {};
};

/**
 * Gets the options
 *
 * @method getOptions
 * @return {object}
 */
Parser.prototype.getOptions = function () {
	return this._options;
};


/**
 * Gets the header chunk
 *
 * @method getHeaderChunk
 * @return {Chunk}
 */
Parser.prototype.getHeaderChunk = function () {
	return this._headerChunk;
};


/**
 * Encodes an image
 *
 * @method encoder
 * @param {Buffer} image
 * @return {Buffer}
 */
Parser.prototype.encoder = function (image) {
	return image;
	//TODO: Writing is currently only 8-bit
};


/**
 * Determines the scanline-parser factory according to header data
 *
 * @method _determineParserFactory
 * @return {object}
 * @private
 */
Parser.prototype._determineParserFactory = function () {

	var headerChunk = this.getHeaderChunk(),
		result = null;

	switch (headerChunk.getBitDepth()) {
		case 1:
			result = '_parse1bit';
			break;

		case 2:
			result = '_parse2bit';
			break;

		case 4:
			result = '_parse4bit';
			break;

		case 8:
			result = '_parse8bit';
			break;

		case 16:
			result = '_parse16bit';
			break;
	}

	return result;
};

/**
 * Decodes an image
 *
 * @method decoder
 * @param {Buffer} image
 * @return {Buffer} 16-bit image
 */
Parser.prototype.decode = function (image) {

	var headerChunk = this.getHeaderChunk(),
		interlace = new Interlace(headerChunk),

		imageStream, outputStream,

		bitDepth = headerChunk.getBitDepth(),
		internalImageSize = headerChunk.getImageSizeInBytes() * 2, // 16-bit
		parser;

	imageStream = new BufferedStream(image, false);
	outputStream = new BufferedStream(null, null, internalImageSize);

	parser = this._determineParserFactory();

	interlace.processPasses(function (width, height, scanLineLength) {

		var i,
			paddingAt,
			length,
			parserFn;

		length = scanLineLength * height;

		paddingAt = headerChunk.scanLineWithWidthPaddingAt(width);
		parserFn = this[parser](paddingAt);

		if (bitDepth === 16) {
			for(i = 0; i < length; i += 2) {
				parserFn(imageStream.readUInt16BE(), outputStream);
			}
		} else {
			for(i = 0; i < length; i += 1) {
				parserFn(imageStream.readUInt8(), outputStream);
			}
		}

	}.bind(this));

	return outputStream.toBuffer();
};

/**
 * Parses a 1-bit scanline stream
 *
 * @method _parse1bit
 * @param {number} paddingAt Defines the position of padding within each scanline
 * @return {function}
 * @private
 */
Parser.prototype._parse1bit = function (paddingAt) {

	var byteCounter = 0;

	return function (value, output) {

		output.writeUInt16BE((value >> 7) & 1); byteCounter++;
		if (!paddingAt || byteCounter < paddingAt) {
			output.writeUInt16BE((value >> 6) & 1);
			byteCounter++;
		}
		if (!paddingAt || byteCounter < paddingAt) {
			output.writeUInt16BE((value >> 5) & 1);
			byteCounter++;
		}
		if (!paddingAt || byteCounter < paddingAt) {
			output.writeUInt16BE((value >> 4) & 1);
			byteCounter++;
		}
		if (!paddingAt || byteCounter < paddingAt) {
			output.writeUInt16BE((value >> 3) & 1);
			byteCounter++;
		}
		if (!paddingAt || byteCounter < paddingAt) {
			output.writeUInt16BE((value >> 2) & 1);
			byteCounter++;
		}
		if (!paddingAt || byteCounter < paddingAt) {
			output.writeUInt16BE((value >> 1) & 1);
			byteCounter++;
		}
		if (!paddingAt || byteCounter < paddingAt) {
			output.writeUInt16BE(value & 1);
			byteCounter++;
		}

		// Make sure that padding is removed
		if (paddingAt && byteCounter >= paddingAt) {
			byteCounter = 0;
		}
	};
};

/**
 * Parses a 2-bit scanline stream
 *
 * @method _parse2bit
 * @param {number} paddingAt Defines the position of padding within each scanline
 * @return {function}
 * @private
 */
Parser.prototype._parse2bit = function (paddingAt) {

	var byteCounter = 0;

	return function (value, output) {

		output.writeUInt16BE((value >> 6) & 3); byteCounter++;
		if (!paddingAt || byteCounter < paddingAt) {
			output.writeUInt16BE((value >> 4) & 3);
			byteCounter++;
		}
		if (!paddingAt || byteCounter < paddingAt) {
			output.writeUInt16BE((value >> 2) & 3);
			byteCounter++;
		}
		if (!paddingAt || byteCounter < paddingAt) {
			output.writeUInt16BE(value & 3);
			byteCounter++;
		}

		// Make sure that padding is removed
		if (paddingAt && byteCounter >= paddingAt) {
			byteCounter = 0;
		}
	};
};

/**
 * Parses a 4-bit scanline stream
 *
 * @method _parse4bit
 * @param {number} paddingAt Defines the position of padding within each scanline
 * @return {function}
 * @private
 */
Parser.prototype._parse4bit = function (paddingAt) {

	var byteCounter = 0;

	return function (value, output) {

		output.writeUInt16BE((value >> 4) & 15); byteCounter++;
		if (!paddingAt || byteCounter < paddingAt) {
			output.writeUInt16BE(value & 15);
			byteCounter++;
		}

		// Make sure that padding is removed
		if (paddingAt && byteCounter >= paddingAt) {
			byteCounter = 0;
		}
	};
};

/**
 * Parses a 8-bit scanline stream
 *
 * @method _parse8bit
 * @return {function}
 * @private
 */
Parser.prototype._parse8bit = function () {
	return function (value, output) {
		output.writeUInt16BE(value);
	};
};

/**
 * Parses a 16-bit scanline stream
 *
 * @method _parse16bit
 * @return {function}
 * @private
 */
Parser.prototype._parse16bit = function () {
	return function (value, output) {
		output.writeUInt16BE(value);
	};
};

module.exports = Parser;
