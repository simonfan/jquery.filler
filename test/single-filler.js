(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'../src/__jquery.filler/single',
		// dependencies for the test
		deps = [mod, 'should', 'text!../test/fixture.html'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(singleFiller, should, fixture) {
	'use strict';


	describe('singleFiller', function () {
		beforeEach(function () {
			this.$fixture = $(fixture).appendTo($('body'));
		});

		afterEach(function () {
			this.$fixture.remove();
		});

		it('fill multiple elements with the same', function () {
			var $div = this.$fixture.find('#div'),
				$a = this.$fixture.find('a'),
				$radio = this.$fixture.find('input[name="food"]');

			var fillDivAndRadioAndA =
				singleFiller(this.$fixture, [
					'#div',
					'a',
					'a -> prop:id',
					'input[name="food"]'
				]);

			var value = 'feijoada';

			fillDivAndRadioAndA(value);

			$div.html().should.eql(value);
			$a.html().should.eql(value);
			$a.prop('id').should.eql(value);
			$radio.filter(':checked').val().should.eql(value);
		});

		describe('fill element attributes', function () {

			it('modifies any style on the element', function () {

				var $div = this.$fixture.find('#div'),
					fillBG = singleFiller(this.$fixture, '#div -> css:background-color'),
					setWidth = singleFiller(this.$fixture, '#div -> css:width');

				fillBG('#000000');
				$div.css('background-color').should.eql('rgb(0, 0, 0)');

				setWidth(600);
				$div.css('width').should.eql('600px');
			});

			it('modifies attributes on the element', function () {

				var $a = this.$fixture.find('a'),
					setHref = singleFiller(this.$fixture, 'a->prop:href');

				$a.prop('href').should.eql('');
				setHref('http://padd.co/');

				$a.prop('href').should.eql('http://padd.co/');
			});
		});


		describe('fill elements', function () {

			it('div fills html', function () {
				// check that div is empty
				var $div = this.$fixture.find('#div'),
					original = $div.html();
				original.should.be.exactly('');

				var fillDiv = singleFiller(this.$fixture, '#div');

				fillDiv('Some value');

				$div.html().should.eql('Some value');
			});

			it('img fills src', function () {
				// check that img->src is empty
				var $img = this.$fixture.find('#img'),
					original = $img.prop('src');
				original.should.be.exactly('');

				var fillImg = singleFiller(this.$fixture, '#img');

				fillImg('http://someimage.com/');

				$img.prop('src').should.eql('http://someimage.com/');
			});

			it('select sets value through jqueryl.val(value)', function () {
				var $select = this.$fixture.find('select'),
					original = $select.val();

				original.should.be.eql('bananas');

				var fillSelect = singleFiller(this.$fixture, '.select');

				fillSelect('apples');

				$select.val().should.eql('apples');
			});

			it('checkboxes', function () {
				var $checkboxes = this.$fixture.find('input[name="animals"]'),
					original = _.map($checkboxes.filter(':checked'), function (checkbox) {
						return $(checkbox).val();
					});

				original.should.be.eql([]);

				var fillCheckboxes = singleFiller(this.$fixture, 'input[name="animals"]');

				// fill with string
				fillCheckboxes('lion');

				var after = _.map($checkboxes.filter(':checked'), function (cbx) {
					return $(cbx).val();
				});

				after.should.eql(['lion']);

				// fill with array
				fillCheckboxes(['tiger', 'wolf']);

				var after1 = _.map($checkboxes.filter(':checked'), function (cbx) {
					return $(cbx).val();
				});

				after1.should.eql(['tiger', 'wolf']);
			});

			it('radio buttons', function () {
				var $radios = this.$fixture.find('input[type=radio]'),
					original = $radios.filter(':checked').val();

				should(original).eql(void(0));

				var fillRadios = singleFiller(this.$fixture, 'input[type=radio]');

				fillRadios('vegetables');

				$radios.filter(':checked').val().should.eql('vegetables');
			});

			it('text input', function () {
				var $text = this.$fixture.find('input[name="some-text"]'),
					original = $text.val();

				should(original).be.eql('');

				var fillText = singleFiller(this.$fixture, 'input[name="some-text"]');

				fillText('Some value!!!!');

				$text.val().should.eql('Some value!!!!');
			});

			it('textarea', function () {

			})
		});

	});
});
