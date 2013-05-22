# Config parameters set in require-config.js.

require ['apps/timeline-app',
         'apps/rand-quot-app',
         'utils/globals'],

  (TimelineApp, RandQuotApp, globals) ->

    globals = globals.getGlobals()
    quoteApp = new RandQuotApp()
    timelineApp = globals.app = new TimelineApp()