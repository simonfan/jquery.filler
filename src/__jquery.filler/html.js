/**
 * @module jquery.filler
 * @submodule element
 */

define(function (require, exports, module) {
	'use strict';

	var $ = require('jquery'),
		_ = require('lodash');

	/**
	 * Holds the html tag elFillers.
	 *
	 * @class elFillers
	 * @static
	 */
	var elFillers = {
		default: function ($el, value) {
			return $el.html(value);
		},
		INPUT: function ($el, value) {
			/**
			 * intercept only filling for checkboxes and radios
			 * as the default jquery .val() method sets the checkboxes and radio input
			 * values instead of checking them (if the value is not passed in as an array)
			 */
			var type = $el.prop('type');

			if (type === 'checkbox' || type === 'radio') {
				value = _.isArray(value) ? value : [value];
			}

			return $el.val(value);
		},
		SELECT: function ($el, value) {
			return $el.val(value);
		},
		IMG: function ($el, value) {
			// trigger a change event when changing the image src
			return $el.prop('src', value).trigger('change', value);
		},

		TEXTAREA: function ($el, value) {
			return $el.val(value);
		},
	};


	/**
	 * Generates a filler function.
	 *
	 * @method elementFiller
	 * @param $el {jQuery} The element on which perform task
	 */
	var elementFiller = module.exports = function elementFiller($el) {
		var tag = $el.prop('tagName'),
			filler = elFillers[tag] || elFillers['default'];

		/**
		 * Fills the element with a given value,
		 * using different 'filling-strategies' for each html tag.
		 *
		 * @method fillElement
		 * @param value
		 */
		return function fillElement(value) {
			return filler($el, value);
		};
	};
});
