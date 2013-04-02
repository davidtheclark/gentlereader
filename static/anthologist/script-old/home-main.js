/* Config parameters set in require-config.js. */

require(['backbone',
         'apps/home-app',
         'apps/rand-quot-app',
         'utils/globals',
         'apps/copyright-app'],
         
	function (Backbone, HomeApp, RandQuotApp, globals, cr) {
		var glbs = globals.getGlobals();
		var app = globals.app = new HomeApp();
		RandQuotApp();
		cr();
	}	
);