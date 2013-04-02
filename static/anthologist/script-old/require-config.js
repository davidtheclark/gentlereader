var require = {
	paths: {
		jquery: 'libraries/jquery-1.7.2.min',
		underscore: 'libraries/underscore-1.3.3.min',
		backbone: 'libraries/backbone-0.9.2.min'
	},
	shim: {
		underscore: {
			exports: "_"
		},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
	},
};