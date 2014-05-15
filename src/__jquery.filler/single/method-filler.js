/**
 * @module jquery.filler
 * @submodule attribute
 */

define(function (require, exports, module) {
	'use strict';

	var $ = require('jquery'),
		_ = require('lodash');
	/**
	 * Generates a filler function for an attribute.
	 *
	 * @method methodFiller
	 * @param $el {jQuery} The element on which perform task
	 * @param methodData {String}
	 */
	var methodFiller = module.exports = function methodFiller($el, methodData) {

		var methodName = methodData.name,
			methodArgs = methodData.arguments;

		/**
		 * @method fillAttribute
		 * @param value {*}
		 */
		return function fillElementAttribute(value) {
			// add value to methodArgs
			// BE CAREFUL: we must clone the original methodArgs object.
			var fillArgs = _.clone(methodArgs);
			fillArgs.push(value);

			return $el[methodName].apply($el, fillArgs);
		};
	};
});
