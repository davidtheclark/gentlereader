define ['backbone',
        'models/rand-quot-set',
        'views/rand-quot-view',
        'lib/matchMedia'
        'utils/isElementInViewport'],

  (Backbone, RandQuotSet, RandQuotView, matchMedia, isElementInViewport) ->

    removeStyle = () ->
      # Accepts jQuery DOM objects.
      for $a in arguments
        $a.removeAttr "style"


    RandQuotApp = Backbone.View.extend


      initialize : (options) ->

        # Get some DOM elements for reuse.
        @["dom"] = {}
        @dom.body = $(".rq-body")
        @dom.back = $(".rq-backdrop")
        @dom.cont = $(".rq-content")

        # A function that checks we're at desktop-size or not, whenever its called.
        @["settings"] = {}
        @settings.desktop = ->
          if matchMedia('screen and (min-width: 760px)').matches then true else false
        @settings.ipad = ->
          if matchMedia('only screen and (min-device-width : 768px) and (max-device-width : 1024px)').matches then true else false

        if options
          @settings.home = options.home || false

        # Make it go.
        @setClickEvents()
        @getQuot()


      setClickEvents : ->
        # Set the click events that make things go.
        $ =>
          $(".rq-btn").click =>
            @settings.getThenShow = true
            @getQuot()
          $(".rq-backdrop, .rq-close").click => @hideQuot()
          $(".rq-another").click =>
            @settings.getThenShow = false
            @getQuot()


      getQuot : ->

        ### @settings.running should be "true" while there is
        fetching and rendering going on -- then it turns to false.
        This settings prevents weirdness from happening if user
        clicks .rq-another too quickly -- trying to get a new quote
        while another is still fetching/rendering. ###
        if @settings.running
          return

        else
          @settings.running = true

          randQuotSet = new RandQuotSet()
          randQuotSet.fetch
            cache : false
            error : =>
              console.log "Failed to fetch a random quotation."
            success : =>
              @renderQuot(randQuotSet)


      renderQuot : (randQuotSet) ->

        params = model : randQuotSet.models[0]

        ### If there is no @activeQuot, this highlight's view will
        be it. If there is one already, set the "offscreen" option
        on the view and run @switchQuot. ###
        if !@activeQuot
          @activeQuot = new RandQuotView params
          if @settings.desktop()
            @desktopFirst()
          else
            @dom.body.addClass "opened"

          @settings.running = false

        else
          params["offscreen"] = true
          @offscreenQuot = new RandQuotView params
          @switchQuot()


      desktopFirst : ->
        ### If this is the first load and we're at desktop size,
        throw the @dom.body offscreen, and once it's filled slide
        it onscreen. ###

        @dom.body.hide().addClass "opened"

        @dom.body.css
          "margin-right" : "-28.128em"
          "opacity" : "0"
        @dom.body.show().animate { "opacity" : "1" }, { duration : 200, queue : false }
        @dom.body.animate { "margin-right" : "0" }, { duration : 700, queue : false }



      switchQuot : ->
        ### Animate a transition between active and offscreen
        highlights; then destroy the old view and make
        the new one the app's @activeQuot. ###

        $offQuotEl = $(@offscreenQuot.el)

        # Lock @dom.cont's current height and width.
        # (getComputedStyle doesn't round, as jQuery's height()/width() do)
        c = document.getElementById("rqContent")
        @dom.cont.height window.getComputedStyle(c).height
        @dom.cont.width window.getComputedStyle(c).width

        repositionHighlight = =>
          # Re-position the new highlight and fade it in.
          $offQuotEl.css
            position : "static"
            right : "auto"
          $offQuotEl.animate opacity : "1"

          if !@settings.getThenShow
            top = $("#rqTop").offset().top
            scrollTo = if @settings.desktop() and not @settings.home and not @settings.ipad() then top - 60 else top - 20
            if not isElementInViewport document.getElementById("rqTop")
              $('body, html').animate scrollTop: scrollTo, "fast"

          # Remove inline-style attributes.
          removeStyle $offQuotEl, @dom.cont

        # Fade out @activeQuot, then remove it.
        $(@activeQuot.el).fadeOut =>
          @activeQuot.remove()
          # Adjust @dom.cont's height to accommodate the new highlight.
          @dom.cont.animate { height : $offQuotEl.height() + "px" }, =>
            # Re-position the new highlight and fade it in.
            repositionHighlight() # above


          # Finally, designate the new highlight as the app's @activeQuot.
          @activeQuot = @offscreenQuot
          @offscreenQuot = ""

          if @settings.getThenShow
            @showQuot()

          @settings.running = false

      # showQuot and hideQuot only apply to non-desktop sizes.

      showQuot : ->

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
            @dom.body.removeClass("show")#.toggle()
            removeStyle @dom.body, @dom.back



    return RandQuotApp
