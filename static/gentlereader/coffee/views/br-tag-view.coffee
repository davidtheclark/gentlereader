define ['backbone',
        'views/paginated-collection-view'],

  (Backbone, PaginatedColView) ->

    BrTagView = Backbone.View.extend
      tagName : "li",
      initialize : ->
        @render()
      render : ->
        model = @model
        slug = model.get "slug"
        author = model.has "last_name" # test if model is an author
        link = $("<a />").attr("href", slug).addClass("taglist-i")
        span = $("<span />").addClass("taglist-i-inner").appendTo(link)
        if author
          span.html "#{model.get('full_name')} <span class='browse-author-dates'>(#{model.get('dates')})</span>"
        else
          span.html model.get("name")
        @$el.append link
        $("#tag-list").append @el
        # show the container
        $(".main-c").show()
        return @

    renderTagCollection = (options) ->
      new PaginatedColView
        collection : options.collection
        page : options.page
        container : options.container
        pgParams : options.pgParams
        View : BrTagView

    return renderTagCollection