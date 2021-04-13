// Copyright 2014-2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * Pixel conversion functions - mostly used by filters
 *
 * @class PNGImage
 * @submodule Core
 * @type {object}
 */
module.exports = {

	/**
	 * Gets the blurred value of a pixel with a gray-scale function
	 *
	 * @method getBlurPixelAtIndex
	 * @param {int} idx Index
	 * @param {string} [funcName] Gray-scale function
	 * @return {int}
	 */
	getBlurPixelAtIndex: function (idx, funcName) {

		var colors = 0,
			colorCounter = 0,
			fn,
			width = this._image.width,
			height = this._image.height,
			dim = width * height,
			spaceOnRight,
			spaceOnLeft,
			spaceOnTop,
			spaceOnBottom;

		funcName = funcName || "getLuminosityAtIndex";

		fn = function (idx) {
			colors += this[funcName](idx);
			colorCounter++;
		}.bind(this);

		spaceOnRight = (idx % width < width - 1);
		spaceOnLeft = (idx % width > 0);
		spaceOnTop = (idx >= width);
		spaceOnBottom = (idx <= dim - width);

		if (spaceOnTop) {
			if (spaceOnLeft) {
				fn(idx - this._image.width - 1);
			}
			fn(idx - this._image.width);
			if (spaceOnRight) {
				fn(idx - this._image.width + 1);
			}
		}

		if (spaceOnLeft) {
			fn(idx - 1);
		}
		fn(idx);
		if (spaceOnRight) {
			fn(idx + 1);
		}

		if (spaceOnBottom) {
			if (spaceOnLeft) {
				fn(idx + this._image.width - 1);
			}
			fn(idx + this._image.width);
			if (spaceOnRight) {
				fn(idx + this._image.width + 1);
			}
		}

		return Math.floor(colors / colorCounter);
	},

	/**
	 * Gets the blur-value of a pixel at a specific coordinate
	 *
	 * @method getBlurPixel
	 * @param {int} x X-coordinate of pixel
	 * @param {int} y Y-coordinate of pixel
	 * @param {string} [funcName] Gray-scale function
	 * @return {int} blur-value
	 */
	getBlurPixel: function (x, y, funcName) {
		var idx = this.getIndex(x, y);
		return this.getBlurPixelAtIndex(idx, funcName);
	},


	/**
	 * Gets the YIQ-value of a pixel at a specific index
	 * The values for RGB correspond afterwards to YIQ respectively.
	 *
	 * @method getYIQAtIndex
	 * @param {int} idx Index of pixel
	 * @return {object} YIQ-value
	 */
	getYIQAtIndex: function (idx) {

		var r = this.getRed(idx),
			g = this.getGreen(idx),
			b = this.getBlue(idx),
			y,
			i,
			q;

		y = this.getLumaAtIndex(idx);
		i = Math.floor((0.595716 * r) - (0.274453 * g) - (0.321263 * b));
		q = Math.floor((0.211456 * r) - (0.522591 * g) + (0.311135 * b));

		y = y < 0 ? 0 : (y > 255 ? 255 : y);
		i = i < 0 ? 0 : (i > 255 ? 255 : i);
		q = q < 0 ? 0 : (q > 255 ? 255 : q);

		return {y: y, i: i, q: q};
	},

	/**
	 * Gets the YIQ-value of a pixel at a specific coordinate
	 * The values for RGB correspond afterwards to YIQ respectively.
	 *
	 * @method getYIQ
	 * @param {int} x X-coordinate of pixel
	 * @param {int} y Y-coordinate of pixel
	 * @return {object} YIQ-value
	 */
	getYIQ: function (x, y) {
		var idx = this.getIndex(x, y);
		return this.getYIQAtIndex(idx);
	},


	/**
	 * Gets the luma of a pixel at a specific index
	 *
	 * @method getLumaAtIndex
	 * @param {int} idx Index of pixel
	 * @return {int} YIQ-value
	 */
	getLumaAtIndex: function (idx) {
		return Math.floor((0.299 * this.getRed(idx)) + (0.587 * this.getGreen(idx)) + (0.114 * this.getBlue(idx)));
	},

	/**
	 * Gets the luma of a pixel at a specific coordinate
	 *
	 * @method getLuma
	 * @param {int} x X-coordinate of pixel
	 * @param {int} y Y-coordinate of pixel
	 * @return {int} YIQ-value
	 */
	getLuma: function (x, y) {
		var idx = this.getIndex(x, y);
		return this.getLumaAtIndex(idx);
	},

	/**
	 * Gets the sepia of a pixel at a specific index
	 *
	 * @method getSepiaAtIndex
	 * @param {int} idx Index of pixel
	 * @return {object} Color
	 */
	getSepiaAtIndex: function (idx) {
		var r = this.getRed(idx),
			g = this.getGreen(idx),
			b = this.getBlue(idx);

		r = Math.floor((0.393 * r) + (0.769 * g) + (0.189 * b));
		g = Math.floor((0.349 * r) + (0.686 * g) + (0.168 * b));
		b = Math.floor((0.272 * r) + (0.534 * g) + (0.131 * b));

		r = r < 0 ? 0 : (r > 255 ? 255 : r);
		g = g < 0 ? 0 : (g > 255 ? 255 : g);
		b = b < 0 ? 0 : (b > 255 ? 255 : b);

		return {red: r, green: g, blue: b};
	},

	/**
	 * Gets the sepia of a pixel at a specific coordinate
	 *
	 * @method getSepia
	 * @param {int} x X-coordinate of pixel
	 * @param {int} y Y-coordinate of pixel
	 * @return {object} Color
	 */
	getSepia: function (x, y) {
		return this.getSepiaAtIndex(this.getIndex(x, y));
	},


	/**
	 * Gets the luminosity of a pixel at a specific index
	 *
	 * @method getLuminosityAtIndex
	 * @param {int} idx Index of pixel
	 * @return {int} Luminosity
	 */
	getLuminosityAtIndex: function (idx) {
		return Math.floor((0.2126 * this.getRed(idx)) + (0.7152 * this.getGreen(idx)) + (0.0722 * this.getBlue(idx)));
	},

	/**
	 * Gets the luminosity of a pixel at a specific coordinate
	 *
	 * @method getLuminosity
	 * @param {int} x X-coordinate of pixel
	 * @param {int} y Y-coordinate of pixel
	 * @return {int} Luminosity
	 */
	getLuminosity: function (x, y) {
		var idx = this.getIndex(x, y);
		return this.getLuminosityAtIndex(idx);
	},


	/**
	 * Gets the lightness of a pixel at a specific index
	 *
	 * @method getLightnessAtIndex
	 * @param {int} idx Index of pixel
	 * @return {int} Lightness
	 */
	getLightnessAtIndex: function (idx) {
		var r = this.getRed(idx),
			g = this.getGreen(idx),
			b = this.getBlue(idx);

		return Math.floor((Math.max(r, g, b) + Math.min(r, g, b)) / 2);
	},

	/**
	 * Gets the lightness of a pixel at a specific coordinate
	 *
	 * @method getLightness
	 * @param {int} x X-coordinate of pixel
	 * @param {int} y Y-coordinate of pixel
	 * @return {int} Lightness
	 */
	getLightness: function (x, y) {
		var idx = this.getIndex(x, y);
		return this.getLightnessAtIndex(idx);
	},


	/**
	 * Gets the average of a pixel at a specific index
	 *
	 * @method getGrayScaleAtIndex
	 * @param {int} idx Index of pixel
	 * @return {int} Average
	 */
	getGrayScaleAtIndex: function (idx) {
		return Math.floor((this.getRed(idx) + this.getGreen(idx) + this.getBlue(idx)) / 3);
	},

	/**
	 * Gets the average of a pixel at a specific coordinate
	 *
	 * @method getGrayScale
	 * @param {int} x X-coordinate of pixel
	 * @param {int} y Y-coordinate of pixel
	 * @return {int} Average
	 */
	getGrayScale: function (x, y) {
		var idx = this.getIndex(x, y);
		return this.getGrayScaleAtIndex(idx);
	}
};
