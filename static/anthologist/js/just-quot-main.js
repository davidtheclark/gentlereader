require(['apps/rand-quot-app',
         'apps/copyright-app',
         'utils/nav-dropdown'],
	
	function (RandQuotApp, cr, navDropdown) {
		navDropdown();
		RandQuotApp();
		cr();
	}
);
