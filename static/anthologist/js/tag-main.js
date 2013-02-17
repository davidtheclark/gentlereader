/* Config parameters set in require-config.js. */

require(['backbone',
         'apps/tag-app',
         'utils/globals',
         'utils/nav-dropdown',
         'apps/copyright-app'],
         
	function (Backbone, TagApp, globals, navDropdown, cr) {
		var globals = globals.getGlobals();	
		var app = globals.app = new TagApp();
		navDropdown();
		cr();
	}	
);