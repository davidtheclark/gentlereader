define ['jquery',
        'lib/unfinishedToggler'],

  ($, unfinishedToggler) ->

    $ ->

      $("#relSelAccordion").unfinishedToggler
        exclusive : false


      widenTriggers = ->
        $root = $("#sExtrasAccordion")
        $items = $root.find ".uft-group"
        $triggers = $root.find ".uft-trigger"
        isOpen = false
        $items.each ->
          if $(this).hasClass "uft-on"
            isOpen = true
        if isOpen
          $triggers.addClass "u-wide"
        else
          $triggers.removeClass "u-wide"
      $("#sExtrasAccordion").unfinishedToggler
        exclusive : false
        postChange : widenTriggers


      # toggling highlights

      changeHighlight = ($now)->

        @.getNew = ($now) ->
          return  $now.next ".m-inactive"

        @.showNew = ($now) ->
          $next = @.getNew $now
          $nextHeight = $next.height()

          animFirst =
            opacity: 0
          animSecond =
            height: $nextHeight + "px"
          animThird =
            opacity: 1

          if $next.hasClass("s-highlight--all")
              $(".s-highlight > .s-extras--utils, .s-highlight > .s-extras--title").fadeOut()
          $now.animate animFirst, 200, ->
            $(".s-highlight--text").animate animSecond, 300, ->
              $next.animate animThird, 200, ->
                $now.removeClass("m-active").addClass("m-inactive")
                $next.removeClass("m-inactive").addClass("m-active")
                # if we're on the "see all" slide, hide title and clicker

        @.showNew $now


      $(".s-highlight--another").click ->
        $now = $(".s-highlight--li.m-active")
        changeHighlight $now