# Config parameters set in require-config.js.

require ['backbone',
         'apps/rand-quot-app',
         'apps/base-app',
         'apps/browse-app',
         'utils/globals'],
         
  (Backbone, RandQuotApp, BaseApp, BrowseApp, globals) ->
    
    quoteApp = new RandQuotApp()
    
    globals = globals.getGlobals()
    browseApp = globals.app = new BrowseApp()
    
    $ ->
      BaseApp()
      
