define ["backbone",
        "utils/globals"],

  (Backbone, globals) ->

    globals = globals.getGlobals()

    BrowseTimelineRouter = Backbone.Router.extend

      initialize : ->
        Backbone.history.start silent : true

      routes :
        ":year" : "goToYear"

      selectAuthor : (year) ->
        globals.app.goToYear year

    return BrowseTimelineRouter
