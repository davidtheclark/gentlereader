define ["backbone",
        "templates/randQuotTempl"],

  (Backbone, randQuotTempl) ->
    
    $container = $(".rq-content")
    
    RandQuotView = Backbone.View.extend
      className : "rand-quot-view"
      modalTemplate : randQuotTempl

      initialize : (options) ->
        _.extend @, options
        @render()
      
      render : ->
        ### If there is already an active highglight, @offscreen
        should have been set to true. The new highlight will
        be created and hidden offscreen. ###
        if @offscreen
          containerWidth = $container.width()
          @$el.css
            position : "absolute"
            right : "-5000px"
            width : containerWidth
            opacity : 0
        
        @$el.append @modalTemplate @model.toJSON()
        $container.append @el
        
        return @
    
    return RandQuotView
