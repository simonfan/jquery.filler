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
	 * @method htmlFiller
	 * @param $selection {jQuery} The element on which perform task
	 */
	var htmlFiller = module.exports = function htmlFiller($selection) {

		// [1] create a var to hold $elements grouped by their tagNames
		var byTag = {};

		// [2] loop through the $selection
		_.each($selection, function (el) {

			var $el = $(el);

			// [2.1] get $el tagName
			var tagName = $el.prop('tagName');

			// [2.2] check if there is a group for that tagName
			if (byTag[tagName]) {
				byTag[tagName] = byTag[tagName].add(el);
			} else {
				byTag[tagName] = $el;
			}
		});

		/**
		 * Fills the element with a given value,
		 * using different 'filling-strategies' for each html tag.
		 *
		 * @method fillElement
		 * @param value
		 */
		return function fillElement(value) {
			// loop through the elements grouped by tagname and fill
			_.each(byTag, function ($el, tag) {

				var fill = elFillers[tag] || elFillers['default'];
				fill($el, value);
			});
		};
	};
});
