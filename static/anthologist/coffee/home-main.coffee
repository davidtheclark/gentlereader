require ["jquery",
         "apps/rand-quot-app",
         "lib/unfinishedToggler",
         "lib/hyphenator"],

  ($, RandQuotApp, unfinishedToggler, hyphenator) ->

    $ ->

      new RandQuotApp home : true

      $about = $("#about")

      $(".site-header-more").click ->
        $(this).fadeOut "fast", ->
          $about.fadeIn()

      $(".about-close").click ->
        $about.fadeOut "fast", ->
          $(".site-header-more").fadeIn()
          $("html, body").animate scrollTop: 0


      $about.unfinishedToggler
        exclusive: false