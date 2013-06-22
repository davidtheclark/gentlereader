# Config parameters set in require-config.js.

require ['apps/rand-quot-app'],

  (RandQuotApp) ->

    highlightParams = window.highlightParams || ''

    quoteApp = new RandQuotApp highlightParams

