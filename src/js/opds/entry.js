define(['opds/tools'], function(tools) {
		'use strict';

	var Entry = function(node, catalogLoader) {
		Object.defineProperty(this, 'node' ,{
			value: node
		});
		Object.defineProperty(this, 'catalogLoader' ,{
			value: catalogLoader
		});
	};

	Entry.prototype = Object.create({}, {
		title: {
			get: function() {
				var el = this.node.querySelector('title');

				if (el !== null) {
					return el.textContent;
				}
			},
			enumerable: true
		},
		content: {
			get: function() {
				var el = this.node.querySelector('content');

				if (el !== null) {
					return el.textContent;
				}
			},
			enumerable: true
		},
		subsection: {
			get: function() {
				var link = this.node.querySelector('link[rel=subsection]');

				if (link === null) {
					return false;
				}

				var type = link.getAttribute('type');
				var matches = /kind=([^;\s]+)/g.exec(type);
				var kind = 'acquisition';

				if (matches !== null) {
					kind = matches[1];
				}

				var href = link.getAttribute('href');
				var uri = tools.resolveUri(this.node.baseURI, href);

				return {
					kind: kind,
					href: uri,
					catalog: function() {
						return this.catalogLoader(uri);
					}.bind(this)
				};
			},
			enumerable: true
		},
		image: {
			get: function() {
				var link = this.node.querySelector('link[rel="http://opds-spec.org/image"]');

				if (link === null) {
					return false;
				}

				return tools.resolveUri(this.node.baseURI, link.getAttribute('href'));
			},
			enumerable: true
		},
		thumbnail: {
			get: function() {
				var link = this.node.querySelector('link[rel="http://opds-spec.org/image/thumbnail"]');

				if (link === null) {
					return false;
				}

				return tools.resolveUri(this.node.baseURI, link.getAttribute('href'));
			},
			enumerable: true
		},
	});

	Entry.prototype.contructor = Entry;

	return Entry;
});

