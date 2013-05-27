# Config parameters set in require-config.js.

require ['utils/globals',
         'apps/rand-quot-app',
         'apps/browse-highlights-app'],

  (globals, RandQuotApp, BrowseHighlightsApp) ->

    globals = globals.getGlobals()
    quoteApp = new RandQuotApp()
    highlightApp = globals.app = new BrowseHighlightsApp()

