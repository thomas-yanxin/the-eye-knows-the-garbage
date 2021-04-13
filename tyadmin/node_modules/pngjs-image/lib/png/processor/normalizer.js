// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var BufferedStream = require('../utils/bufferedStream');

/**
 * @class Normalizer
 * @module PNG
 * @submodule PNGCore
 * @param {Chunk} headerChunk Header chunk of data stream
 * @param {object} [options] Options for the compressor
 * @constructor
 */
var Normalizer = function (headerChunk, options) {
	this._headerChunk = headerChunk;
	this._options = options || {};
};

/**
 * Gets the options
 *
 * @method getOptions
 * @return {object}
 */
Normalizer.prototype.getOptions = function () {
	return this._options;
};


/**
 * Gets the header chunk
 *
 * @method getHeaderChunk
 * @return {Chunk}
 */
Normalizer.prototype.getHeaderChunk = function () {
	return this._headerChunk;
};


/**
 * Encodes color values of an image
 *
 * @method encode
 * @param {Buffer} image
 */
Normalizer.prototype.encode = function (image) {
	return image;
	//TODO: Writing is currently only 8-bit
};


/**
 * Determines the max number for a bit-depth
 *
 * @method _determineMaxValue
 * @return {int}
 * @private
 */
Normalizer.prototype._determineMaxValue = function () {

	var headerChunk = this.getHeaderChunk(),
		result;

	if (headerChunk.isColorTypeIndexedColor()) {
		result = 255;

	} else {
		switch (headerChunk.getBitDepth()) {

			case 1:
				result = 1;
				break;

			case 2:
				result = 3;
				break;

			case 4:
				result = 15;
				break;

			case 8:
				result = 255;
				break;

			case 16:
				result = 65535;
				break;
		}
	}

	return result;
};

/**
 * Determines the writer according to header data
 *
 * @method _determineWriter
 * @return {object}
 * @private
 */
Normalizer.prototype._determineWriter = function () {

	var headerChunk = this.getHeaderChunk(),
		isColor, hasAlpha, isIndexed,
		result = null;

	isColor = headerChunk.isColor();
	hasAlpha = headerChunk.hasAlphaChannel();
	isIndexed = headerChunk.isColorTypeIndexedColor();

	if (isIndexed) {
		result = {
			valuesNeeded: 1,
			writer: '_writeInIndexedBytes'
		};

	} else {

		if (isColor) {
			if (hasAlpha) {
				result = {
					valuesNeeded: 4,
					writer: '_writeInColorAlphaBytes'
				};
			} else {
				result = {
					valuesNeeded: 3,
					writer: '_writeInColorNoAlphaBytes'
				};
			}
		} else {
			if (hasAlpha) {
				result = {
					valuesNeeded: 2,
					writer: '_writeInNoColorAlphaBytes'
				};
			} else {
				result = {
					valuesNeeded: 1,
					writer: '_writeInNoColorNoAlphaBytes'
				};
			}
		}
	}

	return result;
};

/**
 * Decodes color values
 *
 * @method decode
 * @param {Buffer} image
 * @return {Buffer}
 */
Normalizer.prototype.decode = function (image) {

	var writerInfo,
		maxValue,
		offset = 0,
		len = image.length,
		internalImageSize = this.getHeaderChunk().getImageSizeInBytes() * 2, // 16-bit

		imageStream, outputStream;

	writerInfo = this._determineWriter();

	// Skip normalization since nothing needs to be done here.
	if (writerInfo.valuesNeeded === 4) {
		return image;
	}

	maxValue = this._determineMaxValue();

	imageStream = new BufferedStream(image, false);
	outputStream = new BufferedStream(null, null, internalImageSize);

	while (len > offset) {
		this[writerInfo.writer](imageStream, outputStream, maxValue);
		offset += writerInfo.valuesNeeded * 2;
	}

	return outputStream.toBuffer();
};


/**
 * Write bytes when image is color and has already an alpha-channel
 *
 * @method _writeInColorAlphaBytes
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 * @private
 */
Normalizer.prototype._writeInColorAlphaBytes = function (input, output) {
	output.writeUInt16BE(input.readUInt16BE());
	output.writeUInt16BE(input.readUInt16BE());
	output.writeUInt16BE(input.readUInt16BE());
	output.writeUInt16BE(input.readUInt16BE());
};

/**
 * Write bytes when image is color and has no alpha-channel
 *
 * @method _writeInColorNoAlphaBytes
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 * @param {int} maxValue Max value for bit-depth
 * @private
 */
Normalizer.prototype._writeInColorNoAlphaBytes = function (input, output, maxValue) {
	output.writeUInt16BE(input.readUInt16BE());
	output.writeUInt16BE(input.readUInt16BE());
	output.writeUInt16BE(input.readUInt16BE());
	output.writeUInt16BE(maxValue);
};

/**
 * Write bytes when image is grayNormalizer and has already an alpha-channel
 *
 * @method _writeInNoColorAlphaBytes
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 * @private
 */
Normalizer.prototype._writeInNoColorAlphaBytes = function (input, output) {
	var value = input.readUInt16BE();
	output.writeUInt16BE(value);
	output.writeUInt16BE(value);
	output.writeUInt16BE(value);
	output.writeUInt16BE(input.readUInt16BE());
};

/**
 * Write bytes when image is grayNormalizer and has no alpha-channel
 *
 * @method _writeInNoColorNoAlphaBytes
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 * @param {int} maxValue Max value for bit-depth
 * @private
 */
Normalizer.prototype._writeInNoColorNoAlphaBytes = function (input, output, maxValue) {
	var value = input.readUInt16BE();
	output.writeUInt16BE(value);
	output.writeUInt16BE(value);
	output.writeUInt16BE(value);
	output.writeUInt16BE(maxValue);
};

/**
 * Write bytes when image is indexed on a palette
 *
 * @method _writeInIndexedBytes
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 * @param {int} maxValue Max value for bit-depth
 * @private
 */
Normalizer.prototype._writeInIndexedBytes = function (input, output, maxValue) {
	var value = input.readUInt16BE();
	output.writeUInt16BE(value);
	output.writeUInt16BE(value);
	output.writeUInt16BE(value);
	output.writeUInt16BE(maxValue);
};

module.exports = Normalizer;
