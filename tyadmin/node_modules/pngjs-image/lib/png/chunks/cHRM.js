// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * @class cHRM
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
		return 200;
	},


	/**
	 * Gets the white-point x value
	 *
	 * @method getWhitePointX
	 * @return {float}
	 */
	getWhitePointX: function () {
		return this._whitePointX || 1;
	},

	/**
	 * Sets the white-point x value
	 *
	 * @method setWhitePointX
	 * @param {float} value
	 */
	setWhitePointX: function (value) {
		this._whitePointX = value;
	},


	/**
	 * Gets the white-point y value
	 *
	 * @method getWhitePointY
	 * @return {float}
	 */
	getWhitePointY: function () {
		return this._whitePointY || 1;
	},

	/**
	 * Sets the white-point y value
	 *
	 * @method setWhitePointY
	 * @param {float} value
	 */
	setWhitePointY: function (value) {
		this._whitePointY = value;
	},


	/**
	 * Gets the red x value
	 *
	 * @method getRedX
	 * @return {float}
	 */
	getRedX: function () {
		return this._redX || 1;
	},

	/**
	 * Sets the red x value
	 *
	 * @method setRedX
	 * @param {float} value
	 */
	setRedX: function (value) {
		this._redX = value;
	},


	/**
	 * Gets the red y value
	 *
	 * @method getRedY
	 * @return {float}
	 */
	getRedY: function () {
		return this._redY || 1;
	},

	/**
	 * Sets the red y value
	 *
	 * @method setRedY
	 * @param {float} value
	 */
	setRedY: function (value) {
		this._redY = value;
	},


	/**
	 * Gets the green x value
	 *
	 * @method getGreenX
	 * @return {float}
	 */
	getGreenX: function () {
		return this._greenX || 1;
	},

	/**
	 * Sets the green x value
	 *
	 * @method setGreenX
	 * @param {float} value
	 */
	setGreenX: function (value) {
		this._greenX = value;
	},


	/**
	 * Gets the green y value
	 *
	 * @method getGreenY
	 * @return {float}
	 */
	getGreenY: function () {
		return this._greenY || 1;
	},

	/**
	 * Sets the green y value
	 *
	 * @method setGreenY
	 * @param {float} value
	 */
	setGreenY: function (value) {
		this._greenY = value;
	},


	/**
	 * Gets the blue x value
	 *
	 * @method getBlueX
	 * @return {float}
	 */
	getBlueX: function () {
		return this._blueX || 1;
	},

	/**
	 * Sets the blue x value
	 *
	 * @method setBlueX
	 * @param {float} value
	 */
	setBlueX: function (value) {
		this._blueX = value;
	},


	/**
	 * Gets the blue y value
	 *
	 * @method getBlueY
	 * @return {float}
	 */
	getBlueY: function () {
		return this._blueY || 1;
	},

	/**
	 * Sets the blue y value
	 *
	 * @method setBlueY
	 * @param {float} value
	 */
	setBlueY: function (value) {
		this._blueY = value;
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

		if ((strict && (length !== 32)) || (length < 32)) {
			throw new Error('The ' + this.getType() + ' chunk requires a length of 32 but got ' + length + '.');
		}

		this.setWhitePointX(stream.readUInt32BE() / 100000);
		this.setWhitePointY(stream.readUInt32BE() / 100000);
		this.setRedX(stream.readUInt32BE() / 100000);
		this.setRedY(stream.readUInt32BE() / 100000);
		this.setGreenX(stream.readUInt32BE() / 100000);
		this.setGreenY(stream.readUInt32BE() / 100000);
		this.setBlueX(stream.readUInt32BE() / 100000);
		this.setBlueY(stream.readUInt32BE() / 100000);
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
		data.volatile.chromaticities = {
			whitePointX: chunks[0].getWhitePointX(),
			whitePointY: chunks[0].getWhitePointY(),
			redX: chunks[0].getRedX(),
			redY: chunks[0].getRedY(),
			greenX: chunks[0].getGreenX(),
			greenY: chunks[0].getGreenY(),
			blueX: chunks[0].getBlueX(),
			blueY: chunks[0].getBlueY()
		};
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

		if (options.chromaticities) {

			var chunk = this.createChunk(this.getType(), this.getChunks());

			if (options.chromaticities.whitePointX !== undefined) {
				chunk.setWhitePointX(options.chromaticities.whitePointX);
			}
			if (options.chromaticities.whitePointY !== undefined) {
				chunk.setWhitePointY(options.chromaticities.whitePointY);
			}
			if (options.chromaticities.redX !== undefined) {
				chunk.setRedX(options.chromaticities.redX);
			}
			if (options.chromaticities.redY !== undefined) {
				chunk.setRedY(options.chromaticities.redY);
			}
			if (options.chromaticities.greenX !== undefined) {
				chunk.setGreenX(options.chromaticities.greenX);
			}
			if (options.chromaticities.greenY !== undefined) {
				chunk.setGreenY(options.chromaticities.greenY);
			}
			if (options.chromaticities.blueX !== undefined) {
				chunk.setBlueX(options.chromaticities.blueX);
			}
			if (options.chromaticities.blueY !== undefined) {
				chunk.setBlueY(options.chromaticities.blueY);
			}

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
		stream.writeUInt32BE(this.getWhitePointX() * 100000);
		stream.writeUInt32BE(this.getWhitePointY() * 100000);
		stream.writeUInt32BE(this.getRedX() * 100000);
		stream.writeUInt32BE(this.getRedY() * 100000);
		stream.writeUInt32BE(this.getGreenX() * 100000);
		stream.writeUInt32BE(this.getGreenY() * 100000);
		stream.writeUInt32BE(this.getBlueX() * 100000);
		stream.writeUInt32BE(this.getBlueY() * 100000);
	}
};
