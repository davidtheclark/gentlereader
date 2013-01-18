/* Config parameters set in require-config.js. */

require(['backbone',
         'apps/resource-app',
         'apps/rand-quot-app',
         'apps/copyright-app'],
         
	function (Backbone, ResourceApp, RandQuotApp, cr) {
		var app = new ResourceApp();
		RandQuotApp();
		cr();
	}	
);