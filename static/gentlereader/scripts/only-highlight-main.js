require(['apps/rand-quot-app'], function(RandQuotApp) {
  var highlightParams, quoteApp;
  highlightParams = window.highlightParams || '';
  return quoteApp = new RandQuotApp(highlightParams);
});
