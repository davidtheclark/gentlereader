define ['backbone',
        'utils/globals'],

  (Backbone, globals) ->

    globals = globals.getGlobals()

    BrTagRouter = Backbone.Router.extend

      ### App passes pageChanger() as an option. ###

      initialize : (options) ->
        _.extend @, options
        Backbone.history.start silent : true

      routes :
        "page/:page" : "changePage"

      changePage : (page) ->
        # Check and adjust the pageSelect on top.

        globals.app.renderSet page

    return BrTagRouter