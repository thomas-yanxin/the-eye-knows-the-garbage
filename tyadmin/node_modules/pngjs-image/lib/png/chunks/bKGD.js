// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Scaler = require('../processor/scaler');
var BufferedStream = require('../utils/bufferedStream');

/**
 * @class bKGD
 * @module PNG
 * @submodule PNGChunks
 *
 * Options:
 * - background {boolean} - Should this chunk be applied to the image? (default: false)
 */
module.exports = {

	/**
	 * Gets the sequence
	 *
	 * @method getSequence
	 * @return {int}
	 */
	getSequence: function () {
		return 400;
	},


	/**
	 * Gets the background color
	 *
	 * @method getColor
	 * @return {object}
	 */
	getColor: function () {
		return this._color || {
				red: 0,
				green: 0,
				blue: 0
			};
	},

	/**
	 * Sets the background color
	 *
	 * @method setColor
	 * @param {object} color
	 */
	setColor: function (color) {
		if (typeof color !== 'object') {
			throw new Error('The color should be an object with properties red, green, blue.');
		}
		this._color = color;
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
			color,
			scale;

		// Validation
		if (!this.getFirstChunk('IHDR', false) === null) {
			throw new Error('Chunk ' + this.getType() + ' requires the IHDR chunk.');
		}

		if (strict && (this.getFirstChunk(this.getType(), false) !== null)) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}

		headerChunk = this.getHeaderChunk();
		scale = new Scaler(headerChunk);

		if (!headerChunk.isColor()) {

			if ((strict && (length !== 2)) || (length < 2)) {
				throw new Error('The ' + this.getType() + ' chunk requires 2 bytes for grayscale images. Got ' + length + '.');
			}

			color = stream.readUInt16BE();
			color = scale.decodeValue(color);
			this.setColor({
				red: color,
				green: color,
				blue: color
			});

		} else if (headerChunk.hasIndexedColor()) {

			if ((strict && (length !== 1)) || (length < 1)) {
				throw new Error('The ' + this.getType() + ' chunk requires 1 byte for color images with a palette. Got ' + length + '.');
			}

			paletteChunk = this.getFirstChunk('PLTE', true);
			color = stream.readUInt8();
			this.setColor(paletteChunk.getColors()[color]);

		} else {

			if ((strict && (length !== 6)) || (length < 6)) {
				throw new Error('The ' + this.getType() + ' chunk requires 6 bytes for color images. Got ' + length + '.');
			}

			this.setColor({
				red: scale.decodeValue(stream.readUInt16BE()),
				green: scale.decodeValue(stream.readUInt16BE()),
				blue: scale.decodeValue(stream.readUInt16BE())
			});
		}
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
	 * @param {boolean} [options.background=false] Apply background?
	 * @return {Buffer}
	 */
	postDecode: function (image, strict, options) {

		var i, len,
			imageStream, outputStream,
			backgroundColor,
			r, g, b, a,
			alpha;

		if (options.background) {

			backgroundColor = this.getColor();

			imageStream = new BufferedStream(image, false);

			outputStream = new BufferedStream(image, false); // use same buffer
			outputStream.writeOffset = 0;

			// Convert an index color image to true-color image
			for (i = 0, len = image.length; i < len; i += 4) {

				r = imageStream.readUInt8();
				g = imageStream.readUInt8();
				b = imageStream.readUInt8();
				a = imageStream.readUInt8();

				//TODO: Revert gamma if needed

				if (a === 0) {
					r = backgroundColor.red;
					g = backgroundColor.green;
					b = backgroundColor.blue;
					a = 255;

				} else if (a === 255) {
					// Don't do anything

				} else {

					alpha = (a / 255);
					r = alpha * r + (1 - alpha) * backgroundColor.red;
					g = alpha * g + (1 - alpha) * backgroundColor.green;
					b = alpha * b + (1 - alpha) * backgroundColor.blue;
					a = 255;
				}

				//TODO: Re-Apply gamma if needed

				outputStream.writeUInt8(r);
				outputStream.writeUInt8(g);
				outputStream.writeUInt8(b);
				outputStream.writeUInt8(a);
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
		data.volatile.backgroundColor = chunks[0].getColor();
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

		if (options.backgroundColor) {

			var chunk = this.createChunk(this.getType(), this.getChunks());

			chunk.setColor(options.backgroundColor);

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

		var headerChunk = this.getHeaderChunk(),
			paletteChunk,
			color,
			scale;

		scale = new Scaler(headerChunk);

		if (!headerChunk.isColor()) {

			// Use all colors to get the average. All colors should be the same anyways.
			color = this.getColor();
			color = Math.floor((color.red + color.green + color.blue) / 3);
			color = scale.encodeValue(color);
			stream.writeUInt16BE(color);

		} else if (headerChunk.hasIndexedColor()) {

			paletteChunk = this.getFirstChunk('PLTE', true);
			color = paletteChunk.findColor(this.getColor());
			stream.writeUInt8(color & 0xff);

		} else {

			color = this.getColor();
			stream.writeUInt16BE(scale.encodeValue(color.red));
			stream.writeUInt16BE(scale.encodeValue(color.green));
			stream.writeUInt16BE(scale.encodeValue(color.blue));
		}
	}
};
