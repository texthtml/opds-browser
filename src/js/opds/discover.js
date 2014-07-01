define(['opds/tools'], function(tools) {
	'use strict';

	var discover = {
		html: function(html) {
			return new Promise(function(resolve, reject) {
				var doc = document.implementation.createHTMLDocument();
				doc.documentElement.innerHTML = html;

				var links = doc.querySelectorAll(
					'link[type="application/atom+xml;profile=opds-catalog"],link[type="application/atom+xml;type=entry;profile=opds-catalog"]'
				);

				resolve(Array.prototype.map.call(links, function(link) {
					return {
						href: link.getAttribute('href'),
						title: link.getAttribute('title'),
						type: link.getAttribute('type').contains('type=entry') ? 'entry' : 'catalog'
					};
				}));
			});
		},
		url: function(url) {
			return tools.get(url).then(discover.html);
		}
	};

	return discover;
});

