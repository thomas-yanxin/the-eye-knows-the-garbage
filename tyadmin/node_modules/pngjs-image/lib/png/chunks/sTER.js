// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var layouts = require('../utils/constants').stereoLayouts;

/**
 * @class sTER
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
		return 220;
	},


	/**
	 * Gets the stereo-layout mode
	 *
	 * @method getLayout
	 * @return {int}
	 */
	getLayout: function () {
		return this._layout || layouts.CROSS_FUSE;
	},

	/**
	 * Sets the stereo-layout mode
	 *
	 * @method setLayout
	 * @param {int} layout Mode of layout
	 */
	setLayout: function (layout) {
		if ([layouts.CROSS_FUSE, layouts.DIVERGING_FUSE].indexOf(layout) === -1) {
			throw new Error('Layout identifier ' + layout + ' is not valid.');
		}
		this._layout = layout;
	},


	/**
	 * Is layout in cross-fuse mode?
	 *
	 * In this mode, the left side of the image is for the right eye,
	 * and the right side of the image is for the left eye.
	 *
	 * @method isLayoutCrossFuse
	 * @return {boolean}
	 */
	isLayoutCrossFuse: function () {
		return (this._layout === layouts.CROSS_FUSE);
	},

	/**
	 * Is layout in diverging-fuse mode?
	 *
	 * In this mode, the left side of the image is for the left eye,
	 * and the right side of the image is for the right eye.
	 *
	 * @method isLayoutDivergingFuse
	 * @return {boolean}
	 */
	isLayoutDivergingFuse: function () {
		return (this._layout === layouts.DIVERGING_FUSE);
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

		this.setLayout(stream.readUInt8());
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
		data.volatile.stereo = {
			layout: chunks[0].getLayout()
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

		if (options.stereo) {

			var chunk = this.createChunk(this.getType(), this.getChunks());

			if (options.stereo.layout !== undefined) {
				chunk.setLayout(options.stereo.layout);
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
		stream.writeUInt8(this.getLayout());
	}
};
