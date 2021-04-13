// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * @class hIST
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
		return 350;
	},


	/**
	 * Gets all frequencies at once
	 *
	 * @method getFrequencies
	 * @return {int[]} List of all frequencies in order of the palette color indexes
	 */
	getFrequencies: function () {
		var result = [];

		for(var i = 0, len = this._frequency.length; i < len; i += 2) {
			result.push(this._frequency.readUInt16BE(i));
		}

		return result;
	},

	/**
	 * Sets all frequencies at once
	 *
	 * @method setFrequencies
	 * @param {int[]} frequencies List of all frequencies in order of the palette color indexes
	 */
	setFrequencies: function (frequencies) {

		this._frequency = new Buffer(frequencies.length * 2);

		for(var i = 0, len = frequencies.length; i < len; i++) {
			this._frequency.writeUInt16BE(frequencies[i], i * 2);
		}
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

		this._frequency = stream.readBuffer(length);
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
		data.volatile.histogram = chunks[0].getFrequencies();
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

		if (options.histogram) {

			var chunk = this.createChunk(this.getType(), this.getChunks());

			chunk.setFrequencies(options.histogram);

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
		if (this._frequency) {
			stream.writeBuffer(this._frequency);
		}
	}
};
