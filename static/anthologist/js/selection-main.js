require(['jquery',
         'apps/sel-app',
         'apps/copyright-app'],
		
	function ($, selApp, cr) {
		selApp();
		cr();
	}
);