define ["backbone",
        "routers/browse-highlights-router",
        "templates/brQuotRandomTempl",
        "templates/brQuotAuthTempl",
        "lib/matchMedia",
        "utils/isElementInViewport"],

  (Backbone, Router, randomTempl, fromAuthorTempl, matchMedia, isElementInViewport) ->

    cont = $("#browseHighlights")

    BrowseHighlightApp = Backbone.View.extend


      initialize : (options) ->
        @router = new Router()
        @setRandomizers()
        @setAuthorSelect()
        if Backbone.history.fragment
          @initialRouting()
        else
          @getRandom()


      setRandomizers : ->
        $(".random-highlights").click =>
          @router.navigate "/", trigger : false
          @getRandom()


      setAuthorSelect : ->
        $select = $("#selectHighlightAuthor")
        $select.change =>
          @router.navigate $select.val(), trigger : true


      initialRouting : ->
        """If there is a url fragment, route right away to get
        author-specific highlights."""
        @getHighlights Backbone.history.fragment


      getRandom : ->
        quantity = 3
        settings =
          dataType : "json"
          url : "/api/quotations/random?quantity=#{quantity}"
          error : ->
            console.log "Failure getting random highlights."
          success : (data) =>
            @render data, randomTempl

        $.ajax settings


      getHighlights : (identifier) ->
        settings =
          dataType : "json"
          url : "/api/authors/#{identifier}/quotations"
          error : ->
            console.log "Failure getting author highlights."
          success : (data) =>
            @render data, fromAuthorTempl, "highlight-author"

        $.ajax settings


      render : (data, template, scrollTo) ->
        markup = template data
        cont.fadeOut ->
          cont.html(markup).fadeIn ->
            if scrollTo and not isElementInViewport document.getElementById(scrollTo)
              adjustment = if matchMedia("screen and (min-width: 760px)").matches then 55 else 0
              $("html, body").animate scrollTop : $("##{scrollTo}").offset().top - adjustment, "fast"