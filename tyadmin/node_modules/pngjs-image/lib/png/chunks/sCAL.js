// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var units = require('../utils/constants').physicalUnits;

/**
 * @class sCAL
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
		return 142;
	},


	/**
	 * Gets the physical width per pixel
	 *
	 * @method getPixelWidth
	 * @return {float}
	 */
	getPixelWidth: function () {
		return this._pixelWidth || 1;
	},

	/**
	 * Sets the physical width per pixel
	 *
	 * @method setPixelWidth
	 * @param {float} pixelWidth Physical width per pixel
	 */
	setPixelWidth: function (pixelWidth) {
		if (pixelWidth <= 0) {
			throw new Error('Width should be greater than zero. It is ' + pixelWidth + '.');
		}
		this._pixelWidth = pixelWidth;
	},


	/**
	 * Gets the physical height per pixel
	 *
	 * @method getPixelHeight
	 * @return {float}
	 */
	getPixelHeight: function () {
		return this._pixelHeight || 1;
	},

	/**
	 * Sets the physical height per pixel
	 *
	 * @method setPixelHeight
	 * @param {float} pixelHeight Physical height per pixel
	 */
	setPixelHeight: function (pixelHeight) {
		if (pixelHeight <= 0) {
			throw new Error('Height should be greater than zero. It is ' + pixelHeight + '.');
		}
		this._pixelHeight = pixelHeight;
	},


	/**
	 * Gets the unit identifier
	 *
	 * @method getUnit
	 * @return {int}
	 */
	getUnit: function () {
		return this._unit || 1;
	},

	/**
	 * Sets the unit identifier
	 *
	 * @method setUnit
	 * @param {int} unit Unit identifier
	 */
	setUnit: function (unit) {
		if ([units.METER, units.RADIAN].indexOf(unit) === -1) {
			throw new Error('Unit identifier ' + unit + ' is not valid.');
		}
		this._unit = unit;
	},


	/**
	 * Is unit in meter?
	 *
	 * @method isUnitInMeter
	 * @return {boolean}
	 */
	isUnitInMeter: function () {
		return (this._unit === units.METER);
	},

	/**
	 * Is unit in radian?
	 *
	 * @method isUnitInRadian
	 * @return {boolean}
	 */
	isUnitInRadian: function () {
		return (this._unit === units.RADIAN);
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

		var i, len, foundIndex = null, buffer;

		// Validation
		if (strict && (this.getFirstChunk(this.getType(), false) !== null)) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}

		this.setUnit(stream.readUInt8());

		// See where the null-character is
		buffer = stream.peekBuffer(length - 1);
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

		this.setPixelWidth(Number(stream.readString(foundIndex, 'ascii')));

		// Skip null
		stream.skip(1);

		this.setPixelHeight(Number(stream.readString(length - foundIndex - 1, 'ascii')));
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
		data.volatile.physicalScale = {
			pixelWidth: chunks[0].getPixelWidth(),
			pixelHeight: chunks[0].getPixelHeight(),
			unit: chunks[0].getUnit()
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

		if (options.physicalScale) {

			var chunk = this.createChunk(this.getType(), this.getChunks());

			if (options.physicalScale.xPixelPerUnit !== undefined) {
				chunk.setPixelWidth(options.physicalScale.xPixelPerUnit);
			}
			if (options.physicalScale.yPixelPerUnit !== undefined) {
				chunk.setPixelHeight(options.physicalScale.yPixelPerUnit);
			}
			if (options.physicalScale.unit !== undefined) {
				chunk.setUnit(options.physicalScale.unit);
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
		stream.writeUInt8(this.getUnit());

		stream.writeASCIIString(String(this.getPixelWidth()));

		// Write null-character
		stream.writeUInt8(0);

		stream.writeASCIIString(String(this.getPixelHeight()));
	}
};
