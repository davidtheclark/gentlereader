# Config parameters set in require-config.js.

require ['jquery',
         'apps/base-app'],

  ($, BaseApp, searchApp) ->

    $ ->
      BaseApp()
