require(['backbone',
         'apps/rand-quot-app',
         'apps/copyright-app'],
	
	function (Backbone, RandQuotApp, cr) {
		RandQuotApp();
		cr();
	}
);
