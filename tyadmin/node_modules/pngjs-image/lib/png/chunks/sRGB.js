// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var intents = require('../utils/constants').intents;

/**
 * @class sRGB
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
		return 170;
	},


	/**
	 * Gets the rendering intent identifier
	 *
	 * @method getRenderingIntent
	 * @return {int}
	 */
	getRenderingIntent: function () {
		return this._intent || intents.PERCEPTUAL;
	},

	/**
	 * Sets the rendering intent identifier
	 *
	 * @method setRenderingIntent
	 * @param {int} intent
	 */
	setRenderingIntent: function (intent) {

		if ([intents.PERCEPTUAL, intents.RELATIVE_COLORIMETRIC, intents.SATURATION, intents.ABSOLUTE_COLORIMETRIC].indexOf(intent) === -1) {
			throw new Error('Unsupported rendering intent with identifier ' + intent + '.');
		}

		this._intent = intent;
	},


	/**
	 * Is the rendering intent perceptual?
	 *
	 * @method isPerceptual
	 * @return {boolean}
	 */
	isPerceptual: function () {
		return (this.getRenderingIntent() === intents.PERCEPTUAL);
	},

	/**
	 * Is the rendering intent relative colorimetric?
	 *
	 * @method isRelativeColorimetric
	 * @return {boolean}
	 */
	isRelativeColorimetric: function () {
		return (this.getRenderingIntent() === intents.RELATIVE_COLORIMETRIC);
	},

	/**
	 * Is the rendering intent saturation?
	 *
	 * @method isSaturation
	 * @return {boolean}
	 */
	isSaturation: function () {
		return (this.getRenderingIntent() === intents.SATURATION);
	},

	/**
	 * Is the rendering intent absolute colorimetric?
	 *
	 * @method isAbsoluteColorimetric
	 * @return {boolean}
	 */
	isAbsoluteColorimetric: function () {
		return (this.getRenderingIntent() === intents.ABSOLUTE_COLORIMETRIC);
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

		if ((strict && (length !== 1)) || (length < 1)) {
			throw new Error('The ' + this.getType() + ' chunk should have 1 bytes, but it has ' + length + ' bytes.');
		}

		this.setRenderingIntent(stream.readUInt8());
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
		data.volatile.renderingIntent = chunks[0].getRenderingIntent();
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

		if (options.renderingIntent) {

			var chunk = this.createChunk(this.getType(), this.getChunks());

			chunk.setRenderingIntent(options.renderingIntent);

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
		stream.writeUInt8(this.getRenderingIntent());
	}
};
