require ["jquery",
         "apps/rand-quot-app",
         "lib/unfinishedToggler"],

  ($, RandQuotApp, unfinishedToggler) ->

    $ ->

      new RandQuotApp()

      $("#about").unfinishedToggler
        exclusive: false