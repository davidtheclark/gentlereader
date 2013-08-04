define ['backbone',
        'views/paginated-collection-view',
        'templates/selListItemTempl'],

  (Backbone, PaginatedColView, selListItemTempl) ->

    BrSelView = Backbone.View.extend
      tagName : "li"
      className: "selectioninlist"
      template: selListItemTempl
      initialize : ->
        @render()
      render : ->
        model = @model
        @$el.append @template model: model
        $("#selection-list").append @el
        # show the container
        $(".main-c").show()
        return @

    renderTagCollection = (options) ->
      new PaginatedColView
        collection : options.collection
        page : options.page
        container : $("#selection-list")
        pgParams : options.pgParams
        View : BrSelView

    return renderTagCollection