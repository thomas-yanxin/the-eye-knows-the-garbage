"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LevDist = require("levdist");

var Change =
/*!
 * Change
 * This is used for comparing two lines.
 *
 * @name Change
 * @function
 * @param {String} oldLine The old line value.
 * @param {String} addedLine The new line.
 * @param {Number} sensitivity The diff sensitivity.
 * @return {Change} The `Change` object:
 *
 *  - `_` (Array): An array with the old line and the new line.
 *  - `changes` (Number): How many changes are there, calculated with the levenshtein distance algorithm.
 *  - `modified` (Boolean): A boolean value representing if the old line was modified or not.
 */
function Change(oldLine, addedLine, sensitivity, lineno) {
    _classCallCheck(this, Change);

    this._ = [oldLine, addedLine];
    this.changes = LevDist(oldLine, addedLine);
    this.modified = this.changes > sensitivity;
    this.lineno = lineno;
};

var Diff = function () {
    /**
     * Diff
     * Compares strings line by line.
     *
     * @name Diff
     * @function
     * @param {String|Array} oldLines The old lines.
     * @param {String|Array} newLines The new lines.
     * @param {Number} sensitivity A number representing how many changes should be there to consider that a line was changed (default: `0`).
     * @return {Diff} The `Diff` object containing:
     *
     *  - `old_lines` (Array|String): The old lines.
     *  - `new_lines` (Array|String): The new lines.
     *  - `sensitivity` (Number): The diff sensitivity.
     *  - `changes` (Array): An array of `Change` objects.
     *  - `toString` (Function): A function to stringify the diff.
     */
    function Diff(oldLines, newLines, sensitivity) {
        var _this = this;

        _classCallCheck(this, Diff);

        this.sensitivity = sensitivity || 0;
        this.changes = [];

        // Convert to array
        oldLines = typeof oldLines === "string" ? oldLines.split("\n") : oldLines;
        newLines = typeof newLines === "string" ? newLines.split("\n") : newLines;

        this.old_lines = oldLines;
        this.new_lines = newLines;

        // Iterate the new lines
        var cOldLine = null;
        newLines.forEach(function (cNewLine, i) {
            cOldLine = oldLines[i] || "";
            _this.changes.push(new Change(cOldLine, cNewLine, _this.sensitivity, i + 1));
        });
    }

    /**
     * toString
     * Converts the lines comparison into a string.
     *
     * @name toString
     * @function
     * @return {String} The stringified diff.
     */


    _createClass(Diff, [{
        key: "toString",
        value: function toString() {

            var str = "",
                cDiff = { added: "", removed: "" };

            this.changes.forEach(function (cChange) {
                if (!cChange.modified) {
                    str += cDiff.removed;
                    str += cDiff.added;
                    cDiff.removed = "";
                    cDiff.added = "";
                    str += "   " + cChange._[1] + "\n";
                } else {
                    cDiff.removed += " - " + cChange._[0] + "\n";
                    if (cChange._[1]) {
                        cDiff.added += " + " + cChange._[1] + "\n";
                    }
                }
            });

            str += cDiff.removed;
            str += cDiff.added;

            return str;
        }
    }]);

    return Diff;
}();

module.exports = Diff;