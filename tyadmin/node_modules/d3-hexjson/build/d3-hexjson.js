(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-array'], factory) :
	(factory((global.d3 = global.d3 || {}),global.d3));
}(this, function (exports,d3Array) { 'use strict';

	// Main render method
	function renderHexJSON (hexjson, width, height) {
		// Get the layout
		var layout = hexjson.layout;

		// Get the hex objects as an array
		var hexes = [];
		var hexRadius = 0;

		Object.keys(hexjson.hexes).forEach(function (key) {
			hexjson.hexes[key].key = key;
			hexes.push(hexjson.hexes[key]);
		});

		// Calculate the number of rows and columns
		var qmax = d3Array.max(hexes, function (d) { return +d.q }),
			qmin = d3Array.min(hexes, function (d) { return +d.q }),
			rmax = d3Array.max(hexes, function (d) { return +d.r }),
			rmin = d3Array.min(hexes, function (d) { return +d.r });

		var qnum = qmax - qmin + 1,
			rnum = rmax - rmin + 1;

		// Calculate maximum radius the hexagons can have to fit the svg
		if (layout === "odd-r" || layout === "even-r") {
			hexRadius = d3Array.min([(width) / ((qnum + 0.5) * Math.sqrt(3)),
				height / ((rnum + 1 / 3) * 1.5)]);
		} else {
			hexRadius = d3Array.min([(height) / ((rnum + 0.5) * Math.sqrt(3)),
				width / ((qnum + 1 / 3) * 1.5)]);
		}

		// Calculate the hexagon width
		var hexWidth = hexRadius * Math.sqrt(3);

		// Get the vertices and points for this layout
		var vertices = getVertices(layout, hexWidth, hexRadius);
		var points = getPoints(vertices);

		// Calculate the values needed to render each hex and add to hexes
		hexes.forEach(function (hex) {
			// Calculate the absolute co-ordinates of each hex
			hex.qc = hex.q - qmin;
			hex.rc = rmax - hex.r;

			// Calculate the x and y position of each hex for this svg
			hex.x = getX(hex, layout, hexWidth, hexRadius);
			hex.y = getY(hex, layout, hexWidth, hexRadius);

			// Add the vertex positions and points relative to x and y
			hex.vertices = vertices;
			hex.points = points;
		});

		return hexes;
	}

	// Get the x position for a hex
	function getX (hex, layout, hexWidth, hexRadius) {
		var x = 0,
			xOffset = 0;

		switch (layout) {
			case "odd-r":
				xOffset = (hex.rc % 2 === 1) ? hexWidth : (hexWidth / 2);
				x = (hex.qc * hexWidth) + xOffset;
				break;

			case "even-r":
				xOffset = (hex.rc % 2 === 0) ? hexWidth : (hexWidth / 2);
				x = (hex.qc * hexWidth) + xOffset;
				break;

			case "odd-q":
			case "even-q":
				x = (hex.qc * hexRadius * 1.5) + hexRadius;
				break;
		}

		return x;
	}

	// Get the y position for a hex
	function getY (hex, layout, hexWidth, hexRadius) {
		var y = 0,
			yOffset = 0;

		switch (layout) {
			case "odd-r":
			case "even-r":
				y = (hex.rc * hexRadius * 1.5) + hexRadius;
				break;

			case "odd-q":
				yOffset = (hex.qc % 2 === 1) ? hexWidth : (hexWidth / 2);
				y = (hex.rc * hexWidth) + yOffset;
				break;

			case "even-q":
				yOffset = (hex.qc % 2 === 0) ? hexWidth : (hexWidth / 2);
				y = (hex.rc * hexWidth) + yOffset;
				break;
		}

		return y;
	}

	// Get the positions of the vertices for the hex:
	// - Row layouts are ordered from the topmost vertex clockwise
	// - Column layouts are ordered from the leftmost vertex clockwise
	function getVertices (layout, hexWidth, hexRadius) {
		var vertices = [];

		switch (layout) {
			case "odd-r":
			case "even-r":

				vertices.push({x: 0, y: (0 - hexRadius)});
				vertices.push({x: (0 + hexWidth * 0.5), y: (0 - 0.5 * hexRadius)});
				vertices.push({x: (0 + hexWidth * 0.5), y: (0 + 0.5 * hexRadius)});
				vertices.push({x: 0, y: (0 + hexRadius)});
				vertices.push({x: (0 - hexWidth * 0.5), y: (0 + 0.5 * hexRadius)});
				vertices.push({x: (0 - hexWidth * 0.5), y: (0 - 0.5 * hexRadius)});
				break;

			case "odd-q":
			case "even-q":

				vertices.push({x: (0 - hexRadius), y: 0});
				vertices.push({x: (0 - 0.5 * hexRadius), y: (0 - hexWidth * 0.5)});
				vertices.push({x: (0 + 0.5 * hexRadius), y: (0 - hexWidth * 0.5)});
				vertices.push({x: (0 + hexRadius), y: 0});
				vertices.push({x: (0 + 0.5 * hexRadius), y: (0 + hexWidth * 0.5)});
				vertices.push({x: (0 - 0.5 * hexRadius), y: (0 + hexWidth * 0.5)});
				break;
		}

		return vertices;
	}

	// Get the points attribute for a polygon with these vertices
	function getPoints (vertices) {
		var points = "";
		vertices.forEach(function (v) { points += v.x + "," + v.y + " " });
		return points.substring(0, points.length - 1);
	}

	// Creates a hexjson grid with the layout and dimensions of the given hexjson
	function getGridForHexJSON (hexjson) {
		// Create a new HexJSON object for the grid
		var grid = {};
		grid.layout = hexjson.layout;
		grid.hexes = {};

		// Get the hex objects from the hexjson as an array
		var hexes = [];

		Object.keys(hexjson.hexes).forEach(function (key) {
			hexes.push(hexjson.hexes[key]);
		});

		// Calculate the number of rows and columns in the grid
		var qmax = d3Array.max(hexes, function (d) { return +d.q }),
			qmin = d3Array.min(hexes, function (d) { return +d.q }),
			rmax = d3Array.max(hexes, function (d) { return +d.r }),
			rmin = d3Array.min(hexes, function (d) { return +d.r });

		// Create the hexjson grid
		var i, j, fkey;
		for (i = qmin; i <= qmax; i++) {
			for (j = rmin; j <= rmax; j++) {
				fkey = "Q" + i + "R" + j;
				grid.hexes[fkey] = {q: i, r: j};
			}
		}

		return grid;
	}

	// Creates a list of dots along the boundaries between
	// hexes which have different values of "field"
	function getBoundaryDotsForHexJSON (hexjson, width, height, field) {
		// Get the hex objects from the hexjson as an array
		var hexes = [];
		const layout = hexjson.layout;

		Object.keys(hexjson.hexes).forEach(function (key) {
			hexes.push(hexjson.hexes[key]);
		});

		// Calculate the number of rows and columns
		var qmax = d3Array.max(hexes, function (d) { return +d.q }),
			qmin = d3Array.min(hexes, function (d) { return +d.q }),
			rmax = d3Array.max(hexes, function (d) { return +d.r }),
			rmin = d3Array.min(hexes, function (d) { return +d.r });

		var qnum = qmax - qmin + 1,
			rnum = rmax - rmin + 1;
		var hexRadius;

		// Calculate maximum radius the hexagons can have to fit the svg
		if (layout === "odd-r" || layout === "even-r") {
			hexRadius = d3Array.min([(width) / ((qnum + 0.5) * Math.sqrt(3)),
				height / ((rnum + 1 / 3) * 1.5)]);
		} else {
			hexRadius = d3Array.min([(height) / ((rnum + 0.5) * Math.sqrt(3)),
				width / ((qnum + 1 / 3) * 1.5)]);
		}

		// Calculate the hexagon width
		var hexWidth = hexRadius * Math.sqrt(3);
		// Create an array into which we will put points along the
		// boundaries between differing hexes.
		// Each edge has five points, equally spaced.

		var lines = [];
		const hexRadiusSquared = hexRadius * hexRadius * 4;
		const maxHex = hexes.length;
		if (maxHex > 1) {
			hexes.forEach(function (hex) {
				hex.qc = hex.q - qmin;
				hex.rc = rmax - hex.r;

				// Calculate the x and y position of each hex for this svg
				hex.x = getX(hex, layout, hexWidth, hexRadius);
				hex.y = getY(hex, layout, hexWidth, hexRadius);
			});
			for (var i = 0; i < maxHex - 1; i++) {
				for (var j = i + 1; j < maxHex; j++) {
					var hex = hexes[i];
					var otherHex = hexes[j];
					if (hex[field] !== otherHex[field]) {
						if (Math.abs(hex.q - otherHex.q) <= 1 &&
							Math.abs(hex.r - otherHex.r) <= 1) {
							if (((hex.x - otherHex.x) * (hex.x - otherHex.x)) +
								((hex.y - otherHex.y) * (hex.y - otherHex.y)) < hexRadiusSquared) {
								// They're neighbours
								var midpoint = {};
								midpoint.x = otherHex.x + (hex.x - otherHex.x) / 2;
								midpoint.y = otherHex.y + (hex.y - otherHex.y) / 2;
								var perp = {};
								const denom = Math.sqrt(3) * 4;
								perp.dx = (hex.y - otherHex.y) / denom;
								perp.dy = -(hex.x - otherHex.x) / denom;
								lines.push({x: midpoint.x - 2 * perp.dx, y: midpoint.y - 2 * perp.dy});
								lines.push({x: midpoint.x - perp.dx, y: midpoint.y - perp.dy});
								lines.push({x: midpoint.x, y: midpoint.y});
								lines.push({x: midpoint.x + perp.dx, y: midpoint.y + perp.dy});
								lines.push({x: midpoint.x + 2 * perp.dx, y: midpoint.y + 2 * perp.dy});
							}
						}
					}
				}
			}
		}
		return lines;
	}

	// Creates a list of line segments along the boundaries
	// between hexes which have different values of "field"
	function getBoundarySegmentsForHexJSON (hexjson, width, height, field) {
		// Get the hex objects from the hexjson as an array
		var hexes = [];
		const layout = hexjson.layout;

		Object.keys(hexjson.hexes).forEach(function (key) {
			hexes.push(hexjson.hexes[key]);
		});

		// Calculate the number of rows and columns
		var qmax = d3Array.max(hexes, function (d) { return +d.q }),
			qmin = d3Array.min(hexes, function (d) { return +d.q }),
			rmax = d3Array.max(hexes, function (d) { return +d.r }),
			rmin = d3Array.min(hexes, function (d) { return +d.r });

		var qnum = qmax - qmin + 1,
			rnum = rmax - rmin + 1;
		var hexRadius;

		// Calculate maximum radius the hexagons can have to fit the svg
		if (layout === "odd-r" || layout === "even-r") {
			hexRadius = d3Array.min([(width) / ((qnum + 0.5) * Math.sqrt(3)),
				height / ((rnum + 1 / 3) * 1.5)]);
		} else {
			hexRadius = d3Array.min([(height) / ((rnum + 0.5) * Math.sqrt(3)),
				width / ((qnum + 1 / 3) * 1.5)]);
		}

		// Calculate the hexagon width
		var hexWidth = hexRadius * Math.sqrt(3);
		// Create an array into which we will put points along the
		// boundaries between differing hexes.

		// Each segment will be of the form
		// {x: <start point X>, y: <start point Y>, cx: <difference X>, cy: <difference Y> }
		// intended to be used with the simple line drawing functionality of d3
		//

		var segments = [];
		const hexRadiusSquared = hexRadius * hexRadius * 4;
		const maxHex = hexes.length;
		if (maxHex > 1) {
			hexes.forEach(function (hex) {
				hex.qc = hex.q - qmin;
				hex.rc = rmax - hex.r;

				// Calculate the x and y position of each hex for this svg
				hex.x = getX(hex, layout, hexWidth, hexRadius);
				hex.y = getY(hex, layout, hexWidth, hexRadius);
			});
			for (var i = 0; i < maxHex - 1; i++) {
				for (var j = i + 1; j < maxHex; j++) {
					var hex = hexes[i];
					var otherHex = hexes[j];
					if (hex[field] !== otherHex[field]) {
						if (Math.abs(hex.q - otherHex.q) <= 1 &&
							Math.abs(hex.r - otherHex.r) <= 1) {
							if (((hex.x - otherHex.x) * (hex.x - otherHex.x)) +
								((hex.y - otherHex.y) * (hex.y - otherHex.y)) < hexRadiusSquared) {
								// They're neighbours
								var midpoint = {};
								midpoint.x = otherHex.x + (hex.x - otherHex.x) / 2;
								midpoint.y = otherHex.y + (hex.y - otherHex.y) / 2;
								var perp = {};
								var direction = +1;
								if (hex[field] < otherHex[field]) {
									direction = -1;
								} // otherwise, direction will be +1
								const denom = Math.sqrt(3) * 2 * direction;
								perp.dx = (hex.y - otherHex.y) / denom;
								perp.dy = -(hex.x - otherHex.x) / denom;
								segments.push({
									x1: midpoint.x - perp.dx,
									y1: midpoint.y - perp.dy,
									x2: midpoint.x + perp.dx,
									y2: midpoint.y + perp.dy});
							}
						}
					}
				}
			}
		}
		return segments;
	}

	exports.renderHexJSON = renderHexJSON;
	exports.getGridForHexJSON = getGridForHexJSON;
	exports.getBoundaryDotsForHexJSON = getBoundaryDotsForHexJSON;
	exports.getBoundarySegmentsForHexJSON = getBoundarySegmentsForHexJSON;

	Object.defineProperty(exports, '__esModule', { value: true });

}));