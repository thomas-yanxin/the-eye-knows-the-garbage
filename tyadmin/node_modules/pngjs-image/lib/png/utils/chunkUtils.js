// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * @class chunkUtils
 * @module PNG
 * @submodule PNGCore
 */
module.exports = {

	/**
	 * Gets all chunks available
	 *
	 * @method getChunks
	 * @return {object}
	 */
	getChunks: function () {
		return this._chunks || this._staticChunks;
	},

	/**
	 * Clears a specific type of chunks, removing all of the from the chunk-dictionary
	 *
	 * @method clearChunksByType
	 * @param {string} type Chunk-type that should be cleared
	 */
	clearChunksByType: function (type) {
		if (this.hasChunksOfType(type)) {
			this.getChunks()[type] = [];
		}
	},

	/**
	 * Gets a list of available chunks by type
	 *
	 * @method getChunksByType
	 * @param {string} type Name of chunks
	 * @param {boolean} [required=false] Is retrieval of chunks required?
	 * @return {Chunk[]|null}
	 */
	getChunksByType: function (type, required) {
		var chunks = this.getChunks();

		if (chunks[type] && chunks[type].length > 0) {
			return chunks[type];
		} else if (required) {
			throw new Error("Could not retrieve chunk type " + type + ".");
		} else {
			return null;
		}
	},

	/**
	 * Checks if a specific chunk-type exists in the chunk-dictionary
	 *
	 * @method hasChunksOfType
	 * @param {string} type Name of chunks
	 * @return {boolean}
	 */
	hasChunksOfType: function (type) {
		return (this.getChunksByType(type, false) !== null);
	},

	/**
	 * Gets the first chunk in the chunk-type list
	 *
	 * @method getFirstChunk
	 * @param {string} type
	 * @param {boolean} required Is retrieval of chunk required?
	 * @return {Chunk|null}
	 */
	getFirstChunk: function (type, required) {
		var chunks = this.getChunksByType(type, required);

		if (!required && chunks == null) {
			return null;
		} else {
			return chunks[0];
		}
	},

	/**
	 * Gets the header chunk
	 *
	 * @method getHeaderChunk
	 * @return {Chunk}
	 */
	getHeaderChunk: function () {
		return this.getFirstChunk('IHDR', true);
	},

	/**
	 * Gets a list of available chunk-types
	 *
	 * @method getChunkTypes
	 * @return {string[]} List of chunk-types
	 */
	getChunkTypes: function () {

		var result = [],
			chunks = this.getChunks();

		for(var chunkType in chunks) {
			if (chunks.hasOwnProperty(chunkType)) {
				result.push(chunkType);
			}
		}

		return result;
	},

	/**
	 * Gets a list of all chunks in one list
	 *
	 * @method getAllChunks
	 * @return {Chunk[]}
	 */
	getAllChunks: function () {
		var chunkTypes = this.getChunkTypes(),
			chunks = this.getChunks(),
			result = [];

		chunkTypes.forEach(function (chunkType) {
			chunks[chunkType].forEach(function (chunk) {
				result.push(chunk);
			});
		});

		return result;
	},


	/**
	 * Applies all chunks sorted according to sequence
	 *
	 * @method applyWithSortedChunks
	 * @param {function} fn Function to be called with each chunk in order
	 * @param {boolean} [sortByChunks=false] If this flag is set, sorting will be done by chunks, not chunk-types.
	 * @param {boolean} [reverse=false] Should sorting be reversed?
	 */
	applyWithSortedChunks: function (fn, sortByChunks, reverse) {

		var chunks,
			Chunk = require('../chunk');

		// Gets all chunks
		if (sortByChunks) {
			chunks = this.getAllChunks();
		} else {
			chunks = Chunk.getChunkTypes().map(function (chunkType) {
				return Chunk.getChunkType(chunkType);
			});
		}

		// Sort chunks according to sequence
		chunks.sort(function (a, b) {
			var value = a.getSequence() - b.getSequence();

			if (reverse) {
				value = value * -1;
			}

			return value;
		});

		// Apply callback to all chunks
		chunks.forEach(function (chunk) {
			fn(chunk);
		});
	},


	/**
	 * Creates a new chunk of given type
	 *
	 * @method createChunk
	 * @param {string} type Type of chunk
	 * @param {object} chunks Dictionary of chunks
	 * @return {Chunk}
	 */
	createChunk: function (type, chunks) {
		var Chunk = require('../chunk');

		return new Chunk(type, chunks);
	},


	/**
	 * Adds a new chunk to the chunk-dictionary
	 *
	 * @method addChunk
	 * @param {Chunk} chunk Chunk
	 */
	addChunk: function (chunk) {

		var type = chunk.getType();

		if (!this._chunks[type]) {
			this._chunks[type] = [];
		}

		this._chunks[type].push(chunk);
	}
};
