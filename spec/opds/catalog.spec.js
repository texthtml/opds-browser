define(['squire', 'sinon'], function(Squire, sinon) {
	'use strict';

	describe('Catalog Root', function() {
		var injector;
		var tools;
		var sandbox;

		beforeEach(function () {
			sandbox = sinon.sandbox.create();

			tools = {
				get: function(uri) {
					return new Promise(function(resolve, reject) {
						var xhr = new XMLHttpRequest();
						xhr.onreadystatechange = function(event) {
							if (this.readyState !== 4) {
								return;
							}

							if (this.status >= 400) {
								reject(new Error(this.statusText));
								return;
							}

							resolve(this.response);
						};

						xhr.open('GET', '/src/vendor/opds-test-catalog/'+uri);
						xhr.responseType = 'document';
						xhr.send();
					});
				},
				resolveUri: function(documentUri, href) {
					if (href.trim() === '../root.xml') {
						return 'root.xml';
					}

					if (href === 'page2.xml') {
						return 'acquisition/page2.xml';
					}

					if (href === 'main.xml') {
						return 'acquisition/main.xml';
					}

					throw new Error('cannot resolve href : ' + href);
				},
			};

			injector = new Squire();
			injector.mock('opds/tools', tools);
		});

		afterEach(function () {
			sandbox.restore();
		});

		it('can load an opds catalog', function() {
			return injector.promise('opds/opds').then(function(opds) {
				return opds.catalog('root.xml').should.eventually.be.an('Object');
			});
		});

		it('can get the Catalog title', function() {
			return injector.promise('opds/opds').then(function(opds) {
				return opds.catalog('root.xml').then(function(catalog) {
					catalog.title.should.equal('Test Catalog Root');
				});
			});
		});

		it('can get the Catalog metadata', function() {
			return injector.promise('opds/opds').then(function(opds) {
				return opds.catalog('root.xml').then(function(catalog) {
					catalog.id.should.equal('root.xml');
					catalog.updated.toUTCString().should.equal('Sat, 20 Oct 2012 01:11:18 GMT');
					catalog.author.should.deep.equal({
						name: 'Hadrien Gardeur',
						uri: 'https://github.com/Feedbooks',
						email: undefined,
					});
				});
			});
		});

		it('can get the Catalog start', function() {
			return injector.promise('opds/opds').then(function(opds) {
				return opds.catalog('acquisition/main.xml').then(function(catalog) {
					catalog.id.should.equal('main.xml');
					catalog.title.should.equal('First Acquisition Feed');
					return catalog.start.catalog().then(function(catalog) {
						catalog.id.should.equal('root.xml');
					});
				});
			});
		});

		it('knows if there is a next page', function() {
			return injector.promise('opds/opds').then(function(opds) {
				return Promise.all([
					opds.catalog('root.xml').then(function(catalog) {
						catalog.next.should.be.false;
					}),
					opds.catalog('acquisition/main.xml').then(function(catalog) {
						catalog.next.should.not.be.false;
					})
				]);
			});
		});

		it('can get the next page', function() {
			return injector.promise('opds/opds').then(function(opds) {
				return opds.catalog('acquisition/main.xml').then(function(catalog) {
					return catalog.next.catalog().then(function(catalog) {
						catalog.id.should.equal('page2.xml');
						catalog.title.should.equal('Second Page');
					});
				});
			});
		});

		it('knows if there is a previous page', function() {
			return injector.promise('opds/opds').then(function(opds) {
				return Promise.all([
					opds.catalog('root.xml').then(function(catalog) {
						catalog.previous.should.be.false;
					}),
					opds.catalog('acquisition/page2.xml').then(function(catalog) {
						catalog.previous.should.not.be.false;
					})
				]);
			});
		});

		it('can get the next page', function() {
			return injector.promise('opds/opds').then(function(opds) {
				return opds.catalog('acquisition/page2.xml').then(function(catalog) {
					return catalog.previous.catalog().then(function(catalog) {
						catalog.id.should.equal('main.xml');
						catalog.title.should.equal('First Acquisition Feed');
					});
				});
			});
		});

		it('can detect if it\'s acquisition or navigation kind', function() {
			return injector.promise('opds/opds').then(function(opds) {
				return Promise.all([
					opds.catalog('acquisition/main.xml').then(function(catalog) {
						catalog.kind.should.equal('acquisition');
					}),
					opds.catalog('root.xml').then(function(catalog) {
						catalog.kind.should.equal('navigation');
					})
				]);
			});
		});
	});
});
