/**
 * Usage
 */

/*

var fwd = new Fwd();

fwd.links({

	routes: {
		"about": "about",
		"services/:id": "showService",
		"services": "services",
		"contact": "contact"
	},

	about: function() {
		console.log('about');
	},

	services: function() {
		console.log('services');
	},

	showService: function(id) {
		console.log(id);
	},

	contact: function() {
		console.log('contact');
	}

});

*/


(function() {

	var getRouteLead = function(route) {
		var parts;
		return ((parts = route.split('/')) && parts.length && parts[0]);
	};

	var getPath = function() {
		var path = window.location.pathname.slice(1) || window.location.hash.slice(1);
		return path;
	};

	var getParams = function(route) {
		var parts;
		return ((parts = route.split('/')) && parts.length && parts.slice(1));
	};

	var Fwd = window.Fwd = function() {

		this.hasPushState = !!(history.pushState);

		this.routes = {};
		this.bind();
	};

	Fwd.prototype = {

		bind: function() {

			window.addEventListener('hashchange', function(event) {
				var path = window.location.hash.slice(1);
				this.run(getPath());
			}.bind(this));

			window.addEventListener('popstate', function(e) {
				var path = window.location.pathname;
				this.run(getPath());
			}.bind(this));

		},

		links: function(options) {
			options = options || {};
			this.routes = options.routes;
			this.callbacks = {};

			Object.keys(options).filter(function(key) {
				return key !== 'routes';
			}).forEach(function(key) {
				this.callbacks[key] = options[key];
			}.bind(this));

			this.run(getPath());
		},

		go: function(name) {
			if (this.hasPushState) {
				history.pushState(null, '', (name == '') ? '/' : name);
				var path = window.location.pathname;
				this.run(getPath());
			} else {
				window.location.hash = name;
			}
		},

		run: function(url) {
			Object.keys(this.routes).forEach(function run(routeName) {
				if (run.stop) return;
				var sameParamCount = (getParams(url).length == getParams(routeName).length);
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

})();