require ["jquery",
         "apps/rand-quot-app",
         "lib/unfinishedToggler",
         "lib/hyphenator"],

  ($, RandQuotApp, unfinishedToggler, hyphenator) ->

    $ ->

      new RandQuotApp()

      $about = $("#about")

      $about.unfinishedToggler
        exclusive: false