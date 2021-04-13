// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var BufferedStream = require('../utils/bufferedStream');

/**
 * @class gAMA
 * @module PNG
 * @submodule PNGChunks
 *
 * Options:
 * - gamma {boolean} - Should this chunk be applied to the image? (default: false)
 */
module.exports = {

	/**
	 * Gets the sequence
	 *
	 * @method getSequence
	 * @return {int}
	 */
	getSequence: function () {
		return 190;
	},


	/**
	 * Gets the gamma value
	 *
	 * @method getGamma
	 * @return {float}
	 */
	getGamma: function () {
		return this._gamma || 1;
	},

	/**
	 * Sets the gamma value
	 *
	 * @method setGamma
	 * @param {float} value
	 */
	setGamma: function (value) {
		this._gamma = value;
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

		// Validation
		if (strict && (this.getFirstChunk(this.getType(), false) !== null)) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}

		if ((strict && (length !== 4)) || (length < 4)) {
			throw new Error('The length of chunk ' + this.getType() + ' should be 4, but got ' + length + '.');
		}

		this.setGamma(stream.readUInt32BE() / 100000);
	},

	/**
	 * Decoding of chunk data after image complete
	 *
	 * Phase 4
	 *
	 * @method finalizeDecode
	 * @param {Buffer} image
	 * @param {boolean} strict Should parsing be strict?
	 * @param {object} options Decoding options
	 * @param {boolean} [options.gamma=false] Apply gamma?
	 * @return {Buffer}
	 */
	finalizeDecode: function (image, strict, options) {

		var i, len,
			imageStream, outputStream,
			r, g, b, a,
			reciprocalGamma;

		if (options.gamma) {

			reciprocalGamma = 1 / this.getGamma();

			imageStream = new BufferedStream(image, false);

			outputStream = new BufferedStream(image, false); // use same buffer
			outputStream.writeOffset = 0;

			// Convert an index color image to true-color image
			for (i = 0, len = image.length; i < len; i += 4) {

				r = imageStream.readUInt8();
				g = imageStream.readUInt8();
				b = imageStream.readUInt8();
				a = imageStream.readUInt8();

				if (r !== 0 && r !== 255) {
					r = Math.pow(r / 255, reciprocalGamma) * 255;
				}
				if (g !== 0 && g !== 255) {
					g = Math.pow(g / 255, reciprocalGamma) * 255;
				}
				if (b !== 0 && b !== 255) {
					b = Math.pow(b / 255, reciprocalGamma) * 255;
				}

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
		data.volatile.gamma = chunks[0].getGamma();
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

		if (options.gamma) {

			var chunk = this.createChunk(this.getType(), this.getChunks());

			chunk.setGamma(options.gamma);

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
		stream.writeUInt32BE(this.getGamma() * 100000);
	}
};
