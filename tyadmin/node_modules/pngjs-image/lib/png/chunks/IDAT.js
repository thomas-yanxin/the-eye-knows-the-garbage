// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

// IDAT - Image data

var BufferedStream = require('../utils/bufferedStream');

/**
 * @class IDAT
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
		// The _sequence is for defining the output sequence from outside (Header)
		return this._sequence || 500;
	},


	/**
	 * Gets the data stream
	 *
	 * @method getStream
	 * @return {BufferedStream}
	 */
	getStream: function () {
		if (!this._stream) {
			this._stream = new BufferedStream(null, null, 0);
		}
		return this._stream;
	},

	/**
	 * Sets a data stream
	 *
	 * @method setStream
	 * @param {BufferedStream} stream
	 */
	setStream: function (stream) {
		this._stream = stream;
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

		// Copy data to local
		this._stream = stream.slice(0, length);
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
		stream.writeBufferedStream(this.getStream());
	}
};
