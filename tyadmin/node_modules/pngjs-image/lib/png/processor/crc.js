// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

// Algorithm suggestion from:
// http://www.libpng.org/pub/png/spec/1.1/PNG-CRCAppendix.html

/**
 * Creates a CRC table to speed-up the algorithm
 *
 * @createCRCTable
 * @return {int[]}
 * @private
 */
function createCRCTable () {
	var crcTable = [],
		n, k, c;

	for (n = 0; n < 256; n++) {
		c = n;
		for (k = 0; k < 8; k++) {
			c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		}
		crcTable[n] = c;
	}

	return crcTable;
}

/**
 * @class CRC
 * @module PNG
 * @submodule PNGCore
 * @constructor
 */
var CRC = function () {
	this._value = -1;
};

/**
 * Pre-calculated CRC table
 *
 * @static
 * @type {int[]}
 */
CRC.table = createCRCTable();


/**
 * Writes data to the CRC algorithm
 *
 * @method write
 * @param {Buffer} data Data to be written
 * @param {int} offset Offset to start reading from
 * @param {int} length Length in bytes of the data
 */
CRC.prototype.write = function (data, offset, length) {

	var n,
		max = offset + length,
		table = CRC.table,
		c = this._value;

	for (n = offset; n < max; n++) {
		c = table[(c ^ data[n]) & 0xff] ^ (c >>> 8);
	}

	this._value = c;
};

/**
 * Gets the current CRC value
 *
 * @method getValue
 * @return {number}
 */
CRC.prototype.getValue = function () {
	return this._value ^ -1;
};

module.exports = CRC;


