# Config parameters set in require-config.js.

require ['backbone',
         'apps/rand-quot-app',
         'apps/base-app',
         'apps/timeline-app'],

  (Backbone, RandQuotApp, BaseApp, TimelineApp) ->

    quoteApp = new RandQuotApp()

    $ ->
      BaseApp()
      TimelineApp()
