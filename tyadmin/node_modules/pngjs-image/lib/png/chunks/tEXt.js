// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var iconv = require('iconv-lite');
var os = require('os');

/**
 * @class tEXt
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
		return 120;
	},


	/**
	 * Gets the keyword
	 *
	 * @method getKeyword
	 * @return {string}
	 */
	getKeyword: function () {
		return this._keyword || 'Title';
	},

	/**
	 * Sets the keyword
	 *
	 * @method setKeyword
	 * @param {string} text
	 */
	setKeyword: function (text) {

		text = text.trim();

		if (text.length > 79) {
			throw new Error('Keyword cannot be longer than 79 characters.');
		}
		if (text.length === 0) {
			throw new Error('Keyword needs to have a least one character.');
		}

		this._keyword = text;
	},


	/**
	 * Gets the text
	 *
	 * @method getText
	 * @return {string}
	 */
	getText: function () {
		return this._text || '';
	},

	/**
	 * Sets the text
	 *
	 * @method setText
	 * @param {string} text
	 */
	setText: function (text) {
		this._text = text;
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

		var i, len, foundIndex = null, buffer, string;

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
		string = iconv.decode(buffer, 'latin1');
		this.setKeyword(string.replace(/\n/g, os.EOL));

		// Skip null
		stream.skip(1);

		// Convert text content from latin1
		buffer = stream.readBuffer(length - foundIndex - 1);
		string = iconv.decode(buffer, 'latin1');
		this.setText(string.replace(/\n/g, os.EOL));
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

		data.texts = [];
		chunks.forEach(function (chunk) {

			data.texts.push({
				keyword: chunk.getKeyword(),
				content: chunk.getText()
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

		if (options.texts) {

			var chunk,
				result = [],
				type = this.getType(),
				chunks = this.getChunks();

			options.texts.forEach(function (text) {

				chunk = this.createChunk(type, chunks);

				if (text.keyword !== undefined) {
					chunk.setKeyword(text.keyword);
				}
				if (text.content !== undefined) {
					chunk.setText(text.content);
				}

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

		var string, buffer;

		// Write title to stream
		string = this.getKeyword();
		string = string.replace(new RegExp(os.EOL, 'g'), "\n");
		buffer = iconv.encode(string, 'latin1');
		stream.writeBuffer(buffer);

		// Write null-character
		stream.writeUInt8(0);

		// Write text content to stream
		string = this.getText();
		string = string.replace(new RegExp(os.EOL, 'g'), "\n");
		buffer = iconv.encode(string, 'latin1');
		stream.writeBuffer(buffer);
	}
};
