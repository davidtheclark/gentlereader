require(['utils/globals', 'apps/rand-quot-app', 'apps/browse-highlights-app'], function(globals, RandQuotApp, BrowseHighlightsApp) {
  var highlightApp, quoteApp;
  globals = globals.getGlobals();
  quoteApp = new RandQuotApp();
  highlightApp = globals.app = new BrowseHighlightsApp();
  return $("#bhaLabel").click(function(e) {
    e.preventDefault();
    return $("#selectHighlightAuthor").click();
  });
});
