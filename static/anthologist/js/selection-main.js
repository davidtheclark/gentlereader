require(['jquery',
         'apps/sel-app',
         'apps/copyright-app',
         'utils/nav-dropdown'],
		
	function ($, selApp, cr, navDropdown) {
		navDropdown();
		selApp();
		cr();
	}
);