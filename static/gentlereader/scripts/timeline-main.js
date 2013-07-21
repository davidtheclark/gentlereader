require(['apps/timeline-app', 'apps/rand-quot-app', 'utils/globals'], function(TimelineApp, RandQuotApp, globals) {
  var quoteApp, timelineApp;
  globals = globals.getGlobals();
  quoteApp = new RandQuotApp();
  return timelineApp = globals.app = new TimelineApp();
});
