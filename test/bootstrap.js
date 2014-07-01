require(['../src/js/require-config'], function () {

	require.config({
		baseUrl: '../src/js',
		paths: {
			'mocha': '../vendor/mocha/mocha',
			'chai': '../vendor/chai/chai',
			'chai-as-promised': '../vendor/chai-as-promised/lib/chai-as-promised',
			'squire': '../vendor/squire/src/Squire',
			'sinon': '../vendor/sinon/lib/sinon',
			'sinon-chai': '../vendor/sinon-chai/lib/sinon-chai',
			'spec': '/spec',
		},
		shim: {
			mocha: {
				exports: 'mocha'
			}
		}
	});

	require([
		'mocha',
		'chai',
		'chai-as-promised',
		'sinon-chai',
		'squire',
		'polyfills',
	], function (mocha, chai, chaiAsPromised, sinonChai, Squire) {
		mocha.setup('bdd');
		chai.should();
		chai.use(chaiAsPromised);
		chai.use(sinonChai);

		Squire.prototype.promise = function() {
			var deps = Array.prototype.slice.call(arguments, 0);
			return new Promise(function(resolve, reject) {
				this.require(deps, resolve, reject);
			}.bind(this));
		};

		var specs = [
			'spec/opds/discover.spec',
			'spec/opds/catalog.spec',
			'spec/app/init.spec',
		];

		require(specs, mocha.run);
	});

});
