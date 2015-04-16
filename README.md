# Fwd

A dead simple JavaScript plugin to help manage page-specific JavaScript code in the browser.

## Use case

When you want certain JavaScript to only be ran on certain pages (or certain URL patterns), ie. some form validation code to be initialised when the user is on your contact page.

If you need anything more heavy-duty than this, I'd suggest looking at [Sammyjs](http://sammyjs.org/docs/routes) which has much deeper support for richer applications.

## Installation

Just include a reference to fwd.js somewhere in your page

`<script src="/path/to/fwd.js"></script>`

## Usage

```
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
```

Here is a sample "router" made with Fwd. We create a "routes" object which maps URL patterns to callback functions.

When the URL matches any of the patterns, the relevant callback function is invoked. It also supports dynamic URL parameters, as you can see with `:id`, which gets passed to our `showService` method as `id`.

Fwd supports multiple URL patterns, from standard page load URLs, ie. `/about`, or dynamic pushState/hash URL changes, ie. `/#about`.

Fwd also provides a `go` method which takes a new "route", ie. "contact", which will update the URL via pushState (or fallback to hash) and then invoke the, for example, "contact" method:

```
fwd.go('contact');
```