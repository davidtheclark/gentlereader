define ['jquery',
        "routers/browse-timeline-router",
        'lib/unfinishedToggler'],

  ($, Router, unfinishedToggler) ->

    TimelineApp = Backbone.View.extend

      initialize : ->
        $("#tl-list").unfinishedToggler
          exclusive : false
        @router = new Router()
        if Backbone.history.fragment
          @initialRouting()

      initialRouting : ->
        scrollTo = $(".tl-year[data-year='#{Backbone.history.fragment}']").offset().top - 60
        $("html, body").animate scrollTop : scrollTo

    return TimelineApp