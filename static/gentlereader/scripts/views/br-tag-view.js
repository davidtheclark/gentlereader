define(['backbone', 'views/paginated-collection-view'], function(Backbone, PaginatedColView) {
  var BrTagView, renderTagCollection;
  BrTagView = Backbone.View.extend({
    tagName: "li",
    initialize: function() {
      return this.render();
    },
    render: function() {
      var author, link, model, slug, span;
      model = this.model;
      slug = model.get("slug");
      author = model.has("last_name");
      link = $("<a />").attr("href", slug).addClass("taglist-i");
      span = $("<span />").addClass("taglist-i-inner").appendTo(link);
      if (author) {
        span.html("" + (model.get('full_name')) + " <span class='browse-author-dates'>(" + (model.get('dates')) + ")</span>");
      } else {
        span.html(model.get("name"));
      }
      this.$el.append(link);
      $("#tag-list").append(this.el);
      $(".main-c").show();
      return this;
    }
  });
  renderTagCollection = function(options) {
    return new PaginatedColView({
      collection: options.collection,
      page: options.page,
      container: options.container,
      pgParams: options.pgParams,
      View: BrTagView
    });
  };
  return renderTagCollection;
});
