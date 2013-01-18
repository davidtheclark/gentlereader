/* Config parameters set in require-config.js. */

require(['backbone',
         'apps/tag-app',
         'apps/rand-quot-app',
         'utils/globals',
         'apps/copyright-app'],
         
	function (Backbone, TagApp, RandQuotApp, globals, cr) {
		var globals = globals.getGlobals();	
		var app = globals.app = new TagApp();
		RandQuotApp();
		cr();
	}	
);