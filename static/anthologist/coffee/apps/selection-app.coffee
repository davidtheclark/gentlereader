define ['jquery',
        'lib/jquery.unfinishedToggler'],

  ($, unfinishedToggler) ->

    accordion =

      mothers: []

      go: (options) ->

        $.extend @, options

        # Find all accordion-mothers, and for each one run @add.
        @getMothers()
        for $m in @mothers
          @add $m

      getMothers: ->
        # Find each accordion-mother and push it to @mothers
        app = @
        $(".j-accMother").each ->
          app.mothers.push $(this)

      add: ($m) ->
        app = @

        # Find all the mother's accordion-items and give them a
        # data-mother value equal to the mother's id
        id = $m.attr "id"
        $items = $m.find ".j-accItem"
        $items.data "mother", id

        # Find all the mother's triggers.
        triggers = $m.find ".j-accTrigger"

        # When a trigger is clicked, run @change
        triggers.click ->
            app.change $(this), $items, $m

      changeState: (action, $obj) ->
        if action == "show"
          $obj.removeClass("u-inactive").addClass("u-active") if $obj.hasClass("u-inactive")
        else if action == "hide"
          $obj.removeClass("u-active").addClass("u-inactive") if $obj.hasClass("u-active")

      change: ($trigger, $items, $mother) ->
        app = @

        # Find the accordion-item that the trigger applies to
        $thisItem = $items.has $trigger

        # Create an array of the 'sibling' accordion-items
        # (sharing the same mother).
        $otherItems = $items.not($thisItem)

        ###
        If thisItem is inactive, make it active;
        and if the accordion is marked oneAtATime = true,
        hide any other open accordion-items.
        If the accordion is marked closeAll = true
        and thisItem is active, make it inactive.
        ###

        if $thisItem.hasClass "u-inactive"
          app.changeState "show", $thisItem

          if app.oneAtATime
            $otherItems.each ->
              app.changeState "hide", $(this)

        else if $thisItem.hasClass("u-active") and app.closeAll
          app.changeState "hide", $thisItem

        # If there are special stylings, defined in accordion.style, do them.
        if accordion.style
          accordion.style($trigger, $thisItem, $items, $mother)


    $ ->

      accordion.style = ($trigger, $thisItem, $items, $mother) ->
        if $mother.attr("id") == "sExtrasAccordion"
          $triggers = $mother.find ".j-accTrigger"

          isOpen = false
          $items.each ->
            if $(this).hasClass "u-active"
              isOpen = true

          if isOpen
            $triggers.addClass "u-wide"

          else
            $triggers.removeClass "u-wide"

        else if $mother.attr("id") == "relSelAccordion"

          # The untaintedHeight ignores any "read teaser"
          # on its own line. The constant 6 I cannot account for,
          # but it prevents bouncing.
          untaintedHeight = $thisItem.find(".rsel-info-container").height()

          # In case "read teaser" is on its own line,
          # locking $thisItem's height prevents
          # the element beneath from bouncing up.
          $thisItem.height $thisItem.height()

          $trigger.fadeOut "fast", ->
            ###
            After the trigger is gone, calculate a new height
            for the accItem, adding untaintedHeight to accBody's height.
            Move the already-invisible teaser off-screen.
            Then perform a series of animations that increase the height,
            slide in the teaser, and then reset height and width (and make
            the teaser static) so browser can be resized after looking
            at a teaser.
            ###

            $body = $thisItem.find ".j-accBody"
            bodyWidth = $body.width()
            bodyHeight = $body.height()
            newItemHeight = untaintedHeight + bodyHeight

            # stablize the width of the body,
            # add opacity, and move it right
            $body.css
              width: bodyWidth
              right: bodyWidth * 2
              opacity: 1

            changeFirst =
              height: newItemHeight
            changeSecond =
              right: 0
            changeThird =
              position: "static"
              width: "auto"
            changeFourth =
              height: "auto"


            $thisItem.animate changeFirst, 300, ->

                $body.animate changeSecond, 300, ->

                   $body.css changeThird
                   $thisItem.css changeFourth



      ###
      accordion.go
        oneAtATime: false
        closeAll: true
      ###

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
          return  $now.next ".u-inactive"

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
                $now.removeClass("u-active").addClass("u-inactive")
                $next.removeClass("u-inactive").addClass("u-active")
                # if we're on the "see all" slide, hide title and clicker

        @.showNew $now


      $(".s-highlight--another").click ->
        $now = $(".s-highlight--li.u-active")
        changeHighlight $now