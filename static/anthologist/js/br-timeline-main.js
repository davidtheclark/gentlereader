/* Config parameters set in require-config.js. */

require(['backbone',
         'apps/br-timeline-app',
         'apps/rand-quot-app',
         'apps/copyright-app'],
         
	function (Backbone, BrTimelineApp, RandQuotApp, cr) {
		var app = new BrTimelineApp();
		RandQuotApp();
		cr();
	}	
);