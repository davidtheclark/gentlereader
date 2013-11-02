define ['backbone',
        'templates/pgSelectTempl'],

  (Backbone, pgSelectTempl) ->

    BottomPaginatorView = Backbone.View.extend
      className : "bottom-paginator"
      tagName : 'ul'

      initialize : (options) ->
        _.extend @, options
        @fillPageList()

      fillPageList : ->
        liClass = @liClass = "bottom-paginator-i"
        $list = @.$el
        $list.append "<li class='#{liClass} paginator-arrow' data-page='prev'>&lsaquo;</li>"
        for i in [1..@.total]
          $list.append "<li class='#{liClass}' data-page='#{i}'>#{i}</li>"
        $list.append "<li class='#{liClass} paginator-arrow' data-page='next'>&rsaquo;</li>"
        @renderPageList()

      assignCurrent : (current) ->
        if current is "all"
          @.$el.hide()
        else
          @.$el.show()
        lis = $(".#{@liClass}")
        lis.each ->
          $li = $(@)
          $li.removeClass "is-current"
          if $li.data("page") is current
            $li.addClass "is-current"

      renderPageList : ->
        $(".main-c").append @el
        @assignCurrent @.current

      events :
        "click .bottom-paginator-i" : "go"

      go : (ev) ->
        pageNo = $(ev.currentTarget).data "page"
        if pageNo is "next"
          $target = $(".page-select-arrow.m-right")
        else if pageNo is "prev"
          $target = $(".page-select-arrow.m-left")
        else
          $target = $(".pagelist-i[data-page='#{pageNo}']")
        $target.click()
        $("html, body").animate scrollTop : 0



    PgSelectView = Backbone.View.extend

      el : "#adjustor-pages-container"

      template : pgSelectTempl

      initialize : (options) ->
        _.extend @, options
        # get the bottom paginator
        $(".bottom-paginator").off().remove()
        @bottomPaginator = new BottomPaginatorView
          current : @.pageNo
          total : @.options.pgParams.length
          router : @.router
        # set pageNo to designated starting page
        @pageNo = @startPage
        @setEvents()
        @render()

      checkBCEDate : (year) ->
        result = if year < 0 then "#{Math.abs(year)} <span class='bce'>bce</span>" else year
        return result

      getModelDisplay : (model) ->
        ### From each relevant model, get the text to display in
        the page list. This relies on the option "dataType" passed when
        the View is instantiated. The page list for selection lists can show
        date entered, author last name, or pub year; for author lists just
        last name; for tags just name. ###

        if @dataType == "selections"
          switch @sortField
            when "date_entered" then model.get "date_entered_simple"
            when "author" then model.get("source").author.last_name.toUpperCase()
            when "pub_year" then model.get("source").date_display
        else if @dataType == "authors"
          switch @sortField
            when "last_name" then model.get("last_name").toUpperCase()
            when "birth_year" then @checkBCEDate(model.get "birth_year")
        else
          return model.get("name").toUpperCase()

      setEvents : ->
        $(".page-select-arrow").off().on "click", (ev) => @flipPage($(ev.currentTarget))

      events :
        "click .pagelist-i" : "changePage"

      changePage : (ev) ->
        @pageNo = $(ev.currentTarget).data "page"
        @pageName = $(ev.currentTarget).text()
        if @router
          @router.navigate "page/#{@pageNo}", trigger : true
          @changeSelectedPage()
        else
          console.log "No router found."

      changeSelectedPage : ->
        $("#page-list-current").empty()
        items = $(".pagelist-i")
        $newPage = items.filter("[data-page='#{@pageNo}']")
        # change active page in list
        items.filter(".is-active").removeClass("is-active")
        $newPage.addClass "is-active"

        if @pageNo is "all"
          result = "showing #{$newPage.text()}<br><br>"
        else
          result = "showing page #{@pageNo} of #{@pgParams.length}:<br>#{$newPage.text()}"

        $('#page-list-current').html result

        # change bottom paginator
        @bottomPaginator.assignCurrent @pageNo

      flipPage : ($clicked) ->
        move = if $clicked.hasClass "m-left" then "prev" else "next"
        lastPage = @pgParams.length
        if @pageNo == 'all'
          if move == "prev"
            newPage = lastPage
          else
            newPage = 1
        else
          prev = $clicked.hasClass "m-left"
          if @pageNo == 1 and prev
            newPage = lastPage
          else if @pageNo == lastPage and not prev
            newPage = 1
          else
            newPage = if prev then @pageNo - 1 else @pageNo + 1
        $(".pagelist-i").filter("[data-page='#{newPage}']").click()

      render : ->
        $(@el).off().empty()
        params = @pgParams
        if params
          container = @container or $("#adjustor-pages-container")
          pgCount = params.length
          itemCount = params[pgCount - 1].endIndex + 1
          container.off()

          templateVars =
            itemCount : itemCount
            dataType : @dataType
            pages : []

          for pg, i in params
            start = @getModelDisplay pg.startModel
            end = @getModelDisplay pg.endModel
            results =
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