// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

// PLTE - Palette

var BufferedStream = require('../utils/bufferedStream');

/**
 * @class PLTE
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
		return 250;
	},


	/**
	 * Searches the platte to find the index of a color
	 *
	 * @method findColor
	 * @param {object} color Color object with red, green, and blue components
	 * @return {int|null}
	 */
	findColor: function (color) {

		if (!this._lookup) {
			this._createLookUpTable();
		}

		return this._lookup[color.red + '_' + color.green + '_' + color.blue];
	},

	/**
	 * Creates a look-up table for faster finds
	 *
	 * @method _createLookUpTable
	 * @private
	 */
	_createLookUpTable: function () {

		var i, len,
			lookup = {},
			colors = this.getColors();

		for (i = 0, len = colors.length; i < len; i++) {
			lookup[colors[i].red + '_' + colors[i].green + '_' + colors[i].blue] = i;
		}

		this._lookup = lookup;
	},

	/**
	 * Gets all colors at once
	 *
	 * @method getColors
	 * @return {object[]}
	 */
	getColors: function () {
		return this._colors || [];
	},

	/**
	 * Sets all colors at once
	 *
	 * @method setColors
	 * @param {object[]} colors
	 */
	setColors: function (colors) {
		this._colors = colors;
		this._lookup = null;
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

		var i, len,
			colors = [];

		// Validation
		if (strict && (this.getFirstChunk(this.getType(), false) !== null)) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}

		// Palette length should be divisible by three (each of r, g, b has one byte)
		if ((length % 3) !== 0) {
			throw new Error('Palette length should be a multiple of 3. Length: ' + length);
		}

		// Create palette
		for (i = 0, len = length / 3; i < len; i++) {
			colors.push({
				red: stream.readUInt8(),
				green: stream.readUInt8(),
				blue: stream.readUInt8()
			});
		}

		this.setColors(colors);
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

		var i, len, index, alpha,
			color, colors, colorsLength,
			imageStream, outputStream,
			headerChunk;

		headerChunk = this.getHeaderChunk();

		// Check if image requires a palette or if the colors are suggested
		if (!headerChunk.hasIndexedColor()) {
			return image; // Ignore these since they are not needed
		}

		colors = this._colors;
		colorsLength = colors.length;
		imageStream = new BufferedStream(image, false);

		outputStream = new BufferedStream(image, false); // use same buffer
		outputStream.writeOffset = 0;

		// Convert an index color image to true-color image
		for (i = 0, len = image.length; i < len; i += 4) {

			// Get index from input
			index = imageStream.readUInt8();
			imageStream.skip(2); // Skip the next three bytes
			alpha = imageStream.readUInt8();
			if (index >= colorsLength) {

				if (strict) {
					throw new Error('Palette: Index of color out of bounds.');

				} else {

					// Use black as unknown color in non-strict mode
					color = {
						red: 0,
						green: 0,
						blue: 0
					};
				}

			} else {
				color = colors[index];
			}

			// Write to image
			outputStream.writeUInt8(color.red);
			outputStream.writeUInt8(color.green);
			outputStream.writeUInt8(color.blue);
			outputStream.writeUInt8(alpha);
		}

		return outputStream.toBuffer(true);
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
			return ;
		}

		if (strict && (chunks.length !== 1)) {
			throw new Error('Not more than one chunk allowed for ' + this.getType() + '.');
		}

		data.volatile = data.volatile || {};
		data.volatile.paletteColors = chunks[0].getColors();
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

		if (options.paletteColors) {

			var chunk = this.createChunk(this.getType(), this.getChunks());

			chunk.setColors(options.paletteColors);

			return [chunk];
		} else {
			return [];
		}
	},

	/**
	 * Before encoding of chunk data
	 *
	 * Phase 2
	 *
	 * @method preEncode
	 * @param {Buffer} image
	 * @param {object} options Encoding options
	 * @return {Buffer}
	 */
	preEncode: function (image, options) {

		var i, len,
			imageStream, outputStream,
			headerChunk,
			index, a;

		// Check if image requires a palette or if the colors are suggested
		headerChunk = this.getHeaderChunk();
		if (!headerChunk.hasIndexedColor()) {
			//TODO: May be give an option for using these suggested colors?
			return image; // Ignore these since they are not needed
		}

		// Convert true-color to indexed color
		imageStream = new BufferedStream(image, false);
		outputStream = new BufferedStream(null, null, image.length / 4);

		for (i = 0, len = image.length; i < len; i += 4) {

			index = this.findColor({
				red: imageStream.readUInt8(i),
				green: imageStream.readUInt8(i + 1),
				blue: imageStream.readUInt8(i + 2)
			});
			a = imageStream.readUInt8(i + 3);

			if (index === undefined) {
				throw new Error('Color not find color in palette.');
			}

			// Write to image
			outputStream.writeUInt8(index);
		}

		return outputStream.toBuffer(true);
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

		var i, len,
			colors = this.getColors();

		for (i = 0, len = colors.length; i < len; i++) {
			stream.writeUInt8(colors[i].red);
			stream.writeUInt8(colors[i].green);
			stream.writeUInt8(colors[i].blue);
		}
	}
};
