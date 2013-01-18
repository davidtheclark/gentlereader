/* Config parameters set in require-config.js. */

require(['backbone',
         'apps/br-quot-app',
         'apps/rand-quot-app',
         'utils/globals',
         'apps/copyright-app'],
         
    function(Backbone, QuotApp, RandQuotApp, globals, cr) {
		var globals = globals.getGlobals();
		var quotApp = globals.app = new QuotApp();
		RandQuotApp();
		cr();
	}
);