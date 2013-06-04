# Config parameters set in require-config.js.

require ['apps/rand-quot-app'],

  (RandQuotApp) ->

    highlightParams = highlightParams || ''

    quoteApp = new RandQuotApp highlightParams

