/* Config parameters set in require-config.js. */

require(['backbone',
         'apps/resource-app',
         'apps/rand-quot-app',
         'apps/copyright-app',
         'utils/nav-dropdown'],
         
	function (Backbone, ResourceApp, RandQuotApp, cr, navDropdown) {
		var app = new ResourceApp();
		navDropdown();
		RandQuotApp();
		cr();
	}	
);