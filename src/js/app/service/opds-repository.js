define(['localforage', 'opds/opds'],
	function(localforage, opds) {
		'use strict';

		var opdsRepository = {
			all: function() {
				return localforage.getItem('opds-feeds').then(function(opdsFeeds) {
					var catalogs = [];

					for(var id in opdsFeeds) {
						var opdsFeed = opdsFeeds[id];
						catalogs.push(opds.catalog(opdsFeed.uri).then(function(id, title) {
							return function(catalog) {
								return {
									id: id,
									title: title,
									catalog: catalog
								};
							};
						} (id, opdsFeed.title)));
					}

					return Promise.all(catalogs);
				});
			},
			find: function(id) {
				return opdsRepository.all().then(function(catalogs) {
					return catalogs[id];
				});
			}
		};

		var opdsRepositoryProxy = {};
		for(var methodName in opdsRepository) {
			opdsRepositoryProxy[methodName] = (function(method) {
				return function() {
					var args = arguments;
					return localforage.ready().then(function() {
						return method.apply(this, args);
					});
				};
			}) (opdsRepository[methodName]);
		}

		return ['opdsRepository', [function() {
			return opdsRepositoryProxy;
		}]];
	}
);
