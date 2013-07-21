define ['jquery',
        'models/tag-set',
        'routers/browse-timeline-router',
        'views/br-timeline-view',
        'lib/unfinishedToggler'],

  ($, TagSet, Router, brTimelineView, unfinishedToggler) ->

    TimelineApp = Backbone.View.extend

      sortField : -> return $(".sort-radio[name='sortField']:checked").val()

      initialize : ->
        $("#tl-list").unfinishedToggler
          exclusive : false
        @router = new Router()
        if Backbone.history.fragment
          @initialRouting()

      getSelections : ->
        sSet = @selectionSet = new TagSet()
        sSet.url = '/api/selections'
        sSet.scomparator = (modelA, modelB) ->
          sortOrder = $(".sort-radio[name='sortOrder']:checked").val()
          firstModelField = modelA.get("source").pub_year
          secondModelField = modelB.get("source").pub_year
          if firstModelField < secondModelField
            sortValue = -1
          else if firstModelField > secondModelField
            sortValue = 1
          else
            sortValue = 0
          if sortOrder is "des"
            sortValue = sortValue * -1
          return sortValue
        sSet.fetch
          error : ->
            console.log "Failed to fetch the selections."
          success : =>
            @renderSelections();

      renderSelections : ->
        options =
          collection : @selectionSet
          page : 'all'
        brTimelineView options



      initialRouting : ->
        scrollTo = $(".tl-year[data-year='#{Backbone.history.fragment}']").offset().top - 60
        $("html, body").animate scrollTop : scrollTo

    return TimelineApp