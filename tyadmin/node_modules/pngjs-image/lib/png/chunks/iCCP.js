// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Compressor = require('../processor/compressor');
var iconv = require('iconv-lite');
var os = require('os');

/**
 * @class iCCP
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
		return 160;
	},


	/**
	 * Gets the profile-name
	 *
	 * @method getName
	 * @return {string}
	 */
	getName: function () {
		return this._name || '';
	},

	/**
	 * Sets the profile-name
	 *
	 * @method setName
	 * @param {string} name
	 */
	setName: function (name) {

		name = name.trim();

		if (name.length > 79) {
			throw new Error('Profile-name cannot be longer than 79 characters.');
		}
		if (name.length === 0) {
			throw new Error('Profile-name needs to have a least one character.');
		}

		this._name = name;
	},


	/**
	 * Gets the profile
	 *
	 * @method getProfile
	 * @return {Buffer}
	 */
	getProfile: function () {
		return this._profile || new Buffer();
	},

	/**
	 * Sets the profile
	 *
	 * @method setProfile
	 * @param {Buffer} data
	 */
	setProfile: function (data) {
		this._profile = text;
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

		var i, len,
			foundIndex = null,
			buffer, string,
			compressor;

		// Validation
		if (strict && (this.getFirstChunk(this.getType(), false) !== null)) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}

		// See where the null-character is
		buffer = stream.peekBuffer(length);
		for(i = 0, len = buffer.length; i < len; i++) {
			if (buffer.readUInt8(i) === 0) {
				foundIndex = i;
				break;
			}
		}

		// Found a null-character?
		if (foundIndex === null) {
			throw new Error('Cannot find separator in ' + this.getType() + ' chunk.');
		}

		// Convert profile-name from latin1
		buffer = stream.readBuffer(foundIndex);
		string = iconv.decode(buffer, 'latin1');
		this.setName(string.replace(/\n/g, os.EOL));

		// Load profile
		buffer = stream.readBuffer(length - foundIndex - 1);

		// Decompress
		compressor = new Compressor(options);
		buffer = compressor.decode(buffer);

		// Set profile
		this.setProfile(buffer);
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
		data.volatile.ICC = {
			name: chunks[0].getName(),
			profile: chunks[0].getProfile()
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

		if (options.ICC) {

			var chunk = this.createChunk(this.getType(), this.getChunks());

			chunk.setWhitePointX(options.ICC.name);
			chunk.setWhitePointY(options.ICC.profile);

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

		var string, buffer, compressor;

		// Write profile-name to stream
		string = this.getName();
		string = string.replace(new RegExp(os.EOL, 'g'), "\n");
		buffer = iconv.encode(string, 'latin1');
		stream.writeBuffer(buffer);

		// Write null-character and compression method (0)
		stream.writeUInt8(0);
		stream.writeUInt8(0);

		// Convert profile
		buffer = this.getProfile();

		// Compress
		compressor = new Compressor(options);
		buffer = compressor.encode(buffer);

		// Write compressed data to stream
		stream.writeBuffer(buffer);
	}
};
