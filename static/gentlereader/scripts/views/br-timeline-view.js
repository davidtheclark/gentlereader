define(['backbone', 'views/paginated-collection-view', 'templates/timelineListItem'], function(Backbone, PaginatedColView, timelineListItem) {
  var BrTimelineView, renderTagCollection;
  BrTimelineView = Backbone.View.extend({
    tagName: "li",
    className: "tl-sel uft-group",
    template: timelineListItem,
    initialize: function() {
      return this.render();
    },
    render: function() {
      var model;
      model = this.model;
      this.$el.append(this.template({
        model: model
      }));
      $("#tl-list").append(this.el);
      return this;
    }
  });
  renderTagCollection = function(options) {
    return new PaginatedColView({
      collection: options.collection,
      page: options.page,
      container: $("#tl-list"),
      pgParams: options.pgParams,
      View: BrTimelineView
    });
  };
  return renderTagCollection;
});
