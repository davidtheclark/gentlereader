/* Config parameters set in require-config.js. */

require(['backbone',
         'apps/br-timeline-app',
         'apps/rand-quot-app',
         'apps/copyright-app',
         'utils/nav-dropdown'],
         
	function (Backbone, BrTimelineApp, RandQuotApp, cr, navDropdown) {
		var app = new BrTimelineApp();
		navDropdown();
		RandQuotApp();
		cr();
	}	
);