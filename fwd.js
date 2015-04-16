(function() {

	/**
	 * Grabs the leading route name from the URL
	 * @param  {string} route
	 * @return {string}
	 */
	var getRouteLead = function(route) {
		var parts;
		return (parts = route.split('/')) && parts.length && parts[0];
	};

	/**
	 * Grabs everything past the domain name in a URL, either path or hash
	 * @return {string}
	 */
	var getPath = function() {
		var path = window.location.pathname.slice(1) || window.location.hash.slice(1);
		return path;
	};

	/**
	 * Will return everything past the leading route name, as an array
	 * @param  {string} route
	 * @return {array}
	 */
	var getParams = function(route) {
		var parts;
		return (parts = route.split('/')) && parts.length && parts.slice(1);
	};

	var Fwd = window.Fwd = function() {
		this.hasPushState = !!history.pushState;
		this.routes = {};
		this.bind();
	};

	Fwd.prototype = {

		/**
		 * Hooks onto the hashchange and popstate events triggered on the window
		 */
		bind: function() {
			window.addEventListener('hashchange', function(event) {
				var path = window.location.hash.slice(1);
				this.run(getPath());
			}.bind(this));
			if (this.hasPushState) {
				window.addEventListener('popstate', function(e) {
					var path = window.location.pathname;
					this.run(getPath());
				}.bind(this));
			}
		},

		/**
		 * Saves the user's routes & callbacks to the instance
		 * @param  {object} options
		 */
		links: function(options) {
			options = options || {};
			this.routes = options.routes;
			this.callbacks = {};
			// save all keys to `this.callbacks`, except for the "routes" object
			Object.keys(options).filter(function(key) {
				return key !== 'routes';
			}).forEach(function(key) {
				this.callbacks[key] = options[key];
			}.bind(this));
			this.run(getPath());
		},

		/**
		 * Updates the URL with a new route name, and then triggers the callbacks
		 * @param  {string} name
		 */
		go: function(name) {
			if (this.hasPushState) {
				history.pushState(null, '', name == '' ? '/' : name);
				this.run(getPath());
			} else {
				window.location.hash = name;
			}
		},

		/**
		 * Takes a URL, parses it, and then invokes the relevant callbacks
		 * @param  {string} url
		 */
		run: function(url) {
			Object.keys(this.routes).forEach(function run(routeName) {
				if (run.stop)
					return;
				var sameParamCount = getParams(url).length == getParams(routeName).length;
				if (new RegExp(getRouteLead(routeName)).test(getRouteLead(url)) && sameParamCount) {
					var replacedParams = getParams(url),
						callback = this.routes[routeName],
						func;
					callback && (func = this.callbacks[callback]) && func.apply(this, replacedParams);
					run.stop = true;
				}
			}.bind(this));
		}
	};
}());