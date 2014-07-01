define(function() {
	'use strict';

	var text = function(document, selector) {
		var node = document.querySelector(selector);

		if (node === null) {
			return undefined;
		}

		return node.textContent;
	};

	var Feed = function(document) {
		Object.defineProperty(this, 'document' ,{
			value: document
		});
	};

	Feed.prototype = Object.create({}, {
		id: {
			get: function() {
				return text(this.document, 'feed > id');
			}
		},
		title: {
			get: function() {
				return text(this.document, 'feed > title');
			}
		},
		updated: {
			get: function() {
				return new Date(text(this.document, 'feed > updated'));
			}
		},
		author: {
			get: function() {
				return {
					name: text(this.document, 'feed > author > name'),
					uri: text(this.document, 'feed > author > uri'),
					email: text(this.document, 'feed > author > email'),
				};
			}
		},
	});

	return Feed;
});
