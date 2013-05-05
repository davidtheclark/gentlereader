### Creates a select menu whose displayed options reflect a collection's models and
the current sort values. Must be called with the following options:
- pageDetails: an array of objects with information about where each
page starts and ends, formatted thus
[ { startIndex: value1, startMod: model1, endIndex: value2, endMod: model2 }, ... ]
- sortField (optional): a field to sort by (date_entered, author, or pub_year)
(without this, the model's "name" will be displayed by default)
- router: a router used to navigate to new pages
- container (optional): if the container's id is other than "page-select-container"
- dataType: what is being paginated (e.g. selection, genre, author)
- startPage: which page should be initially selected (should be "all" or 1)? ###


define ['backbone',
        'templates/pgSelectTempl'],

  (Backbone, pgSelectTempl) ->

    PgSelectView = Backbone.View.extend

      template : pgSelectTempl

      initialize : (options) ->
        _.extend @, options
        @render()

      getModelDisplay : (model) ->
        ### From each relevant model, get the proper value to display in
        the pageSelect. This relies on the option "dataType" passed when
        the View is instantiated. pageSelects for selection lists can show
        date entered, author last name, or pub year; for author lists just
        last name; for tags just name. ###

        if @dataType == "selections"
          switch @sortField
            when "date_entered" then model.get "date_entered_simple"
            when "author" then model.get("source").author.last_name.toUpperCase()
            when "pub_year" then model.get("source").date_display
        else if @dataType == "authors"
          return model.get("last_name").toUpperCase()
        else
          return model.get("name").toUpperCase()

      events :
        "change" : "changePage"
        "click .page-select-arrow" : "flipPage"

      changePage : ->
        if @router
          page = $("#page-select").val()
          ### The "sorted" option is passed as "true" (on instantiation)
          if the data can be sorted (NOT tags, which are always in
          ascending alphabetical order.) ###
          if @sorted
            sorter = $("#sort-field").val()
            director = $("#sort-direction").val()
            url = "page/#{sorter}#{director}/#{page}"
            @router.navigate url, trigger : true
          else
            @router.navigate "page/#{page}", trigger : true

          @changeSelectedPage()

        else
          console.log "No router found."

      changeSelectedPage : ->
        $('#selected-page').html $('#page-select option:selected').text()

      flipPage : ->
        $clicked = $(event.target)
        move = if $clicked.hasClass "u-left" then "prev" else "next"
        $pgSelect = $("#page-select")
        pgVal = $pgSelect.val()
        if pgVal == 'all'
          if move == "prev"
            newPage = @pgParams.length
          else
            newPage = 1
        else
          currentPage = parseInt $pgSelect.val()
          newPage = if $clicked.hasClass "u-left" then currentPage - 1 else currentPage + 1
        $pgSelect.val(newPage.toString()).trigger("change")

      render : ->
        params = @pgParams
        if params
          ### If no "container" option has been passed,
          default to #page-select-container. ###
          container = @container or $("#page-select-container")
          pgCount = params.length
          itemCount = params[pgCount - 1].endIndex + 1
          container.off().empty()

          templateVars =
            itemCount : itemCount
            dataType : @dataType
            pages : []

          for pg, i in params
            start = @getModelDisplay pg.startModel
            end = @getModelDisplay pg.endModel
            results =
              sel : if @startPage == 1 and i == 0 then " selected" else ""
              fill : if start != end then "#{start} to #{end}" else start
              num : i + 1
            templateVars.pages.push(results)

          @$el.append @template templateVars
          container.append @el

          @changeSelectedPage()

        else
          console.log "No page details found."

        return @


    return PgSelectView