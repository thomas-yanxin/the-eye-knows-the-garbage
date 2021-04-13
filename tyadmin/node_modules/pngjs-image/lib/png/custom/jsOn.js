// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

// jsOn - JSON Data

var Compressor = require('../processor/compressor');
var BufferedStream = require('../utils/bufferedStream');

/**
 * @class jsOn
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
		return 600;
	},


	/**
	 * Gets the keyword of the JSON data
	 *
	 * @method getKeyword
	 * @return {string}
	 */
	getKeyword: function () {
		return this._keyword || '';
	},

	/**
	 * Sets the keyword of the JSON data
	 *
	 * @method setKeyword
	 * @param {string} type
	 */
	setKeyword: function (type) {
		this._keyword = type;
	},

	/**
	 * Gets the data content
	 *
	 * @method getContent
	 * @return {object}
	 */
	getContent: function () {
		return this._content || {};
	},

	/**
	 * Sets the data content
	 *
	 * @method setContent
	 * @param {object} data
	 */
	setContent: function (data) {
		this._content = data;
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

		var i, len, foundIndex = null, buffer, string,
			compressor,
			data,
			compressionMethod;

		// See where the null-character is
		buffer = stream.peekBuffer(length);
		for (i = 0, len = buffer.length; i < len; i++) {
			if (buffer.readUInt8(i) === 0) {
				foundIndex = i;
				break;
			}
		}

		// Found a null-character?
		if (foundIndex === null) {
			throw new Error('Cannot find separator in ' + this.getType() + ' chunk.');
		}

		// Convert keyword from latin1
		buffer = stream.readBuffer(foundIndex);
		string = buffer.toString('utf8');
		this.setKeyword(string);

		// Skip null
		stream.skip(1);

		// Load compression method
		compressionMethod = stream.readUInt8();
		if (compressionMethod !== 0) {
			throw new Error('Unknown compression method for chunk ' + this.getType() + '.');
		}

		// Read the data
		data = stream.readBuffer(length - foundIndex - 2);

		// Decompress
		compressor = new Compressor(options);
		data = compressor.decode(data);

		// Convert buffer into string
		this.setContent(JSON.parse(data.toString('utf8')));
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

		data.JSON = [];
		chunks.forEach(function (chunk) {

			data.JSON.push({
				keyword: chunk.getKeyword(),
				content: chunk.getContent()
			});
		});
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

		if (options.JSON) {

			var result = [],
				type = this.getType(),
				chunks = this.getChunks();

			options.JSON.forEach(function (entry) {

				var chunk = this.createChunk(type, chunks);

				chunk.setKeyword(entry.keyword);
				chunk.setContent(entry.content);

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

		var compressor,
			dataStr,
			data,
			string,
			buffer;

		dataStr = JSON.stringify(this.getContent() || {});

		// Compress the data
		compressor = new Compressor(options);
		data = compressor.encode(new Buffer(dataStr, 'utf8'));

		// Write title to stream
		string = this.getKeyword();
		buffer = new Buffer(string, 'utf8');
		stream.writeBuffer(buffer);

		// Write null-character
		stream.writeUInt8(0);

		// Write compression method - only 0 supported
		stream.writeUInt8(0);

		// Write the rest of the data
		stream.writeBuffer(data);
	}
};
