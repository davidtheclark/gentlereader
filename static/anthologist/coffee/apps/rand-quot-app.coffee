define ['backbone',
        'models/rand-quot-set',
        'views/rand-quot-view',
        'lib/scrollintoview'],
        
  (Backbone, RandQuotSet, RandQuotView) ->

    removeStyle = () ->
      # Accepts jQuery DOM objects.
      for $a in arguments
        $a.removeAttr "style"
    
    
    RandQuotApp = Backbone.View.extend
      
      
      initialize : ->
        # Get some DOM elements for reuse.
        @["dom"] = {}
        @dom.body = $(".rq-body")
        @dom.back = $(".rq-backdrop")
        @dom.cont = $(".rq-content")
        
        # Run the functions.
        @setClickEvents()
        @getQuot()
      
      
      setClickEvents : ->
        # Set the click events that make things go.
        $ =>
          $(".rq-btn").click => @showQuot()
          $(".rq-background, .rq-close").click => @hideQuot()
          $(".rq-another").click => @getQuot()
                  
    
      getQuot : ->
        randQuotSet = new RandQuotSet()
        randQuotSet.fetch
          cache : false
          error : =>
            console.log "Failed to fetch a random quotation."
          success : =>
            @renderQuot(randQuotSet)
      
    
      renderQuot : (randQuotSet) ->
        # Set whether we're at desktop-size or not
        @["settings"] = {}
        @settings.desktop = if document.width >= 760 then true else false

        params = model : randQuotSet.models[0]
        
        ### If there is no @activeQuot, this highlight's view will
        be it. If there is one already, set the "offscreen" option
        on the view and run @switchQuot. ###
        if !@activeQuot
          @activeQuot = new RandQuotView params
          
        else
          params["offscreen"] = true
          @offscreenQuot = new RandQuotView params
          @switchQuot()

    
      switchQuot : ->
        ### Animate a transition between active and offscreen
        highlights; then destroy the old view and make
        the new one the app's @activeQuot. ###         
        
        $offQuotEl = $(@offscreenQuot.el)
        
        # Lock @dom.cont's current height and width.
        @dom.cont.height @dom.cont.height()
        @dom.cont.width @dom.cont.width()
        # Fade out @activeQuot, then remove it.
        $(@activeQuot.el).fadeOut =>
          @activeQuot.remove()
          # Adjust @dom.cont's height to accommodate the new highlight.
          @dom.cont.animate { height : $offQuotEl.height() + "px" }, =>
            # Then re-position the new highlight and fade it in.
            $offQuotEl.css
              position : "static"
              right : "auto"
            $offQuotEl.animate opacity : "1"
            # Scroll to the top of highlight area, using scrollintoview plugin.
            scrollTo = if @settings.desktop then $("h1.browse-h") else $("#rqTop")
            scrollTo.scrollintoview()
            # Remove inline-style attributes.
            removeStyle $offQuotEl, @dom.cont
          
          # Finally, designate the new highlight as the app's @activeQuot.
          @activeQuot = @offscreenQuot
          @offscreenQuot = ""        
      
    
      showQuot : ->
        @dom.body.toggle()
        # Position the @dom.body at the top of the current viewport.
        currentTop = $(window).scrollTop()
        @dom.body.css top: currentTop
        # Then fade it in.
        @dom.back.fadeIn "fast"
        @dom.body.addClass "show"

    
      hideQuot : ->
        # Push the @dom.body above the viewport, hiding it.
        @dom.body.animate { top : "-1000px" }, 200, "linear", =>
         # Fade out the backdrop.
         @dom.back.fadeToggle "slow", =>
            # Then remove "show" class and inline-style attributes.
            @dom.body.removeClass("show").toggle()
            removeStyle $(@dom.body, @dom.back)
    
    
    
    return RandQuotApp
