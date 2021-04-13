// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Interlace = require('./interlace');
var Compressor = require('./compressor');

/**
 * @class Filter
 * @module PNG
 * @submodule PNGCore
 * @param {Chunk} headerChunk Header chunk of data stream
 * @param {object} [options] Options for the compressor
 * @constructor
 */
var Filter = function (headerChunk, options) {
	this._headerChunk = headerChunk;
	this._options = options || {};
};

/**
 * Gets the options
 *
 * @method getOptions
 * @return {object}
 */
Filter.prototype.getOptions = function () {
	return this._options;
};


/**
 * Gets the header chunk
 *
 * @method getHeaderChunk
 * @return {Chunk}
 */
Filter.prototype.getHeaderChunk = function () {
	return this._headerChunk;
};


/**
 * Applies filters to the data
 *
 * @method encode
 * @param {Buffer} image
 * @return {Buffer}
 */
Filter.prototype.encode = function (image) {

	var headerChunk = this.getHeaderChunk(),
		interlace = new Interlace(headerChunk),

		bytesPerPixel = headerChunk.getBytesPerPixel(),
		bytesPerPosition = Math.max(1, bytesPerPixel),

		outputData,
		length = 0,
		info = {},
		options = this.getOptions();

	// Determine required size of buffer
	interlace.processPasses(function (width, height, scanLineLength) {
		length += (scanLineLength + 1) * height;
	});

	outputData = new Buffer(length);

	// Process each interlace pass (or only one for non-interlaced images)
	interlace.processPasses(function (width, height, scanLineLength) {

		info = {
			inputData: image,
			inputOffset: info.inputOffset || 0,

			outputData: outputData,
			outputOffset: info.outputOffset || 0,

			bytesPerPosition: bytesPerPosition,

			scanLineLength: scanLineLength,
			scanLines: height,

			previousLineOffset: null
		};

		this._encode(info, options);

	}.bind(this));

	return outputData;
};

/**
 * Applies filters to the data
 *
 * @method _encode
 * @param {object} info Information for filtering process
 * @param {object} options Options for encoding
 * @private
 */
Filter.prototype._encode = function (info, options) {

	var filterType = options.filter || 0,
		filterMapping;

	// Reverse mapping for filter-types
	filterMapping = {
		0: this._encodeNone,
		1: this._encodeSub,
		2: this._encodeUp,
		3: this._encodeAverage,
		4: this._encodePaeth,
		5: this._optimalEncode // Auto
	};

	// Validate options given
	if (!filterMapping[filterType]) {
		throw new Error('Unknown filter-type ' + filterType + ' was selected.');
	}

	// Run through all scanlines
	for (var y = 0; y < info.scanLines; y++) {

		// Reverse per filter-type
		filterMapping[filterType].call(this, info, options);

		info.previousLineOffset = info.inputOffset;
		info.inputOffset += info.scanLineLength;
		info.outputOffset += info.scanLineLength + 1;
	}
};

/**
 * Applies the optimal filter to the data
 *
 * Note:
 *  Since it compresses only a subset of the data, this might not be really the optimal filter.
 *  But, it is close enough.
 *
 * @method _optimalEncode
 * @param {object} info Information for filtering process
 * @param {object} options Options for encoding
 * @private
 */
Filter.prototype._optimalEncode = function (info, options) {

	var filterList = [4, 3, 2, 1, 0],
		filterType,
		filterMapping,

		compressor = new Compressor(options),

		length,
		lowestSize = null,
		lowestFilter = 0,

		// Backup of real data
		originalOutputData = info.outputData,
		originalOutputOffset = info.outputOffset;


	// Reverse mapping for actual filter-types
	filterMapping = {
		0: this._encodeNone,
		1: this._encodeSub,
		2: this._encodeUp,
		3: this._encodeAverage,
		4: this._encodePaeth
	};

	// Create temp buffer for size testing
	info.outputData = new Buffer(info.scanLineLength + 1);
	info.outputOffset = 0;

	// Walk through all filters to see which one is the best one
	while(filterList.length > 0) {

		// Use next filter in the list
		filterType = filterList.pop();
		filterMapping[filterType].call(this, info);

		// Trial compress
		length = compressor.encode(info.outputData).length;

		// Is this the best filter for the compression? (Prefer low complexity filters)
		if ((lowestSize === null) || (lowestSize > length)) {
			lowestSize = length;
			lowestFilter = filterType;
		}
	}

	// Recover original data
	info.outputData = originalOutputData;
	info.outputOffset = originalOutputOffset;

	// Apply optimal filter
	filterMapping[lowestFilter].call(this, info);
};

/**
 * Applies no filter at all - this is just a pass-through
 *
 * @method _encodeNone
 * @param {object} info
 * @private
 */
Filter.prototype._encodeNone = function (info) {
	info.outputData[info.outputOffset] = 0;
	info.inputData.copy(info.outputData, info.outputOffset + 1, info.inputOffset, info.inputOffset + info.scanLineLength);
};

