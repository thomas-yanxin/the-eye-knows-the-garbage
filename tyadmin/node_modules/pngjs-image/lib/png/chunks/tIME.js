// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * @class tIME
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
		return 100;
	},


	/**
	 * Gets the date
	 *
	 * @method getDate
	 * @return {Date}
	 */
	getDate: function () {
		return this._date || new Date();
	},

	/**
	 * Sets the date
	 *
	 * @method setDate
	 * @param {Date} date
	 */
	setDate: function (date) {
		this._date = date;
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

		var year, month, day, hour, minute, second;

		// Validation
		if (strict && (this.getFirstChunk(this.getType(), false) !== null)) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}

		if ((strict && (length !== 7)) || (length < 7)) {
			throw new Error('The length of the ' + this.getType() + ' chunk should be 7 but is ' + length +'.');
		}

		year = stream.readUInt16BE();
		month = stream.readUInt8();
		day = stream.readUInt8();
		hour = stream.readUInt8();
		minute = stream.readUInt8();
		second = stream.readUInt8();

		this.setDate(new Date(Date.UTC(year, month - 1, day, hour, minute, second === 60 ? 59 : second)));
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
		data.volatile.modificationDate = chunks[0].getDate();
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

		if (options.modificationDate) {

			var chunk = this.createChunk(this.getType(), this.getChunks());

			chunk.setDate(options.modificationDate);

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

		var date = this.getDate();

		stream.writeUInt16BE(date.getUTCFullYear());
		stream.writeUInt8(date.getUTCMonth() + 1);
		stream.writeUInt8(date.getUTCDate());
		stream.writeUInt8(date.getUTCHours());
		stream.writeUInt8(date.getUTCMinutes());
		stream.writeUInt8(date.getUTCSeconds());
	}
};
