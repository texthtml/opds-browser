define(['opds/tools', 'atom/atom', 'opds/entry'], function(tools, atom, Entry) {
	'use strict';

	var Catalog = function(document) {
		atom.feed.call(this, document);

		Object.defineProperties(this, {
			start: {
				value: link(this.document, 'feed > link[rel=start]')
			},
			next: {
				value: link(this.document, 'feed > link[rel=next]')
			},
			previous: {
				value: link(this.document, 'feed > link[rel=previous]')
			},
		});
	};

	Catalog.prototype = Object.create(atom.feed.prototype, {
		kind: {
			get: function() {
				var link    = this.document.querySelector('link[rel=self]');
				var type    = link.getAttribute('type');
				var matches = /kind=([^;\s]+)/g.exec(type);

				return matches === null ? 'navigation' : matches[1];
			}
		},
		entries: {
			get: function() {
				var entries = Array.prototype.slice.call(this.document.querySelectorAll('feed > entry'));

				return entries.map(function(entryNode) {
					return new Entry(entryNode, function(href) {
						var uri = tools.resolveUri(this.node.ownerDocument.baseURI, href);
						return tools.get(uri).then(function(response) {
							return new Catalog(response);
						});
					});
				});
			}
		},
		subtitle: {
			get: function() {
				return text(this.document, 'feed > subtitle');
			},
			enumerable: true
		},
		icon: {
			get: function() {
				var href = text(this.document, 'feed > icon');

				if (href === false) {
					return false;
				}

				return tools.resolveUri(
					this.document.baseUri,
					href
				);
			},
			enumerable: true
		},
	});

	Catalog.prototype.contructor = Catalog;

	var linkUri = function(document, selector) {
		var link = document.querySelector(selector);

		if (link === null) {
			return null;
		}

		return tools.resolveUri(
			document.baseURI,
			link.getAttribute('href')
		);
	};

	var link = function(document, selector) {
		var uri = linkUri(document, selector);

		if (uri === null) {
			return false;
		}

		return {
			catalog: function() {
				return tools.get(uri).then(function(response) {
					return new Catalog(response);
				});
			}
		};
	};

	var text = function(document, selector) {
		var node = document.querySelector(selector);

		if (node === null) {
			return false;
		}

		return node.textContent;
	};

	return Catalog;
});

