// Copyright 2014-2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * Pixel manipulation functions
 *
 * @class PNGImage
 * @submodule Core
 * @type {object}
 */
module.exports = {

	/**
	 * Gets the color of a pixel at a specific index
	 *
	 * @method getPixel
	 * @param {int} idx Index of pixel
	 * @return {int} Color
	 */
	getAtIndex: function (idx) {
		return this.getColorAtIndex(idx) | (this.getAlpha(idx) << 24);
	},

	/**
	 * Gets the color of a pixel at a specific coordinate
	 *
	 * @method getAt
	 * @param {int} x X-coordinate of pixel
	 * @param {int} y Y-coordinate of pixel
	 * @return {int} Color
	 */
	getAt: function (x, y) {
		var idx = this.getIndex(x, y);
		return this.getAtIndex(idx);
	},

	/**
	 * Gets the color of a pixel at a specific coordinate
	 * Alias for getAt
	 *
	 * @method getPixel
	 * @param {int} x X-coordinate of pixel
	 * @param {int} y Y-coordinate of pixel
	 * @return {int} Color
	 */
	getPixel: function (x, y) {
		return this.getAt(x, y);
	},


	/**
	 * Sets the color of a pixel at a specific index
	 *
	 * @method setAtIndex
	 * @param {int} idx Index of pixel
	 * @param {object|int} color
	 * @param {int} [color.red] Red value for pixel
	 * @param {int} [color.green] Green value for pixel
	 * @param {int} [color.blue] Blue value for pixel
	 * @param {int} [color.alpha] Alpha value for pixel
	 * @param {number} [color.opacity] Opacity of color
	 */
	setAtIndex: function (idx, color) {
		if (typeof color === 'object') {
			if (color.red !== undefined) this.setRed(idx, color.red, color.opacity);
			if (color.green !== undefined) this.setGreen(idx, color.green, color.opacity);
			if (color.blue !== undefined) this.setBlue(idx, color.blue, color.opacity);
			if (color.alpha !== undefined) this.setAlpha(idx, color.alpha, color.opacity);
		} else {
			this.setRed(idx, color & 0xff);
			this.setGreen(idx, (color & 0xff00) >> 8);
			this.setBlue(idx, (color & 0xff0000) >> 16);
			this.setAlpha(idx, (color & 0xff000000) >> 24);
		}
	},

	/**
	 * Sets the color of a pixel at a specific coordinate
	 *
	 * @method setAt
	 * @param {int} x X-coordinate for pixel
	 * @param {int} y Y-coordinate for pixel
	 * @param {object} color
	 * @param {int} [color.red] Red value for pixel
	 * @param {int} [color.green] Green value for pixel
	 * @param {int} [color.blue] Blue value for pixel
	 * @param {int} [color.alpha] Alpha value for pixel
	 * @param {number} [color.opacity] Opacity of color
	 */
	setAt: function (x, y, color) {
		var idx = this.getIndex(x, y);
		this.setAtIndex(idx, color);
	},

	/**
	 * Sets the color of a pixel at a specific coordinate
	 * Alias for setAt
	 *
	 * @method setPixel
	 * @param {int} x X-coordinate for pixel
	 * @param {int} y Y-coordinate for pixel
	 * @param {object} color
	 * @param {int} [color.red] Red value for pixel
	 * @param {int} [color.green] Green value for pixel
	 * @param {int} [color.blue] Blue value for pixel
	 * @param {int} [color.alpha] Alpha value for pixel
	 * @param {number} [color.opacity] Opacity of color
	 */
	setPixel: function (x, y, color) {
		this.setAt(x, y, color);
	},


	/**
	 * Gets the color of a pixel at a specific index
	 *
	 * @method getColorAtIndex
	 * @param {int} idx Index of pixel
	 * @return {int} Color
	 */
	getColorAtIndex: function (idx) {
		return this.getRed(idx) | (this.getGreen(idx) << 8) | (this.getBlue(idx) << 16);
	},

	/**
	 * Gets the color of a pixel at a specific coordinate
	 *
	 * @method getColor
	 * @param {int} x X-coordinate of pixel
	 * @param {int} y Y-coordinate of pixel
	 * @return {int} Color
	 */
	getColor: function (x, y) {
		var idx = this.getIndex(x, y);
		return this.getColorAtIndex(idx);
	},


	/**
	 * Calculates the final color value for opacity
	 *
	 * @method _calculateColorValue
	 * @param {int} originalValue
	 * @param {int} paintValue
	 * @param {number} [opacity]
	 * @return {int}
	 * @private
	 */
	_calculateColorValue: function (originalValue, paintValue, opacity) {

		var originalPart, paintPart;

		if (opacity === undefined) {
			return paintValue;
		} else {
			originalPart = originalValue * (1 - opacity);
			paintPart = (paintValue * opacity);

			return Math.floor(originalPart + paintPart);
		}
	},

	/**
	 * Get the red value of a pixel
	 *
	 * @method getRed
	 * @param {int} idx Index of pixel
	 * @return {int}
	 */
	getRed: function (idx) {
		return this._getValue(idx, 0);
	},

	/**
	 * Set the red value of a pixel
	 *
	 * @method setRed
	 * @param {int} idx Index of pixel
	 * @param {int} value Value for pixel
	 * @param {number} [opacity] Opacity of value set
	 */
	setRed: function (idx, value, opacity) {
		this._setValue(idx, 0, value, opacity);
	},


	/**
	 * Get the green value of a pixel
	 *
	 * @method getGreen
	 * @param {int} idx Index of pixel
	 * @return {int}
	 */
	getGreen: function (idx) {
		return this._getValue(idx, 1);
	},

	/**
	 * Set the green value of a pixel
	 *
	 * @method setGreen
	 * @param {int} idx Index of pixel
	 * @param {int} value Value for pixel
	 * @param {number} [opacity] Opacity of value set
	 */
	setGreen: function (idx, value, opacity) {
		this._setValue(idx, 1, value, opacity);
	},


	/**
	 * Get the blue value of a pixel
	 *
	 * @method getBlue
	 * @param {int} idx Index of pixel
	 * @return {int}
	 */
	getBlue: function (idx) {
		return this._getValue(idx, 2);
	},

	/**
	 * Set the blue value of a pixel
	 *
	 * @method setBlue
	 * @param {int} idx Index of pixel
	 * @param {int} value Value for pixel
	 * @param {number} [opacity] Opacity of value set
	 */
	setBlue: function (idx, value, opacity) {
		this._setValue(idx, 2, value, opacity);
	},


	/**
	 * Get the alpha value of a pixel
	 *
	 * @method getAlpha
	 * @param {int} idx Index of pixel
	 * @return {int}
	 */
	getAlpha: function (idx) {
		return this._getValue(idx, 3);
	},

	/**
	 * Set the alpha value of a pixel
	 *
	 * @method setAlpha
	 * @param {int} idx Index of pixel
	 * @param {int} value Value for pixel
	 * @param {number} [opacity] Opacity of value set
	 */
	setAlpha: function (idx, value, opacity) {
		this._setValue(idx, 3, value, opacity);
	},


	/**
	 * Sets the value of a pixel
	 *
	 * @method _getValue
	 * @param {int} offset Offset of a value
	 * @param {int} colorOffset Offset of a color
	 * @return {int}
	 * @private
	 */
	_getValue: function (offset, colorOffset) {
		var localOffset = offset << 2;
		return this._image.data[localOffset + colorOffset];
	},

	/**
	 * Sets the value of a pixel
	 *
	 * @method _setValue
	 * @param {int} offset Offset of a value
	 * @param {int} colorOffset Offset of a color
	 * @param {int} value Value for pixel
	 * @param {number} [opacity] Opacity of value set
	 * @private
	 */
	_setValue: function (offset, colorOffset, value, opacity) {
		var previousValue = this._getValue(offset, colorOffset),
			localOffset = offset << 2;

		this._image.data[localOffset + colorOffset] = this._calculateColorValue(previousValue, value, opacity);
	}
};
