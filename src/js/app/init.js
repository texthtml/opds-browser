define(['localforage', 'app/info'], function(localforage, app) {
	'use strict';

	return function() {
		return localforage.ready().then(function() {
			localforage.config({
				name: app.name
			});

			return localforage.getItem('version').then(function(version) {
				var lastVersion = '1.0';

				console.debug(app.name, version);

				if (version === lastVersion) {
					return;
				}

				var upgrade = new Promise(function(resolve) {
					resolve();
				});

				switch(version) {
					case null: // first run
						upgrade = upgrade.then(function() {
							return localforage.setItem('opds-feeds', [{
								uri: '/vendor/opds-test-catalog/root.xml',
								title: 'Feedbooks Test Catalog',
							}, {
								uri: 'http://m.gutenberg.org/ebooks.opds/',
								title: 'Project Gutenberg',
							}]);
						});
						/* falls through */
					default:
						upgrade = upgrade.then(function() {
							return localforage.setItem('version', lastVersion);
						}).then(function() {
							console.debug(app.name + ' upgraded to ' + lastVersion);
						});
				}

				return upgrade;
			});
		});
	};
});
