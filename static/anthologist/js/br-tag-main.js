/* Config parameters set in require-config.js. */

require(['backbone',
         'apps/br-tag-app',
         'apps/rand-quot-app',
         'utils/globals',
         'apps/copyright-app'],
         
	function (Backbone, BrTagApp, RandQuotApp, globals, cr) {
		var globals = globals.getGlobals();
		var app = globals.app = new BrTagApp();
		RandQuotApp();
		cr();
	}	
);