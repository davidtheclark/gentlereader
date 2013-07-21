define ['backbone',
        'views/paginated-collection-view',
        'templates/timelineListItem'],

  (Backbone, PaginatedColView, timelineListItem) ->

    BrTimelineView = Backbone.View.extend
      tagName : "li"
      className: "tl-sel uft-group"
      template: timelineListItem
      initialize : ->
        @render()
      render : ->
        model = @model
        @$el.append @template model: model
        $("#tl-list").append @el
        return @

    renderTagCollection = (options) ->
      new PaginatedColView
        collection : options.collection
        page : options.page
        container : $("#tl-list")
        pgParams : options.pgParams
        View : BrTimelineView

    return renderTagCollection