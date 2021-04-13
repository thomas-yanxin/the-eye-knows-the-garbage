// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var units = require('../utils/constants').offsetUnits;

/**
 * @class oFFs
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
		return 145;
	},


	/**
	 * Gets the offset for horizontal units
	 *
	 * @method getX
	 * @return {int}
	 */
	getX: function () {
		return this._x || 0;
	},

	/**
	 * Sets the offset for horizontal units
	 *
	 * @method setX
	 * @param {int} x Horizontal units
	 */
	setX: function (x) {
		this._x = x;
	},


	/**
	 * Gets the offset for vertical units
	 *
	 * @method getY
	 * @return {int}
	 */
	getY: function () {
		return this._y || 0;
	},

	/**
	 * Sets the vertical number of pixel per unit
	 *
	 * @method setY
	 * @param {int} y Vertical units
	 */
	setY: function (y) {
		this._y = y;
	},


	/**
	 * Gets the unit identifier
	 *
	 * @method getUnit
	 * @return {int}
	 */
	getUnit: function () {
		return this._unit || 0;
	},

	/**
	 * Sets the unit identifier
	 *
	 * @method setUnit
	 * @param {int} unit Unit identifier
	 */
	setUnit: function (unit) {
		if ([units.PIXEL, units.MICROMETER].indexOf(unit) === -1) {
			throw new Error('Unit identifier ' + unit + ' is not valid.');
		}
		this._unit = unit;
	},


	/**
	 * Is unit in pixel?
	 *
	 * @method isUnitInPixel
	 * @return {boolean}
	 */
	isUnitInPixel: function () {
		return (this._unit === units.PIXEL);
	},

	/**
	 * Is unit in micrometer?
	 *
	 * @method isUnitInMicroMeter
	 * @return {boolean}
	 */
	isUnitInMicroMeter: function () {
		return (this._unit === units.MICROMETER);
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

		if ((strict && (length !== 9)) || (length < 9)) {
			throw new Error('The length of chunk ' + this.getType() + ' should be 9, but got ' + length + '.');
		}

		this.setX(stream.readInt32BE());
		this.setY(stream.readInt32BE());
		this.setUnit(stream.readUInt8());
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

		data.offset = {
			x: chunks[0].getX(),
			y: chunks[0].getY(),
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

		if (options.offset) {

			var chunk = this.createChunk(this.getType(), this.getChunks());

			if (options.offset.x !== undefined) {
				chunk.setX(options.offset.x);
			}
			if (options.offset.y !== undefined) {
				chunk.setY(options.offset.y);
			}
			if (options.offset.unit !== undefined) {
				chunk.setUnit(options.offset.unit);
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
		stream.writeInt32BE(this.getX());
		stream.writeInt32BE(this.getY());
		stream.writeUInt8(this.getUnit());
	}
};
