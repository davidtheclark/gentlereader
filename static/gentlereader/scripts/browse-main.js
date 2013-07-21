require(['apps/rand-quot-app', 'apps/browse-app', 'utils/globals'], function(RandQuotApp, BrowseApp, globals) {
  var browseApp, quoteApp;
  quoteApp = new RandQuotApp();
  globals = globals.getGlobals();
  return browseApp = globals.app = new BrowseApp();
});
