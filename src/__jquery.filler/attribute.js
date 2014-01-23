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
	 * @method attributeFiller
	 * @param $el {jQuery} The element on which perform task
	 * @param attributeSelector {String}
	 */
	var attributeFiller = module.exports = function attributeFiller($el, attributeSelector) {
		// parse
		var options = h.splitInto(attributeSelector, ':', 'method:attribute');

		/**
		 * @method fillAttribute
		 * @param value {*}
		 */
		return function fillElementAttribute(value) {
			return $el[options.method](options.attribute, value);
		};
	};
});
