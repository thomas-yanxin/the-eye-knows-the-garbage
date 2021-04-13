// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var colorTypes = require('../utils/constants').colorTypes;

/**
 * @class tRNS
 * @module PNG
 * @submodule PNGChunks
 *
 * Options:
 * - transparent {boolean} - Should this chunk be applied to the image? (default: true)
 */
module.exports = {

	/**
	 * Gets the sequence
	 *
	 * @method getSequence
	 * @return {int}
	 */
	getSequence: function () {
		return 300;
	},


	/**
	 * Searches the alpha values of a color
	 *
	 * @method findAlpha
	 * @param {int} red
	 * @param {int} green
	 * @param {int} blue
	 * @return {int|null}
	 */
	findAlpha: function (red, green, blue) {

		if (!this._lookup) {
			this._createLookUpTable();
		}

		return this._lookup[red + '_' + green + '_' + blue];
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
			lookup[colors[i].red + '_' + colors[i].green + '_' + colors[i].blue] = colors[i].alpha;
		}

		this._lookup = lookup;
	},


	/**
	 * Gets all transparent colors
	 *
	 * @method getColors
	 * @return {object[]}
	 */
	getColors: function () {
		return this._colors || [];
	},

	/**
	 * Sets all transparent colors
	 *
	 * @method setColors
	 * @return {object[]}
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

		var headerChunk,
			paletteChunk,
			colorType,
			color,
			colors = [],
			i,
			maxLength;

		// Validation
		if (!this.getFirstChunk('IHDR', false) === null) {
			throw new Error('Chunk ' + this.getType() + ' requires the IHDR chunk.');
		}

		if (strict && (this.getFirstChunk(this.getType(), false) !== null)) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}

		headerChunk = this.getHeaderChunk();
		colorType = headerChunk.getColorType();

		// Check for valid palette color-types
		if (strict && headerChunk.hasAlphaChannel()) {
			throw new Error('A transparency chunk is not allowed to appear with this color-type: ' + colorType);
		}

		switch (colorType) {

			case colorTypes.GREY_SCALE:

				for (i = 0; i < length; i += 2) {
					color = stream.readUInt16BE();
					colors.push({
						red: color,
						green: color,
						blue: color,
						alpha: 0
					});
				}
				break;

			case colorTypes.TRUE_COLOR:

				for (i = 0; i < length; i += 6) {
					colors.push({
						red: stream.readUInt16BE(),
						green: stream.readUInt16BE(),
						blue: stream.readUInt16BE(),
						alpha: 0
					});
				}
				break;

			case colorTypes.INDEXED_COLOR: // Indexed-Color

				paletteChunk = this.getFirstChunk('PLTE', true);

				// Cut-off length if it goes over in non-strict mode - losing some colors alpha channel
				if (strict) {
					maxLength = length;
				} else {
					maxLength = Math.max(length, paletteChunk.getColors().length);
				}

				if (maxLength > paletteChunk.getColors().length) {
					throw new Error('There are more transparent colors than available in the palette.');
				}

				for (i = 0; i < maxLength; i++) {
					color = paletteChunk.getColors()[i];
					color.alpha = stream.readUInt8();
					colors.push(color);
				}
				break;
		}

		this.setColors(colors);
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
	 * @param {boolean} [options.transparent=false] Apply transparency?
	 * @return {Buffer}
	 */
	decode: function (image, strict, options) {

		var i, len, index,
			r, g, b, alpha,
			headerChunk,
			isIndexed,
			paletteChunk,
			colors;

		if (options.transparent || (options.transparent === undefined)) {
			headerChunk = this.getHeaderChunk();
			isIndexed = headerChunk.isColorTypeIndexedColor();

			if (isIndexed) {
				paletteChunk = this.getFirstChunk('PLTE', true);
				colors = paletteChunk.getColors();
			}

			for (i = 0, len = image.length; i < len; i += 8) {

				index = image.readUInt16BE(i, false);
				if (isIndexed) {

					alpha = colors[index].alpha;
					if (alpha !== undefined) {
						image.writeUInt16BE(alpha, i + 6);
					}

				} else { // All other types

					r = index;
					g = image.readUInt16BE(i + 2, false);
					b = image.readUInt16BE(i + 4, false);

					alpha = this.findAlpha(r, g, b);

					if (alpha !== undefined) {
						image.writeUInt16BE(alpha, i + 6);
					}
				}
			}
		}

		return image;
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
		data.volatile.transparentColors = chunks[0].getColors();
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

		if (options.transparentColors) {

			var chunk = this.createChunk(this.getType(), this.getChunks());

			chunk.setColors(options.transparentColors);

			return [chunk];
		} else {
			return [];
		}
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

		var headerChunk, paletteChunk,
			colorType, color,
			i,
			colors = this.getColors(),
			length = colors.length;

		headerChunk = this.getHeaderChunk();
		colorType = headerChunk.getColorType();

		// Check for valid palette color-types
		if (headerChunk.hasAlphaChannel()) {
			throw new Error('A transparency chunk is not allowed to appear with this color-type: ' + colorType);
		}

		switch (colorType) {

			case colorTypes.GREY_SCALE:
				for (i = 0; i < length; i++) {
					stream.writeUInt16BE(colors[i].red);
				}
				break;

			case colorTypes.TRUE_COLOR:
				for (i = 0; i < length; i++) {
					stream.writeUInt16BE(colors[i].red);
					stream.writeUInt16BE(colors[i].green);
					stream.writeUInt16BE(colors[i].blue);
				}
				break;

			case colorTypes.INDEXED_COLOR: // Indexed-Color

				paletteChunk = this.getFirstChunk('PLTE', true);
				for (i = 0; i < length; i++) {
					color = paletteChunk.findColor(colors[i]);
					if (color === null) {
						throw new Error('Cannot find color in palette.');
					}
					stream.writeUInt8(color);
				}
				break;
		}
	}
};
