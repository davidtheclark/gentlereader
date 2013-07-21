define ['backbone',
        'views/paginated-collection-view',
        'templates/selListItemTempl'],

  (Backbone, PaginatedColView, selListItemTempl) ->

    BrSelView = Backbone.View.extend
      tagName : "li"
      className: "li-sel"
      template: selListItemTempl
      initialize : ->
        @render()
      render : ->
        model = @model
        @$el.append @template model: model
        $("#selection-list").append @el
        # show the container
        $(".browse-container").show()
        return @

    renderTagCollection = (options) ->
      new PaginatedColView
        collection : options.collection
        page : options.page
        container : $("#selection-list")
        pgParams : options.pgParams
        View : BrSelView

    return renderTagCollection