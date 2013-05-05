# Config parameters set in require-config.js.

require ['backbone',
         'utils/globals',
         'apps/rand-quot-app',
         'apps/base-app',
         'apps/browse-highlights-app'],

  (Backbone, globals, RandQuotApp, BaseApp, BrowseHighlightsApp) ->

    globals = globals.getGlobals()
    quoteApp = new RandQuotApp()
    highlightApp = globals.app = new BrowseHighlightsApp()

    $ ->
      BaseApp()

