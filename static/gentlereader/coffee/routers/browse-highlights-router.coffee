define ["backbone",
        "utils/globals"],

  (Backbone, globals) ->

    globals = globals.getGlobals()

    BrowseHighlightsRouter = Backbone.Router.extend

      initialize : ->
        Backbone.history.start silent : true

      routes :
        ":author" : "selectAuthor"
        "" : "getRandom"

      selectAuthor : (author) ->
        globals.app.getHighlights author

      getRandom : ->
        globals.app.getRandom()

    return BrowseHighlightsRouter