/**
 * Applies the Sub filter
 *
 * @method _encodeSub
 * @param {object} info
 * @private
 */
Filter.prototype._encodeSub = function (info) {
	info.outputData[info.outputOffset] = 1;
	for (var x = 0; x < info.scanLineLength; x++) {
		info.outputData[info.outputOffset + x + 1] = this._getInputPixel(info, x) - this._getLeftInputPixel(info, x);
	}
};

/**
 * Applies the Up filter
 *
 * @method _encodeUp
 * @param {object} info
 * @private
 */
Filter.prototype._encodeUp = function (info) {
	info.outputData[info.outputOffset] = 2;
	for (var x = 0; x < info.scanLineLength; x++) {
		info.outputData[info.outputOffset + x + 1] = this._getInputPixel(info, x) - this._getTopInputPixel(info, x);
	}
};

/**
 * Applies the Average filter
 *
 * @method _encodeAverage
 * @param {object} info
 * @private
 */
Filter.prototype._encodeAverage = function (info) {
	info.outputData[info.outputOffset] = 3;
	for (var x = 0; x < info.scanLineLength; x++) {
		info.outputData[info.outputOffset + x + 1] = this._getInputPixel(info, x) - Math.floor((this._getLeftInputPixel(info, x) + this._getTopInputPixel(info, x)) / 2);
	}
};

/**
 * Applies the Paeth filter
 *
 * @method _encodePaeth
 * @param {object} info
 * @private
 */
Filter.prototype._encodePaeth = function (info) {
	info.outputData[info.outputOffset] = 4;
	for (var x = 0; x < info.scanLineLength; x++) {
		info.outputData[info.outputOffset + x + 1] = this._getInputPixel(info, x) - this._paethPredictor(
			this._getLeftInputPixel(info, x),
			this._getTopInputPixel(info, x),
			this._getTopLeftInputPixel(info, x)
		);
	}
};


/**
 * Reverses all filters
 *
 * @method decode
 * @param {Buffer} image
 * @return {Buffer} Reversed data
 */
Filter.prototype.decode = function (image) {

	var headerChunk = this.getHeaderChunk(),
		interlace = new Interlace(headerChunk),

		bytesPerPixel = headerChunk.getBytesPerPixel(),
		bytesPerPosition = Math.max(1, bytesPerPixel),

		outputData,
		length = 0,
		info = {},
		options = this.getOptions();

	// Determine required size of buffer
	interlace.processPasses(function (width, height, scanLineLength) {
		length += scanLineLength * height;
	});

	outputData = new Buffer(length);

	// Process each interlace pass (or only one for non-interlaced images)
	interlace.processPasses(function (width, height, scanLineLength) {

		info = {
			inputData: image,
			inputOffset: info.inputOffset || 0,

			outputData: outputData,
			outputOffset: info.outputOffset || 0,

			bytesPerPosition: bytesPerPosition,

			scanLineLength: scanLineLength,
			scanLines: height,

			previousLineOffset: null
		};

		this._decode(info, options);

	}.bind(this));

	return outputData;
};

/**
 * Reverses all filters
 *
 * @method _decode
 * @param {object} info
 * @param {object} options
 * @private
 */
Filter.prototype._decode = function (info, options) {

	var filterType,
		filterMapping;

	// Reverse mapping for filter-types
	filterMapping = {
		0: this._decodeNone,
		1: this._decodeSub,
		2: this._decodeUp,
		3: this._decodeAverage,
		4: this._decodePaeth
	};

	// Run through all scanlines
	for (var y = 0; y < info.scanLines; y++) {

		// Determine filter-type
		filterType = info.inputData[info.inputOffset]; info.inputOffset++;
		if ((filterType < 0) || (filterType > 4)) {
			throw new Error('Filter: Unknown filter-type ' + filterType);
		}

		// Reverse per filter-type
		filterMapping[filterType].call(this, info);

		info.previousLineOffset = info.outputOffset;
		info.inputOffset += info.scanLineLength;
		info.outputOffset += info.scanLineLength;
	}
};


/**
 * Reverses nothing at all - this is just a pass-through
 *
 * @method _decodeNone
 * @param {object} info
 * @private
 */
Filter.prototype._decodeNone = function (info) {
	info.inputData.copy(info.outputData, info.outputOffset, info.inputOffset, info.inputOffset + info.scanLineLength);
};

/**
 * Reverses the Sub filter
 *
 * @method _decodeSub
 * @param {object} info
 * @private
 */
Filter.prototype._decodeSub = function (info) {
	for (var x = 0; x < info.scanLineLength; x++) {
		info.outputData[info.outputOffset + x] = (this._getInputPixel(info, x) + this._getLeftOutputPixel(info, x)) & 0xff;
	}
};

/**
 * Reverses the Up filter
 *
 * @method _decodeUp
 * @param {object} info
 * @private
 */
