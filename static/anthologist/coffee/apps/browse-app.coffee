define ['backbone',
        'models/tag-set',
        'views/pg-select-view',
        'views/br-tag-view',
        'routers/br-tag-router',
        'utils/pagination-details',
        'utils/globals'],

  (Backbone, TagSet, PgSelectView, renderTagCollection, BrTagRouter, paginationDetails, globals) ->
    
    globals = globals.getGlobals()
    
    BrowseApp = Backbone.View.extend
    
      settings :
        itemsPerPage : 10
        container : $("#tag-list")
        dataType : tagType # created by script in markup
        startPage : "all"
      
      initialize : ->
        @getTags()
      
      getTags : ->
        tSet = @tagSet = new TagSet()
        tSet.url = "/api/#{@settings.dataType}"
        tSet.fetch
          error : ->
            console.log "The tag set couldn't be fetched."
          success : =>
            @setPagination()
            if @pgCount > 1
              @router = new BrTagRouter
                pageChanger : @pageChanger
              @router.navigate "page/all", replace : true
              @getPageSelect()
      
      setPagination : ->
        pgDetails = paginationDetails @tagSet, @settings.itemsPerPage
        @pgParams = pgDetails.startEndModels
        @pgCount = pgDetails.pgCount
      
      getPageSelect : ->
        pgView = new PgSelectView
          pgParams : @pgParams
          router : @router
          dataType : @settings.dataType
          startPage : @settings.startPage
      
      pageChanger : (page) ->
        options = 
          collection : @tagSet
          page : page
          pgParams : @pgParams
          container : @settings.container
        renderTagCollection options
    
    return BrowseApp
