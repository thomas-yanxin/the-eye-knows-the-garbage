// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var interlace = require('../utils/constants').interlace;

/**
 * @class Interlace
 * @module PNG
 * @submodule PNGCore
 * @param {Chunk} headerChunk Header chunk of data stream
 * @param {object} [options] Options for the compressor
 * @constructor
 */
var Interlace = function (headerChunk, options) {
	this._headerChunk = headerChunk;
	this._options = options || {};
};

/**
 * Gets the options
 *
 * @method getOptions
 * @return {object}
 */
Interlace.prototype.getOptions = function () {
	return this._options;
};


/**
 * Gets the header chunk
 *
 * @method getHeaderChunk
 * @return {Chunk}
 */
Interlace.prototype.getHeaderChunk = function () {
	return this._headerChunk;
};


/**
 * Applies the interlace encoding
 *
 * Note:
 *  The input-buffer will be equal to output-buffer
 *  when there is no selected interlace-method.
 *
 * @method encode
 * @param {Buffer} data Image data
 * @return {Buffer} Interlaces image data
 */
Interlace.prototype.encode = function (data) {

	var headerChunk = this.getHeaderChunk(),
		output = data;

	if (headerChunk.getInterlaceMethod() === interlace.ADAM7) {
		output = this._adam7(data, headerChunk.getWidth(), headerChunk.getHeight(), false);
	}

	return output;
};

/**
 * Reverses the interlace encoding
 *
 * Note:
 *  The input-buffer will be equal to output-buffer
 *  when there is no selected interlace-method.
 *
 * @method decode
 * @param {Buffer} data Image data
 * @return {Buffer} Plain image data
 */
Interlace.prototype.decode = function (data) {

	var headerChunk = this.getHeaderChunk(),
		output = data;

	if (headerChunk.getInterlaceMethod() === interlace.ADAM7) {
		output = this._adam7(data, headerChunk.getWidth(), headerChunk.getHeight(), true);
	}

	return output;
};


/**
 * Applies the adam-7 algorithm to the supplied data
 *
 * @method _adam7
 * @param {Buffer} data Input data
 * @param {int} width Width of image
 * @param {int} height Height of image
 * @param {boolean} [revert=false] Should adam-7 be reverted? Otherwise applies it.
 * @return {Buffer}
 * @private
 */
Interlace.prototype._adam7 = function (data, width, height, revert) {

	// Suggested implementation from the spec:
	// http://www.libpng.org/pub/png/spec/1.1/PNG-Decoders.html

	var startingRow  = [0, 0, 4, 0, 2, 0, 1],
		startingCol  = [0, 4, 0, 2, 0, 1, 0],
		rowIncrement = [8, 8, 8, 4, 4, 2, 2],
		colIncrement = [8, 8, 4, 4, 2, 2, 1],
		pass, row, col,
		position = 0,
		output,
		sequential, jump;

	output = new Buffer(data.length);
	for (pass = 0; pass < 7; pass++) {
		for (row = startingRow[pass]; row < height; row += rowIncrement[pass]) {
			for (col = startingCol[pass]; col < width; col += colIncrement[pass]) {

				sequential = position;
				jump = ((row * width) + col) * 4;

				if (revert) {
					output.writeUInt32BE(data.readUInt32BE(sequential, true), jump, true);
				} else {
					output.writeUInt32BE(data.readUInt32BE(jump, true), sequential, true);
				}

				position += 4;
			}
		}
	}

	return output;
};


/**
 * Processes scanlines according to the interlace mode
 *
 * @method processPasses
 * @param {function} cb Function that will be called for each pass
 */
Interlace.prototype.processPasses = function (cb) {

	var headerChunk = this.getHeaderChunk(),

		height = headerChunk.getHeight(),
		width = headerChunk.getWidth(),

		localWidth, localHeight,
		localScanLineLength,

		pass,
		currentPass,
		passes;

	if (headerChunk.isInterlaced()) {

		passes = [
			{ x: { start: 0, increment: 8 }, y: { start: 0, increment: 8 } }, // 1
			{ x: { start: 4, increment: 8 }, y: { start: 0, increment: 8 } }, // 2
			{ x: { start: 0, increment: 4 }, y: { start: 4, increment: 8 } }, // 3
			{ x: { start: 2, increment: 4 }, y: { start: 0, increment: 4 } }, // 4
			{ x: { start: 0, increment: 2 }, y: { start: 2, increment: 4 } }, // 5
			{ x: { start: 1, increment: 2 }, y: { start: 0, increment: 2 } }, // 6
			{ x: { start: 0, increment: 1 }, y: { start: 1, increment: 2 } }  // 7
		];

	} else {

		passes = [
			{ x: { start: 0, increment: 1 }, y: { start: 0, increment: 1 } }
		];
	}

	for (pass = 0; pass < passes.length; pass++) {

		currentPass = passes[pass];

		localWidth = Math.ceil((width - currentPass.x.start) / currentPass.x.increment);
		localHeight = Math.ceil((height - currentPass.y.start) / currentPass.y.increment);

		if (localWidth >= 1 && localHeight >= 1) {
			localScanLineLength = Math.ceil(headerChunk.getScanLineLengthForWidth(localWidth));

			cb(localWidth, localHeight, localScanLineLength);
		}
	}
};

module.exports = Interlace;