Filter.prototype._decodeUp = function (info) {
	for (var x = 0; x < info.scanLineLength; x++) {
		info.outputData[info.outputOffset + x] = (this._getInputPixel(info, x) + this._getTopOutputPixel(info, x)) & 0xff;
	}
};

/**
 * Reverses the Average filter
 *
 * @method _decodeAverage
 * @param {object} info
 * @private
 */
Filter.prototype._decodeAverage = function (info) {
	for (var x = 0; x < info.scanLineLength; x++) {
		info.outputData[info.outputOffset + x] = (this._getInputPixel(info, x) + Math.floor((this._getLeftOutputPixel(info, x) + this._getTopOutputPixel(info, x)) / 2)) & 0xff;
	}
};

/**
 * Reverses the Paeth filter
 *
 * @method _decodePaeth
 * @param {object} info
 * @private
 */
Filter.prototype._decodePaeth = function (info) {
	for (var x = 0; x < info.scanLineLength; x++) {
		info.outputData[info.outputOffset + x] =
			this._getInputPixel(info, x) + this._paethPredictor(
				this._getLeftOutputPixel(info, x),
				this._getTopOutputPixel(info, x),
				this._getTopLeftOutputPixel(info, x)
			) & 0xff;
	}
};


/**
 * Paeth-predictor algorithm
 *
 * @method _paethPredictor
 * @param {int} left Left pixel
 * @param {int} top Top pixel
 * @param {int} topLeft Top-left pixel
 * @return {int} Result of algorithm
 * @private
 */
Filter.prototype._paethPredictor = function (left, top, topLeft) {

	var p = left + top - topLeft,
		pLeft = Math.abs(p - left),
		pTop = Math.abs(p - top),
		pTopLeft = Math.abs(p - topLeft);

	if ((pLeft <= pTop) && (pLeft <= pTopLeft)) {
		return left;

	} else if (pTop <= pTopLeft) {
		return top;

	} else {
		return topLeft;
	}
};


/**
 * Gets the current pixel
 *
 * @method _getInputPixel
 * @param {object} info
 * @param {int} x X-coordinate in current scanline
 * @return {int}
 * @private
 */
Filter.prototype._getInputPixel = function (info, x) {
	return info.inputData[info.inputOffset + x];
};


/**
 * Gets the pixel at the left from the current pixel from the output buffer
 *
 * @method _getLeftOutputPixel
 * @param {object} info
 * @param {int} x X-coordinate in current scanline
 * @return {int}
 * @private
 */
Filter.prototype._getLeftOutputPixel = function (info, x) {
	return (x < info.bytesPerPosition) ? 0 : info.outputData[info.outputOffset + x - info.bytesPerPosition];
};

/**
 * Gets the pixel at the top from the current pixel from the output buffer
 *
 * @method _getTopOutputPixel
 * @param {object} info
 * @param {int} x X-coordinate in current scanline
 * @return {int}
 * @private
 */
Filter.prototype._getTopOutputPixel = function (info, x) {
	return (info.previousLineOffset === null) ? 0 : info.outputData[info.previousLineOffset + x];
};

/**
 * Gets the pixel at the top-left from the current pixel from the output buffer
 *
 * @method _getTopLeftOutputPixel
 * @param {object} info
 * @param {int} x X-coordinate in current scanline
 * @return {int}
 * @private
 */
Filter.prototype._getTopLeftOutputPixel = function (info, x) {
	return ((info.previousLineOffset === null) || (x < info.bytesPerPosition)) ? 0 : info.outputData[info.previousLineOffset + x - info.bytesPerPosition];
};


/**
 * Gets the pixel at the left from the current pixel from the input buffer
 *
 * @method _getLeftInputPixel
 * @param {object} info
 * @param {int} x X-coordinate in current scanline
 * @return {int}
 * @private
 */
Filter.prototype._getLeftInputPixel = function (info, x) {
	return (x < info.bytesPerPosition) ? 0 : info.inputData[info.inputOffset + x - info.bytesPerPosition];
};

/**
 * Gets the pixel at the top from the current pixel from the input buffer
 *
 * @method _getTopInputPixel
 * @param {object} info
 * @param {int} x X-coordinate in current scanline
 * @return {int}
 * @private
 */
Filter.prototype._getTopInputPixel = function (info, x) {
	return (info.previousLineOffset === null) ? 0 : info.inputData[info.previousLineOffset + x];
};

/**
 * Gets the pixel at the top-left from the current pixel from the input buffer
 *
 * @method _getTopLeftInputPixel
 * @param {object} info
 * @param {int} x X-coordinate in current scanline
 * @return {int}
 * @private
 */
Filter.prototype._getTopLeftInputPixel = function (info, x) {
	return ((info.previousLineOffset === null) || (x < info.bytesPerPosition)) ? 0 : info.inputData[info.previousLineOffset + x - info.bytesPerPosition];
};


module.exports = Filter;
