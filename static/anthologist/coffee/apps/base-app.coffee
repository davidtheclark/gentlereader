define ['jquery',
        'apps/search-app',
        'lib/picturefill'],

  ($, searchApp, picturefill) ->

    BaseApp = ->

      # show and hide browse
      $(".nav-browse, .subnav-browse--close").click ->
        $(".subnav-browse--container").slideToggle "fast"
        $(".nav-search--container").slideUp()

      # show and hide search
      $(".nav-search").click ->
        $(".nav-search--container").slideToggle "fast"
        $(".subnav-browse--container").slideUp()

      searchApp.initialize()

    return BaseApp
