/**
 * @module jquery.filler
 * @submodule attribute
 */

define(function (require, exports, module) {
	'use strict';

	var $ = require('jquery'),
		_ = require('lodash');

	var h = require('./helpers');

	/**
	 * Generates a filler function for an attribute.
	 *
	 * @method methodFiller
	 * @param $el {jQuery} The element on which perform task
	 * @param methodString {String}
	 */
	var methodFiller = module.exports = function methodFiller($el, methodString) {
			// parse options
		var options = h.splitInto(methodString, ':', 'method:argumentsString'),
			// method
			method = options.method,
			// parse out arguments
			args = options.argumentsString ? options.argumentsString.split(':') : [];

		/**
		 * @method fillAttribute
		 * @param value {*}
		 */
		return function fillElementAttribute(value) {
			// add value to args
			args.push(value);

			return $el[method].apply($el, args);
		};
	};
});
