(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'jquery.filler',
		// dependencies for the test
		deps = [mod, 'should', 'text!../test/fixture.html'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(filler, should, fixture) {
	'use strict';

	describe('$(el).filler({ ... })', function () {
		beforeEach(function () {
			this.$fixture = $(fixture).appendTo($('body'));
		});

		afterEach(function () {
			this.$fixture.remove();
		})

		it('works!', function () {
			var fillFixture = $('#fixture').filler({
				'divText'    : 'div',
				'divColor'   : 'div -> css:color',
				'divBG'      : 'div -> css:background-color',
				'anchorTitle': 'a',
				'anchorHref' : 'a -> prop:href',
				'animals'    : 'input[name="animals"]'
			});

			var data = {
				divText      : 'Lorem ipsum dolor sit amet',
				divColor     : 'red',
				divBG        : 'blue',
				anchorTitle  : 'Padd',
				anchorHref   : 'http://padd.co/',
				animals      : ['cat', 'wolf']
			};

			fillFixture(data)

			var $f = this.$fixture,
				$div = $f.find('#div'),
				$a = $f.find('a'),
				$checkboxes = $f.find('input[name="animals"]');

			$div.html().should.eql(data.divText);
			$div.css('color').should.eql('rgb(255, 0, 0)');
			$div.css('background-color').should.eql('rgb(0, 0, 255)');

			$a.html().should.eql('Padd');
			$a.prop('href').should.eql(data.anchorHref);

			_.map($checkboxes.filter(':checked'), function (cbx) {
				return $(cbx).val();
			})
			.should.eql(['cat', 'wolf']);
		});

		it('caches selections', function () {

			// [1] create a filler
			var fillFixture = $('#fixture').filler({
				'divText': 'div',
			});

			// [2] append a div to the filler AFTER the filler has already been created.
			var $original = $('#fixture').find('div');
			var $afterDiv = $('<div id="after-div">AFTER</div>').appendTo($('#fixture'));

			// [3] call fill
			fillFixture({
				divText: 'qwertyuiop'
			});

			// [4] original div should have been filled
			$original.html().should.eql('qwertyuiop');
			$afterDiv.html().should.eql('AFTER');

			// [5] call update method
			fillFixture.update();

			// [6] fill again
			fillFixture({
				divText: 'new text'
			});

			// [7] test again: both should have same text
			$original.html().should.eql('new text');
			$afterDiv.html().should.eql('new text');


		});

		it('ignores data that has no filler defined for it.', function () {
			var fillFixture = $('#fixture').filler({
				'divText': 'div'
			});

			// call fill with some extra data
			fillFixture({
				divText: 'asfghjkl',
				nonExistentProperty: 'zxcvbnm'
			})
		});
	});
});
