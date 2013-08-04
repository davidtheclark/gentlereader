define ['jquery',
        'apps/search-app',
        'lib/fastclick'],

  ($, searchApp, FastClick) ->

    BaseApp = ->

      # fast click
      $ ->
        FastClick.attach document.body

      # something seems weird with fastclick
      # for this particular input only; so a hack correction
      $homeSearch = $("#homeSearch")
      $homeSearch.bind "touchstart", (e) ->
        e.stopPropagation
      $homeSearch.bind "touchend", (e) ->
        e.stopPropagation
        $(e.target).trigger "focus"

      # nav menu

      $searchBtn = $("#navSearchBtn")
      $searchCont = $("#navSearch")
      $browseBtns = $(".js-nav-browse-btn")
      $browseCont = $("#navBrowse")

      menuToggle = ($desired, $other) ->
        $desired.slideToggle "fast", ->
          $(document).off "click"
          if $desired.css("display") == "block"
            $other.slideUp()
            # Clicking outside the container will close it
            $desired.click (e) ->
              e.stopPropagation()
            $(document).one "click", (e) ->
              $desired.slideToggle "fast"
          $(".search-form").find("input[type='search']").focus()

      # show and hide browse
      $browseBtns.click (e) ->
        e.stopPropagation()
        menuToggle $browseCont, $searchCont

      # show and hide search
      $searchBtn.click (e) ->
        e.stopPropagation()
        menuToggle $searchCont, $browseCont

      # back to top button
      $("#toTop").click ->
        $("html, body").animate scrollTop: 0

      # show and hide copyright info in footer
      $getCopy = $(".js-copyright-btn")
      $copyCont = $("#copyright")
      $getCopy.click (e) ->
        e.preventDefault()
        $copyCont.toggleClass "is-visible"
        $("html, body").animate scrollTop: $copyCont.offset().top

      searchApp.initialize()


    return BaseApp
