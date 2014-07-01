define(['squire', 'sinon'], function(Squire, sinon) {
	'use strict';

	describe('Discovering OPDS Catalogs', function() {
		var injector;
		var tools;
		var sandbox;

		beforeEach(function () {
			sandbox = sinon.sandbox.create();

			tools = {};

			injector = new Squire();
			injector.mock('opds/tools', tools);
		});

		afterEach(function () {
			sandbox.restore();
		});

		it('discovers link to OPDS catalogs in HTML markup', function() {
			var html = '<link type="application/atom+xml;profile=opds-catalog" title="OPDS feed" href="/ebooks.opds/"/>';

			return injector.promise('opds/discover').then(function(discover) {
				return discover.html(html).should.become([{
					href: '/ebooks.opds/',
					title: 'OPDS feed',
					type: 'catalog'
				}]);
			});
		});

		it('discovers link to OPDS entries in HTML markup', function() {
			var html = '<link type="application/atom+xml;type=entry;profile=opds-catalog" title="OPDS feed" href="/ebooks.opds/some-entry"/>';

			return injector.promise('opds/discover').then(function(discover) {
				return discover.html(html).should.become([{
					href: '/ebooks.opds/some-entry',
					title: 'OPDS feed',
					type: 'entry'
				}]);
			});
		});

		it('discovers link to OPDS catalogs in remote document', function() {
			tools.get = sandbox.stub().withArgs('http://some.uri').returns(
				new Promise(function(resolve, reject) {
					resolve('<link type="application/atom+xml;profile=opds-catalog" title="OPDS feed" href="/ebooks.opds/"/>');
				})
			);

			return injector.promise('opds/discover').then(function(discover) {
				return discover.url('http://some.uri').should.become([{
					href: '/ebooks.opds/',
					title: 'OPDS feed',
					type: 'catalog'
				}]);
			});
		});
	});
});
