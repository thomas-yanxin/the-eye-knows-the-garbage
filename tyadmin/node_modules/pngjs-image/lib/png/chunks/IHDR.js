// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

// IHDR - Image header

var colorTypes = require('../utils/constants').colorTypes;

var BufferedStream = require('../utils/bufferedStream');

var Compressor = require('../processor/compressor');
var Filter = require('../processor/filter');
var Interlace = require('../processor/interlace');
var Parser = require('../processor/parser');
var Normalizer = require('../processor/normalizer');
var Scaler = require('../processor/scaler');

/**
 * @class IHDR
 * @module PNG
 * @submodule PNGChunks
 */
module.exports = {

	/**
	 * Gets the sequence
	 *
	 * @method getSequence
	 * @return {int}
	 */
	getSequence: function () {
		return 0;
	},


	/**
	 * Gets the width of the image
	 *
	 * @method getWidth
	 * @return {int}
	 */
	getWidth: function () {
		return this._width;
	},

	/**
	 * Sets the width of the image
	 *
	 * @method setWidth
	 * @param {int} width
	 */
	setWidth: function (width) {
		if (width <= 0) {
			throw new Error('Width has to be greater than zero.');
		}
		this._width = width;
	},


	/**
	 * Gets the height of the image
	 *
	 * @method getHeight
	 * @return {int}
	 */
	getHeight: function () {
		return this._height;
	},

	/**
	 * Sets the height of the image
	 *
	 * @method setHeight
	 * @param {int} height
	 */
	setHeight: function (height) {
		if (height <= 0) {
			throw new Error('Height has to be greater than zero.');
		}
		this._height = height;
	},


	/**
	 * Gets the bit-depth of the image data
	 *
	 * @method getBitDepth
	 * @return {int}
	 */
	getBitDepth: function () {
		return this._bitDepth;
	},

	/**
	 * Sets the bit-depth of the image data
	 *
	 * @method setBitDepth
	 * @param {int} bitDepth
	 */
	setBitDepth: function (bitDepth) {
		if ([1, 2, 4, 8, 16].indexOf(bitDepth) === -1) {
			throw new Error('Unknown bit-depth of ' + bitDepth + '.');
		}
		this._bitDepth = bitDepth;
	},


	/**
	 * Gets the color-type of the image data
	 *
	 * @method getColorType
	 * @return {int}
	 */
	getColorType: function () {
		return this._colorType;
	},

	/**
	 * Sets the color-type of the image data
	 *
	 * @method setColorType
	 * @param {int} colorType
	 */
	setColorType: function (colorType) {
		if ([colorTypes.GREY_SCALE, colorTypes.TRUE_COLOR, colorTypes.INDEXED_COLOR,
				colorTypes.GREY_SCALE_ALPHA, colorTypes.TRUE_COLOR_ALPHA].indexOf(colorType) === -1) {
			throw new Error('Unknown color-type ' + colorType + '.');
		}
		this._colorType = colorType;
	},


	/**
	 * Gets the compression method of the image data
	 *
	 * @method getCompressionMethod
	 * @return {int}
	 */
	getCompressionMethod: function () {
		return this._compressionMethod;
	},

	/**
	 * Sets the compression method of the image data
	 *
	 * @method setCompressionMethod
	 * @param {int} method
	 */
	setCompressionMethod: function (method) {
		if (method !== 0) {
			throw new Error('Unsupported compression method with identifier ' +  method + '.');
		}
		this._compressionMethod = method;
	},


	/**
	 * Gets the filter method of the image data
	 *
	 * @method getFilterMethod
	 * @return {int}
	 */
	getFilterMethod: function () {
		return this._filterMethod;
	},

	/**
	 * Sets the filter method of the image data
	 *
	 * @method setFilterMethod
	 * @param {int} method
	 */
	setFilterMethod: function (method) {
		if (method !== 0) {
			throw new Error('Unsupported filter method with identifier ' +  method + '.');
		}
		this._filterMethod = method;
	},


	/**
	 * Gets the interlace method of the image data
	 *
	 * @method getInterlaceMethod
	 * @return {int}
	 */
	getInterlaceMethod: function () {
		return this._interlaceMethod;
	},

	/**
	 * Sets the interlace method of the image data
	 *
	 * @method setInterlaceMethod
	 * @param {int} method
	 */
	setInterlaceMethod: function (method) {
		if ([0, 1].indexOf(method) === -1) {
			throw new Error('Unsupported interlace method with identifier ' +  method + '.');
		}
		this._interlaceMethod = method;
	},


	/**
	 * Does image have a an indexed color palette?
	 *
	 * @method hasIndexedColor
	 * @return {boolean}
	 */
	hasIndexedColor: function () {
		return ((this._colorType & 1) === 1);
	},

	/**
	 * Is image in color?
	 *
	 * @method isColor
	 * @return {boolean}
	 */
	isColor: function () {
		return ((this._colorType & 2) === 2);
	},

	/**
	 * Does image have an alpha-chanel?
	 *
	 * @method hasAlphaChannel
	 * @return {boolean}
	 */
	hasAlphaChannel: function () {
		return ((this._colorType & 4) === 4);
	},

	/**
	 * Is the image interlaced?
	 *
	 * @method isInterlaced
	 * @return {boolean}
	 */
	isInterlaced: function () {
		return this.getInterlaceMethod() !== 0;
	},


	/**
	 * Determines bytes per pixel
	 *
	 * @method getBytesPerPixel
	 * @return {int}
	 */
	getBytesPerPixel: function () {
		var bitDepth = this.getBitDepth();
		return (bitDepth / 8) * this.getUnprocessedSamples();
	},

	/**
	 * Gets the number of samples for the color-type
	 *
	 * @method getSamples
	 * @return {int}
	 */
	getSamples: function () {
		return this.hasIndexedColor() ? 3 : (this.isColor() ? 3 : 1) + (this.hasAlphaChannel() ? 1 : 0);
	},

	/**
	 * Gets the number of samples for the color-type (unprocessed - palette not applied yet)
	 *
	 * @method getUnprocessedSamples
	 * @return {int}
	 */
	getUnprocessedSamples: function () {
		return this.hasIndexedColor() ? 1 : this.getSamples();
	},

	/**
	 * Gets the sample-depth for the color-type
	 *
	 * @method getSampleDepth
	 * @return {int}
	 */
	getSampleDepth: function () {
		return this.hasIndexedColor() ? 8 : this.getBitDepth();
	},

	/**
	 * Determines the scan-line length
	 *
	 * @method getScanLineLength
	 * @return {int}
	 */
	getScanLineLength: function () {
		return this.getScanLineLengthForWidth(this.getWidth());
	},

	/**
	 * Determines the scan-line length for a specified width
	 *
	 * @method getScanLineLengthForWidth
	 * @param {int} width
	 * @return {int}
	 */
	getScanLineLengthForWidth: function (width) {
		return this.getBytesPerPixel() * width;
	},

	/**
	 * Determines if the data requires padding for scanlines
	 *
	 * @method hasScanLinePadding
	 * @return {boolean}
	 */
	hasScanLinePadding: function () {
		return this.hasScanLinePaddingWithWidth(this.getWidth());
	},

	/**
	 * Determines if the data requires padding for scanlines
	 *
	 * @method hasScanLinePaddingWithWidth
	 * @param {int} width
	 * @return {boolean}
	 */
	hasScanLinePaddingWithWidth: function (width) {
		var scanLineLength = this.getScanLineLengthForWidth(width);

		return (scanLineLength != Math.ceil(scanLineLength));
	},

	/**
	 * Determines position of scanline pixel
	 *
	 * @method scanLinePaddingAt
	 * @return {int}
	 */
	scanLinePaddingAt: function () {
		return this.scanLineWithWidthPaddingAt(this.getWidth());
	},

	/**
	 * Determines position of scanline pixel with width
	 *
	 * @method scanLinePaddingAt
	 * @param {int} width
	 * @return {int}
	 */
	scanLineWithWidthPaddingAt: function (width) {
		if (this.hasScanLinePaddingWithWidth(width)) {
			return this.getUnprocessedSamples() * width;
		} else {
			return null;
		}
	},

	/**
	 * Gets the size of the image in bytes during edit-mode
	 *
	 * @method getImageSizeInBytes
	 * @return {int}
	 */
	getImageSizeInBytes: function () {
		return this.getWidth() * this.getHeight() * this.getImageBytesPerPixel();
	},

	/**
	 * Gets the number of bytes in a pixel for images after scaling
	 *
	 * @method getImageBytesPerPixel
	 * @return {int}
	 */
	getImageBytesPerPixel: function () {
		return 4; // This is the working bpp for PNGjs-image
	},


	/**
	 * Is the image of color-type "Grayscale"?
	 *
	 * @method isColorTypeGreyScale
	 * @return {boolean}
	 */
	isColorTypeGreyScale: function () {
		return this.getColorType() === colorTypes.GREY_SCALE;
	},

	/**
	 * Is the image of color-type "True-color"?
	 *
	 * @method isColorTypeTrueColor
	 * @return {boolean}
	 */
	isColorTypeTrueColor: function () {
		return this.getColorType() === colorTypes.TRUE_COLOR;
	},

	/**
	 * Is the image of color-type "Indexed-color"?
	 *
	 * @method isColorTypeIndexedColor
	 * @return {boolean}
	 */
	isColorTypeIndexedColor: function () {
		return this.getColorType() === colorTypes.INDEXED_COLOR;
	},

	/**
	 * Is the image of color-type "Grayscale with alpha channel"?
	 *
	 * @method isColorTypeGreyScaleWithAlpha
	 * @return {boolean}
	 */
	isColorTypeGreyScaleWithAlpha: function () {
		return this.getColorType() === colorTypes.GREY_SCALE_ALPHA;
	},

	/**
	 * Is the image of color-type "True-color with alpha channel"?
	 *
	 * @method isColorTypeTrueColorWithAlpha
	 * @return {boolean}
	 */
	isColorTypeTrueColorWithAlpha: function () {
		return this.getColorType() === colorTypes.TRUE_COLOR_ALPHA;
	},


	/**
	 * Gets the dimensions of the image
	 *
	 * @method getDimensions
	 * @return {int}
	 */
	getDimensions: function () {
		return this.getWidth() * this.getHeight();
	},


	/**
	 * Parsing of chunk data
	 *
	 * Phase 1
	 *
	 * @method parse
	 * @param {BufferedStream} stream Data stream
	 * @param {int} length Length of chunk data
	 * @param {boolean} strict Should parsing be strict?
	 * @param {object} options Decoding options
	 */
	parse: function (stream, length, strict, options) {

		var maxWidth, maxHeight, maxDim, maxSize;

		// Validation
		if ((strict && (length !== 13)) || (length < 13)) {
			throw new Error('Invalid length of header. Length: ' + length);
		}

		if (strict && (this.getFirstChunk(this.getType(), false) !== null)) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}

		// Read and set values (+ validation)
		this.setWidth(stream.readUInt32BE());
		this.setHeight(stream.readUInt32BE());
		this.setBitDepth(stream.readUInt8());
		this.setColorType(stream.readUInt8());
		this.setCompressionMethod(stream.readUInt8());
		this.setFilterMethod(stream.readUInt8());
		this.setInterlaceMethod(stream.readUInt8());

		// Check bit-depth and color-types combination
		if ((this._colorType === colorTypes.GREY_SCALE) && ([1, 2, 4, 8, 16].indexOf(this._bitDepth) === -1)) {
			throw new Error('Header error: Unsupported bit-depth for GrayScale images.');
		}
		if ((this._colorType === colorTypes.TRUE_COLOR) && ([8, 16].indexOf(this._bitDepth) === -1)) {
			throw new Error('Header error: Unsupported bit-depth for TrueColor images.');
		}
		if ((this._colorType === colorTypes.INDEXED_COLOR) && ([1, 2, 4, 8].indexOf(this._bitDepth) === -1)) {
			throw new Error('Header error: Unsupported bit-depth for Indexed-color images.');
		}
		if ((this._colorType === colorTypes.GREY_SCALE_ALPHA) && ([8, 16].indexOf(this._bitDepth) === -1)) {
			throw new Error('Header error: Unsupported bit-depth for GrayScale with alpha-channel images.');
		}
		if ((this._colorType === colorTypes.TRUE_COLOR_ALPHA) && ([8, 16].indexOf(this._bitDepth) === -1)) {
			throw new Error('Header error: Unsupported bit-depth for TrueColor with alpha-channel images.');
		}

		// Check for de-compression bombs
		maxWidth = (options.maxWidth !== undefined) ? options.maxWidth : 0;
		if (options.checkBombs && (maxWidth !== 0) && (this.width > maxWidth)) {
			throw new Error('Image width is larger than allowed.');
		}
		maxHeight = (options.maxHeight !== undefined) ? options.maxHeight : 0;
		if (options.checkBombs && (maxHeight !== 0) && (this.height > maxHeight)) {
			throw new Error('Image height is larger than allowed.');
		}
		maxDim = (options.maxDim !== undefined) ? options.maxDim : 0;
		if (options.checkBombs && (maxDim !== 0) && (this.getDimensions() > maxDim)) {
			throw new Error('Image resolution is larger than allowed.');
		}

		maxSize = (options.maxSize !== undefined) ? options.maxSize : 16 * 1024 * 1024;
		if (options.checkBombs && (maxSize !== 0) && (this.getImageSizeInBytes() > maxSize)) {
			throw new Error('Image size in byte is larger than allowed.');
		}
	},

	/**
	 * Decoding of chunk data before scaling
	 *
	 * Phase 2
	 *
	 * @method decode
	 * @param {Buffer} image
	 * @param {boolean} strict Should parsing be strict?
	 * @param {object} options Decoding options
	 * @return {Buffer}
	 */
	decode: function (image, strict, options) {

		var compressor,
			filter,
			parser,
			normalizer,
			localImage;

		// Combine all data chunks
		localImage = this._combine();

		// Decompress
		compressor = new Compressor(options);
		localImage = compressor.decode(localImage);

		// Run through filters
		filter = new Filter(this, options);
		localImage = filter.decode(localImage);

		// Parses scanlines
		parser = new Parser(this, options);
		localImage = parser.decode(localImage);

		// Normalizes color values
		normalizer = new Normalizer(this, options);
		localImage = normalizer.decode(localImage);

		// Ignoring the incoming values - this is the first chunk creating these
		return localImage;
	},


	/**
	 * Decoding of chunk data after scaling
	 *
	 * Phase 3
	 *
	 * @method postDecode
	 * @param {Buffer} image
	 * @param {boolean} strict Should parsing be strict?
	 * @param {object} options Decoding options
	 * @return {Buffer}
	 */
	postDecode: function (image, strict, options) {

		var scaler, interlace, localImage = image;

		scaler = new Scaler(this, options);
		localImage = scaler.decode(localImage);

		// Run through interlace method
		interlace = new Interlace(this, options);
		localImage = interlace.decode(localImage);

		return localImage;
	},

	/**
	 * Gathers chunk-data from decoded chunks
	 *
	 * Phase 5
	 *
	 * @static
	 * @method decodeData
	 * @param {object} data Data-object that will be used to export values
	 * @param {boolean} strict Should parsing be strict?
	 * @param {object} options Decoding options
	 */
	decodeData: function (data, strict, options) {

		var chunks = this.getChunksByType(this.getType());

		if (!chunks) {
			throw new Error('Cannot find header.');
		}

		if (strict && (chunks.length !== 1)) {
			throw new Error('Not more than one chunk allowed for ' + this.getType() + '.');
		}

		data.volatile = data.volatile || {};
		data.volatile.header = {
			width: chunks[0].getWidth(),
			height: chunks[0].getHeight(),
			bitDepth: chunks[0].getBitDepth(),
			colorType: chunks[0].getColorType(),
			compression: chunks[0].getCompressionMethod(),
			filter: chunks[0].getFilterMethod(),
			interlace: chunks[0].getInterlaceMethod()
		};
	},

	/**
	 * Combines all IDAT chunks into on buffer
	 *
	 * @method _combine
	 * @return {Buffer}
	 * @private
	 */
	_combine: function () {

		var totalLength = 0,
			dataChunks = this.getChunksByType('IDAT', true),
			combinedStream;

		// Determine length
		dataChunks.forEach(function (dataChunk) {
			totalLength += dataChunk.getStream().length;
		});

		// Combine all the blobs
		combinedStream = new BufferedStream(null, null, totalLength);
		dataChunks.forEach(function (dataChunk) {
			combinedStream.writeBufferedStream(dataChunk.getStream());
		});

		return combinedStream.toBuffer(true);
	},


	/**
	 * Returns a list of chunks to be added to the data-stream
	 *
	 * Phase 1
	 *
	 * @static
	 * @method encodeData
	 * @param {Buffer} image Image data
	 * @param {object} options Encoding options
	 * @return {Chunk[]} List of chunks to encode
	 */
	encodeData: function (image, options) {

		var chunk = this.createChunk(this.getType(), this.getChunks());

		chunk.setWidth(options.header.width);
		chunk.setHeight(options.header.height);
		chunk.setBitDepth(options.header.bitDepth);
		chunk.setColorType(options.header.colorType);
		chunk.setCompressionMethod(options.header.compression);
		chunk.setFilterMethod(options.header.filter);
		chunk.setInterlaceMethod(options.header.interlace);

		return [chunk];
	},

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
	preEncode: function (image, options) {

		var imageStream, scaledStream, reducedStream, withdrawnStream,
			interlace;

		// Run through interlace method
		interlace = new Interlace(this);
		image = interlace.encode(image, options);

		if (this.isColorTypeIndexedColor()) {
			// We expect the PLTE chunk to do the work
			return image;
		}

		//TODO refactor like in decode
		//TODO: Padding

		imageStream = new BufferedStream(image, false);

		// Add alpha channel if needed
		if (!this.hasAlphaChannel()) {
			withdrawnStream = new BufferedStream(null, null, imageStream.length * 0.75);
			//scale.withdraw(imageStream, withdrawnStream, 4);
		} else {
			withdrawnStream = imageStream; // Nothing to do
		}

		// Channel spreading - Grayscale to color
		if (!this.isColor()) {
			reducedStream = new BufferedStream(null, null, withdrawnStream.length / 3);
			//scale.reduce(withdrawnStream, reducedStream, 3);
		} else {
			reducedStream = withdrawnStream; // Nothing to do
		}

		// Do some scaling
		if (this.getBitDepth() === 1) {
			scaledStream = new BufferedStream(null, null, reducedStream.length / 8);
			//scale.scale8to1bit(reducedStream, scaledStream);

		} else if (this.getBitDepth() === 2) {
			scaledStream = new BufferedStream(null, null, reducedStream.length / 4);
			//scale.scale8to2bit(reducedStream, scaledStream);

		} else if (this.getBitDepth() === 4) {
			scaledStream = new BufferedStream(null, null, reducedStream.length / 2);
			//scale.scale8to4bit(reducedStream, scaledStream);

		} else if (this.getBitDepth() === 16) {
			scaledStream = new BufferedStream(null, null, reducedStream.length * 2);
			//scale.scale8to16bit(reducedStream, scaledStream);

		} else {
			scaledStream = reducedStream; // Nothing to do
		}

		return scaledStream.toBuffer(true);
	},

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
	encode: function (image, options) {

		var compressor,
			filter;

		// Run through filters
		filter = new Filter(this, options);
		image = filter.encode(image);

		// Compress
		compressor = new Compressor(options);
		image = compressor.encode(image);

		// Separate image to data chunks
		this._separate(image, options);

		// Finished since this is the last chunk
		return null;
	},

	/**
	 * Composing of chunk data
	 *
	 * Phase 4
	 *
	 * @method compose
	 * @param {BufferedStream} stream Data stream
	 * @param {object} options Encoding options
	 */
	compose: function (stream, options) {
		stream.writeUInt32BE(this.getWidth());
		stream.writeUInt32BE(this.getHeight());
		stream.writeUInt8(this.getBitDepth());
		stream.writeUInt8(this.getColorType());
		stream.writeUInt8(this.getCompressionMethod());
		stream.writeUInt8(this.getFilterMethod());
		stream.writeUInt8(this.getInterlaceMethod());
	},

	/**
	 * Separates buffer into multiple IDAT
	 *
	 * @method _separate
	 * @param {Buffer} buffer
	 * @param {object} options Encoding options
	 * @param {int} [options.chunkSize=8192] Max. size of the IDAT chunk
	 * @private
	 */
	_separate: function (buffer, options) {

		var chunkLength = options.chunkSize || 8192,
			chunkQuantity = Math.ceil(buffer.length / chunkLength),

			Chunk = require('../chunk'),
			chunk,

			stream = new BufferedStream(buffer),

			lastChunkLength, i;

		for (i = 0; i < chunkQuantity; i++) {

			chunk = new Chunk('IDAT', this._chunks);

			lastChunkLength = Math.min(stream.length, chunkLength);

			chunk.setStream(stream.slice(0, lastChunkLength));
			stream.readOffset += lastChunkLength;

			// Set sequence relative to other data chunks
			chunk._sequence = chunk.getSequence() + (i / chunkQuantity);

			this.addChunk(chunk);
		}
	}
};
