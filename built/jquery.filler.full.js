
/**
 * @module jquery.filler
 * @submodule helpers
 */

define('__jquery.filler/helpers',['require','exports','module','lodash'],function (require, exports, module) {
	

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

/**
 * @module jquery.filler
 * @submodule attribute
 */

define('__jquery.filler/method',['require','exports','module','jquery','lodash','./helpers'],function (require, exports, module) {
	

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
			// BE CAREFUL: we must clone the original args object.
			var fillArgs = _.clone(args);
			fillArgs.push(value);

			return $el[method].apply($el, fillArgs);
		};
	};
});

/**
 * @module jquery.filler
 * @submodule element
 */

define('__jquery.filler/html',['require','exports','module','jquery','lodash'],function (require, exports, module) {
	

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

/**
 * Defines functionality for creating a filler for a single
 * html/html-method.
 *
 * @module jquery.filler
 * @submodule singleFiller
 */

define('__jquery.filler/single',['require','exports','module','jquery','lodash','./helpers','./method','./html'],function (require, exports, module) {
	

	var $ = require('jquery'),
		_ = require('lodash');

	var h = require('./helpers'),
		methodFiller = require('./method'),
		htmlFiller = require('./html');

	/**
	 * Creates a filler function for a single $el/$el method.
	 *
	 * @method singleFiller
	 * @param $parent {jquery}
	 * @param selector {String}
	 */
	var singleFiller = module.exports = function singleFiller($parent, selector) {

		// normalize parameters
		if (arguments.length === 1 && _.isString($parent)) {
			selector = $parent;
			$parent = $(window);
		}

		if (_.isArray(selector)) {
			// if the selector is an array, return an aggregate function
			// that fills both selectors.

			// [1] retrieve the 'subfill' methods
			var subfills = _.map(selector, _.partial(singleFiller, $parent));

			// [2] build an aggregate fill and return it.
			return function fill(value) {
				_.each(subfills, function (f) { f(value); });
			};

		} else {
			// [1] parse selector
			selector = h.splitInto(selector, '->', 'element->method');

			// [2] retrieve $el
			var $el = selector.element ?
				$parent.find(selector.element) :
				$parent;

			return selector.method ?
				methodFiller($el, selector.method) :
				htmlFiller($el);
		}
	};
});

/**
 * Builds filler functions given an $el and a map object.
 *
 * @module jquery.filler
 * @submodule mapFillers
 */

define('__jquery.filler/map-fillers',['require','exports','module','jquery','lodash','./single'],function (require, exports, module) {
	

	var $ = require('jquery'),
		_ = require('lodash');

	var singleFiller = require('./single');

	/**
	 *
	 *
	 * @method mapFillers
	 * @param $el {jq Object}
	 * @param map {Object}
	 */
	var mapFillers = module.exports = function mapFillers($el, map) {

		// retrieve single fillers
		var fillers = {};
		_.each(map, function (selector, prop) {
			fillers[prop] = singleFiller($el, selector);
		});

		return fillers;
	};
});

//     jquery.filler
//     (c) simonfan
//     jquery.filler is licensed under the MIT terms.

/**
 * @module jquery.filler
 */

define('jquery.filler',['require','exports','module','jquery','lodash','./__jquery.filler/map-fillers'],function (require, exports, module) {
	

	var $ = require('jquery'),
		_ = require('lodash');

	var mapFillers = require('./__jquery.filler/map-fillers');

	/**
	 * Generates a fill function.
	 *
	 * @method filler
	 * @param [$el] {jQuery wrapper} defaults to 'this'
	 * @param map {Object}
	 *     Hash of property names, keyed by sizzle selector.
	 *     { selector: propName }
	 */
	var filler = module.exports = function filler($parent, map, no_cache) {

		if (arguments.length === 1) {
			/**
			 * If the function was invoked with only one argument,
			 * it means that it was invoked as a '$parent's method.
			 */
			map = $parent;
			$parent = this;
		}


		// variable only accessible to internal methods.
		var _private_ = {};

		// [1] retrieve single fillers
		_private_.fillers = mapFillers($parent, map);


		/**
		 * Var that holds the last set data.
		 * These values will be verified before calling
		 * any filler, so that constant values are not "re-filled"
		 * in the dom.
		 *
		 * @prop currentData
		 * @private
		 */
		_private_.currentData = {};

		/**
		 * Receives a data hash keyed by selector.
		 *
		 * @method fill
		 * @param data {Object}
		 *     Hash of values, keyed by the propNames defined before.
		 *     { propName: value }
		 */
		var fill = function fill(data) {
				// if no_cache is set, update fillers all the time.
			var fillers = no_cache ? mapFillers($parent, map) : _private_.fillers,
				currentData = _private_.currentData;

			_.each(data, function (value, prop) {

				// only fill the DOM with the value if it is different
				// from the current value.
				if (currentData[prop] !== value) {
					// fillers is stored in the closure.
					var filler = fillers[prop];

					// do NOTHING if no filler was defined
					// BUG ISSUE: #1 - Undefined fillers
					if (filler) {
						filler(value);

						// set currentData
						currentData[prop] = value;
					}
				}
			});
		};

		/**
		 * Reselects elements from the map. Rebuilds fillers.
		 *
		 * @method update
		 */
		fill.update = function update() {
			_private_.fillers = mapFillers($parent, map);
		};

		return fill;
	};


	$.prototype.filler = filler;
});
