define ['backbone',
        'views/paginated-collection-view'],

  (Backbone, PaginatedColView) ->
    
    BrTagView = Backbone.View.extend
      tagName : "li",
      initialize : ->
        @render()
      render : ->
        model = @model
        name = model.get "name"
        slug = model.get "slug"
        markup = "<a href='#{slug}' class='tag-list--a'><span class='tag-list--span'>#{name}</span></a>"
        @$el.append markup
        $("#tag-list").append @el
        return @
    
    renderTagCollection = (options) ->
      new PaginatedColView
        collection : options.collection
        page : options.page
        container : options.container
        pgParams : options.pgParams
        View : BrTagView
    
    return renderTagCollection