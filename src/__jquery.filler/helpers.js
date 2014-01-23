/**
 * @module jquery.filler
 * @submodule helpers
 */

define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');


	exports.splitter = function splitter(s) {
		return new RegExp('\\s*' + s + '\\s*');
	};

	/**
	 *
	 *
	 * @method splitInto
	 * @param string {String} string to be split
	 * @param separator {String}
	 * @param format {String}
	 */
	exports.splitInto = function splitInto(string, separator, format) {

		// build a separator.
		separator = exports.splitter(separator);

		// destination
		format = format.split(separator);

		// get the source array
		var source = string.split(separator);

		// zip and return happily :)
		return _.zipObject(format, source);
	};
});
