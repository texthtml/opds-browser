define(['squire', 'sinon'], function(Squire, sinon) {
	'use strict';


	describe("App config initialization", function() {
		var sandbox;
		var injector;
		var app;
		var localforage;
		var debug;

		beforeEach(function () {
			sandbox = sinon.sandbox.create();

			app = {
				name: 'App name'
			};

			localforage = {
				ready: Promise.resolve,
				setItem: Promise.resolve,
				config: function() {}
			};

			injector = new Squire();
			injector.mock('localforage', localforage);
			injector.mock('app/info', {name: 'App name'});

			debug = sandbox.spy(console, 'debug');
		});

		afterEach(function () {
			sandbox.restore();
		});

		it('setup basic configuration on first run', function() {

			localforage.getItem = sandbox.stub().withArgs('version').returns(Promise.resolve(null));
			var setItem = sandbox.spy(localforage, 'setItem');

			return injector.promise('app/init').then(function(init) {
				return init().then(function() {
					setItem.should.have.been.calledWithExactly('version', '1.0');
					setItem.should.have.been.calledWithExactly('opds-feeds', [{
						uri: '/vendor/opds-test-catalog/root.xml',
						title: 'Feedbooks Test Catalog',
					}, {
						uri: 'http://m.gutenberg.org/ebooks.opds/',
						title: 'Project Gutenberg',
					}]);
					debug.should.have.been.calledWithExactly('App name', null);
					debug.should.have.been.calledWithExactly('App name upgraded to 1.0');
				});
			});
		});

		it('does nothing on second run', function() {

			localforage.getItem = sandbox.stub().withArgs('version').returns(Promise.resolve('1.0'));

			return injector.promise('app/init').then(function(init) {
				return init().then(function() {
					debug.should.have.been.calledWithExactly('App name', '1.0');
					debug.should.have.been.calledOnce;
				});
			});
		});
	});
});
