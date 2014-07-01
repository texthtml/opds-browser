define(function() {
	'use strict';

	return {
		get: function(uri) {
			return new Promise(function(resolve, reject) {
				var xhr = new XMLHttpRequest();

				xhr.onreadystatechange = function() {
					if (this.readyState === 4) {
						if (this.status >= 400) {
							reject(this.statusText);
						} else {
							resolve(this.response);
						}
					}
				};

				xhr.open('GET', uri);
				xhr.responseType = 'document';
				xhr.send();
			});
		},
		resolveUri: function(baseURI, href) {
			if (href.match(/^https?:\/\//) !== null) {
				return href;
			}

			if (href.match(/^data:[a-z]+\/[a-z]+/) !== null) {
				return href;
			}

			var url = new URL(baseURI);

			if (href.match(/^:\/\//) !== null) {
				return url.protocol.slice(0, -1) + href;
			}

			if(href[0] === '/') {
				return url.protocol +'//' + url.host + href;
			}

			return url.protocol + '//' + url.host + url.pathname.match(/(.*\/)[^/]*$/)[1] + href;
		},
	};
});

