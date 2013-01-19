/* Config parameters set in require-config.js. */

require(['backbone',
         'apps/tag-app',
         'utils/globals',
         'apps/copyright-app'],
         
	function (Backbone, TagApp, globals, cr) {
		var globals = globals.getGlobals();	
		var app = globals.app = new TagApp();
		cr();
	}	
);