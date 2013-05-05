# Config parameters set in require-config.js.

require ['backbone',
         'apps/rand-quot-app',
         'apps/base-app'],

  (Backbone, RandQuotApp, BaseApp) ->

    quoteApp = new RandQuotApp()

    $ ->
      BaseApp()
