# Config parameters set in require-config.js.

require ['apps/rand-quot-app',
         'apps/browse-app',
         'utils/globals'],

  (RandQuotApp, BrowseApp, globals) ->

    quoteApp = new RandQuotApp()

    globals = globals.getGlobals()
    browseApp = globals.app = new BrowseApp()

