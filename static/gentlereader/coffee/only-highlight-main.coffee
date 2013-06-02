# Config parameters set in require-config.js.

require ['apps/rand-quot-app'],

  (RandQuotApp) ->

    options = highlightParams || ''

    quoteApp = new RandQuotApp options

