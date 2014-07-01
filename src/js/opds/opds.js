define(['opds/tools', 'opds/catalog'], function(tools, Catalog) {
	'use strict';

	return {
		catalog:  function(uri) {
			return tools.get(uri).then(function(response) {
				if (response === null) {
					window.open(uri);

					return tools.get(uri).then(function(response) {
						return new Catalog(response);
					});
				}

				return new Catalog(response);
			});
		},
	};
});
