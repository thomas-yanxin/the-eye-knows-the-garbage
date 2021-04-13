// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

// zzZz - Default chunk - When unknown

var BufferedStream = require('../utils/bufferedStream');

/**
 * @class zzZz
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
		return 900;
	},


	/**
	 * Gets the internal chunk-type
	 *
	 * @method getInternalType
	 * @return {string}
	 */
	getInternalType: function () {
		return this._internalType || 'zzZz';
	},

	/**
	 * Sets the internal chunk-type
	 *
	 * @method setInternalType
	 * @param {string} type
	 */
	setInternalType: function (type) {
		this._internalType = type;
	},


	/**
	 * Gets the data buffer
	 *
	 * @method getBuffer
	 * @return {Buffer}
	 */
	getBuffer: function () {
		if (!this._buffer) {
			this._buffer = new Buffer();
		}
		return this._buffer;
	},

	/**
	 * Sets the data buffer
	 *
	 * @method setBuffer
	 * @param {Buffer} buffer
	 */
	setBuffer: function (buffer) {
		this._buffer = buffer;
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
		this.setBuffer(stream.slice(0, length).toBuffer());
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

		var chunks = this.getChunksByType(this.getType()),
			unknown = [], volatile = [];

		if (!chunks) {
			return ;
		}

		chunks.forEach(function (chunk) {

			var info = {
				type: chunk.getInternalType(),
				data: chunk.getBuffer()
			};

			// Is safe to copy?
			if (chunk.isSafe()) {
				// Then remember them for the save
				unknown.push(info);

			} else { // Unsafe?
				// Then keep them around, but in the volatile bucket
				volatile.push(info);
			}
		});

		data.unknownChunks = unknown;
		data.volatile = data.volatile || {};
		data.volatile.unknownChunks = volatile;
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

		if (options.unknownChunks) {

			var result = [],
				type = this.getType(),
				chunks = this.getChunks();

			options.unknownChunks.forEach(function (info) {

				var chunk = this.createChunk(type, chunks);

				if (!info.type) {
					throw new Error('Unknown chunk should have a type.');
				}

				chunk.setInternalType(info.type);
				chunk.setBuffer(info.data);

				result.push(chunk);

			}.bind(this));

			return result;
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
		stream.writeBuffer(this.getBuffer());
	}
};
