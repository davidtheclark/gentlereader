define(['backbone', 'views/paginated-collection-view', 'templates/selListItemTempl'], function(Backbone, PaginatedColView, selListItemTempl) {
  var BrSelView, renderTagCollection;
  BrSelView = Backbone.View.extend({
    tagName: "li",
    className: "selectioninlist",
    template: selListItemTempl,
    initialize: function() {
      return this.render();
    },
    render: function() {
      var model;
      model = this.model;
      this.$el.append(this.template({
        model: model
      }));
      $("#selection-list").append(this.el);
      $(".main-c").show();
      return this;
    }
  });
  renderTagCollection = function(options) {
    return new PaginatedColView({
      collection: options.collection,
      page: options.page,
      container: $("#selection-list"),
      pgParams: options.pgParams,
      View: BrSelView
    });
  };
  return renderTagCollection;
});
