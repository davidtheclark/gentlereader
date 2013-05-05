define ['jquery',
        'lib/jquery.unfinishedToggler'],

  ($, unfinishedToggler) ->

    TimelineApp = ->
      $("#tl-list").unfinishedToggler
        exclusive : false

    return TimelineApp