define ['backbone',
        'models/tag-set',
        'views/pg-select-view',
        'views/br-tag-view',
        'views/br-sel-view',
        'routers/br-tag-router',
        'utils/pagination-details',
        'utils/ignore-articles',
        'utils/globals'],

  (Backbone, TagSet, PgSelectView, brTagView, brSelView, BrTagRouter, paginationDetails, ignoreArticles, globals) ->

    globals = globals.getGlobals()

    perPage = if tagType is "selections" then 10 else 25

    BrowseApp = Backbone.View.extend

      settings :
        container : $("#tag-list")
        dataType : tagType # created by script in markup
        startPage : 1
        itemsPerPage : perPage

      sortField : -> return $(".sort-radio[name='sortField']:checked").val()

      initialize : ->
        @getTags()

      theComparator : (modelA, modelB) ->
        sortField = $(".sort-radio[name='sortField']:checked").val()
        sortOrder = $(".sort-radio[name='sortOrder']:checked").val()
        switch sortField
          when "name"
            firstModelField = ignoreArticles modelA.get(sortField).toLowerCase()
            secondModelField = ignoreArticles modelB.get(sortField).toLowerCase()
          when "last_name"
            firstModelField = modelA.get(sortField).toLowerCase()
            secondModelField = modelB.get(sortField).toLowerCase()
          when "author"
            firstModelField = modelA.get("source").author.last_name
            secondModelField = modelB.get("source").author.last_name
          when "date_entered"
            firstModelField = new Date modelA.get("date_entered_simple")
            secondModelField = new Date modelB.get("date_entered_simple")
          when "birth_year"
            firstModelField = new Date modelA.get("birth_year")
            secondModelField = new Date modelB.get("birth_year")
          when "pub_year"
            firstModelField = modelA.get("source").pub_year
            secondModelField = modelB.get("source").pub_year
        if firstModelField < secondModelField
          sortValue = -1
        else if firstModelField > secondModelField
          sortValue = 1
        else
          sortValue = 0
        if sortOrder is "des"
          sortValue = sortValue * -1
        return sortValue

      getTags : (sort) ->
        tSet = @tagSet = new TagSet()
        tSet.url = "/api/#{@settings.dataType}"
        tSet.comparator = @theComparator
        tSet.fetch
          error : ->
            console.log "The set couldn't be fetched."
          success : =>
            if tSet.length > @settings.itemsPerPage
              $("#page-and-sort").toggle()
              @router = new BrTagRouter
              @router.navigate "page/#{@settings.startPage}", replace : true
              @start()
              @setEvents()
            else
              $(".main-c").show()

      start : ->
        @getPages()
        @getPageSelect()
        @renderSet(@settings.startPage)

      getPages : ->
        @pgParams = paginationDetails(@tagSet, @settings.itemsPerPage).startEndModels

      getPageSelect : ->
        # remove any previou s pg select
        @pgView = new PgSelectView
          pgParams : @pgParams
          router : @router
          dataType : @settings.dataType
          startPage : @settings.startPage
          sortField : @sortField()

      renderSet : (page) ->
        options =
          collection : @tagSet
          page : page
          pgParams : @pgParams
          container : @settings.container
        if @settings.dataType isnt "selections"
          brTagView options
        else
          brSelView options

      setEvents : ->
        $(".sort-radio").off().on "click", => @reSort()
        $(".adjustor-btn, .x-adjustor").off().on "click", (ev) => @toggleAdjustors($(ev.currentTarget))

      reSort : ->
        @tagSet.sort()
        @router.navigate "page/#{@settings.startPage}", trigger : false
        @start()
        @setEvents()

      toggleAdjustors : ($clicked) ->
        $clicked.toggleClass "is-active"
        target = $clicked.data "adjustor"
        if target is "page"
          $("#adjustor-pages-container").toggleClass "is-active"
        else if target is "sort"
          $("#adjustor-sort-container").toggleClass "is-active"


    return BrowseApp
