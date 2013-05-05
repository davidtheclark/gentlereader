define ['jquery'],

  ($) ->
    
    BaseApp = ->
    
      $(".nav-browse, .subnav-browse--close").click ->
        $(".subnav-browse--container").toggleClass "show"
    
    return BaseApp
