// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var BufferedStream = require('../utils/bufferedStream');

/**
 * @class Scaler
 * @module PNG
 * @submodule PNGCore
 * @param {Chunk} headerChunk Header chunk of data stream
 * @param {object} [options] Options for the compressor
 * @constructor
 */
var Scaler = function (headerChunk, options) {
	this._headerChunk = headerChunk;
	this._options = options || {};
};

/**
 * Gets the options
 *
 * @method getOptions
 * @return {object}
 */
Scaler.prototype.getOptions = function () {
	return this._options;
};


/**
 * Scaler factor for 1-to-8-bit value conversion
 *
 * @static
 * @property SCALE_FACTOR_1_TO_8_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_1_TO_8_BIT = 255;

/**
 * Scaler factor for 8-to-1-bit value conversion
 *
 * @static
 * @property SCALE_FACTOR_8_TO_1_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_8_TO_1_BIT = 1 / 255;

/**
 * Scaler factor for 2-to-8-bit value conversion
 *
 * @static
 * @property SCALE_FACTOR_2_TO_8_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_2_TO_8_BIT = 255 / 3;

/**
 * Scaler factor for 8-to-2-bit value conversion
 *
 * @static
 * @property SCALE_FACTOR_8_TO_2_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_8_TO_2_BIT = 3 / 255;

/**
 * Scaler factor for 4-to-8-bit value conversion
 *
 * @static
 * @property SCALE_FACTOR_4_TO_8_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_4_TO_8_BIT = 255 / 15;

/**
 * Scaler factor for 8-to-4-bit value conversion
 *
 * @static
 * @property SCALE_FACTOR_8_TO_4_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_8_TO_4_BIT = 15 / 255;

/**
 * Scaler factor for 8-to-8-bit value conversion - identity
 *
 * @static
 * @property SCALE_FACTOR_8_TO_8_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_8_TO_8_BIT = 1;

/**
 * Scaler factor for 16-to-8-bit value conversion
 *
 * @static
 * @property SCALE_FACTOR_16_TO_8_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_16_TO_8_BIT = 255 / 65535;

/**
 * Scaler factor for 8-to-16-bit value conversion
 *
 * @static
 * @property SCALE_FACTOR_8_TO_16_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_8_TO_16_BIT = 65535 / 255;


/**
 * Gets the header chunk
 *
 * @method getHeaderChunk
 * @return {Chunk}
 */
Scaler.prototype.getHeaderChunk = function () {
	return this._headerChunk;
};


/**
 * Encodes color values of an image
 *
 * @method encode
 * @param {Buffer} image
 * @return {Buffer}
 */
Scaler.prototype.encode = function (image) {
	return image;
	//TODO: Writing is currently only 8-bit
};

/**
 * Determines the scaler according to header data
 *
 * @method _determineScaler
 * @return {object}
 * @private
 */
Scaler.prototype._determineScaler = function () {

	var headerChunk = this.getHeaderChunk(),
		isIndexed, bitDepth,

		result = null;

	isIndexed = headerChunk.isColorTypeIndexedColor();
	bitDepth = headerChunk.getBitDepth();

	switch (bitDepth) {
		case 1:
			result = isIndexed ? 1 : Scaler.SCALE_FACTOR_1_TO_8_BIT;
			break;

		case 2:
			result = isIndexed ? 1 : Scaler.SCALE_FACTOR_2_TO_8_BIT;
			break;

		case 4:
			result = isIndexed ? 1 : Scaler.SCALE_FACTOR_4_TO_8_BIT;
			break;

		case 8:
			result = isIndexed ? 1 : Scaler.SCALE_FACTOR_8_TO_8_BIT;
			break;

		case 16:
			result = Scaler.SCALE_FACTOR_16_TO_8_BIT;
			break;
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
Scaler.prototype.decode = function (image) {

	var headerChunk = this.getHeaderChunk(),

		imageStream, outputStream,

		scaleFactor,
		offset = 0,
		is16Bit,

		samplesPerPixel = 4,
		len = image.length, // Since the image is here 16-bit
		i;

	imageStream = new BufferedStream(image, false);
	outputStream = new BufferedStream(null, null, headerChunk.getImageSizeInBytes());

	is16Bit = (this.getHeaderChunk().getBitDepth() == 16);

	scaleFactor = this._determineScaler();

	while (len > offset) {

		for(i = 0; i < samplesPerPixel; i++) {
			if (is16Bit) {
				outputStream.writeUInt8(Math.floor((imageStream.readUInt16BE() * scaleFactor) + 0.5));
			} else {
				outputStream.writeUInt8(imageStream.readUInt16BE() * scaleFactor);
			}
		}

		offset += samplesPerPixel * 2;
	}

	return outputStream.toBuffer(true);
};

/**
 * Scales a value according to the header
 *
 * @method decodeValue
 * @param {number} value
 * @return {number}
 */
Scaler.prototype.decodeValue = function (value) {

	var bitDepth = this.getHeaderChunk().getBitDepth(),
		result = null;

	switch(bitDepth) {

		case 1:
			result = value * Scaler.SCALE_FACTOR_1_TO_8_BIT;
			break;

		case 2:
			result = value * Scaler.SCALE_FACTOR_2_TO_8_BIT;
			break;

		case 4:
			result = value * Scaler.SCALE_FACTOR_4_TO_8_BIT;
			break;

		case 8:
			result = value * Scaler.SCALE_FACTOR_8_TO_8_BIT;
			break;

		case 16:
			result = value * Scaler.SCALE_FACTOR_16_TO_8_BIT;
			break;
	}

	result = Math.floor(result);

	return result;
};

/**
 * Scales a value according to the header
 *
 * @method encodeValue
 * @param {number} value
 * @return {number}
 */
Scaler.prototype.encodeValue = function (value) {

	var bitDepth = this.getHeaderChunk().getBitDepth(),
		result = null;

	switch(bitDepth) {

		case 1:
			result = value * Scaler.SCALE_FACTOR_8_TO_1_BIT;
			break;

		case 2:
			result = value * Scaler.SCALE_FACTOR_8_TO_2_BIT;
			break;

		case 4:
			result = value * Scaler.SCALE_FACTOR_8_TO_4_BIT;
			break;

		case 8:
			result = value * Scaler.SCALE_FACTOR_8_TO_8_BIT;
			break;

		case 16:
			result = value * Scaler.SCALE_FACTOR_8_TO_16_BIT;
			break;
	}

	result = Math.ceil(result);

	return result;
};

module.exports = Scaler;
