define ['backbone'],

  (Backbone) ->
    
    PaginatedColView = Backbone.View.extend
    
      initialize : (options) ->
        ### Backbone collection, current page, page parameters,
        and View need to be passed as options on instantiation. ###
        _.extend @, options
        @.render()
      
      render : ->
        if @collection and @page
          # "start" and "end" set the limits for the page
          @container.fadeOut "fast", =>
            @container.off().empty()
            if @page == "all"
              start = 0
              end = @collection.length - 1
            else
              thisPageParams = @pgParams[@page - 1]
              start = thisPageParams.startIndex
              end = thisPageParams.endIndex
            for i in [start..end]
              sView = new @View
                model : @collection.models[i]
                index : i
            
            @container.fadeIn "fast", =>
              if @callback
                @callback()
        
        else
          console.log "Missing options: requires 'collection' and 'page'."
        
        return @
    
    return PaginatedColView