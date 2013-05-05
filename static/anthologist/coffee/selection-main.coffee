# Config parameters set in require-config.js.

require ['jquery',
         'apps/base-app',
         'apps/selection-app',
         'lib/hyphenator'],

  ($, BaseApp) ->         
    # selection-app and hyphenator don't need to be run.
    
    $ ->
      BaseApp() 
