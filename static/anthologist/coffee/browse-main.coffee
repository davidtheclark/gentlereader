# Config parameters set in require-config.js.

require ['backbone',
         'apps/rand-quot-app'],
         
  (Backbone, RandQuotApp) ->
    app = new RandQuotApp()
