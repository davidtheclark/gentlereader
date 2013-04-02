({
	baseUrl: "../../js",
	name: "libraries/almond",
	preserveLicenseComments: false,
	paths: {
		jquery: '../js/libraries/jquery-1.7.2.min',
		underscore: '../js/libraries/underscore-1.3.3.min',
		backbone: '../js/libraries/backbone-0.9.2.min',
		jade: '../js/libraries/jade-runtime'
	},
	shim: {
		underscore: {
			exports: "_"
		},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		jade: {
			exports:'jade'
		}
	}
})