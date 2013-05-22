require ["jquery",
         "lib/unfinishedToggler"],

  ($, unfinishedToggler) ->
    $ ->

      $about = $("#about")

      $(".site-header-more").click ->
        $about.slideToggle()

      $about.unfinishedToggler
        exclusive: false