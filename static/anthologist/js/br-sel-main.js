/* Config parameters set in require-config.js. */

require(['backbone',
         'apps/br-sel-app2',
         'apps/rand-quot-app',
         'utils/globals',
         'apps/copyright-app'],
         
	function (Backbone, BrSelApp, RandQuotApp, globals, cr) {
		var globals = globals.getGlobals();
		var app = globals.app = new BrSelApp();
		RandQuotApp();
		cr();
	}	
);