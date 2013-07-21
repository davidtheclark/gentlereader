define(['jquery', 'models/tag-set', 'routers/browse-timeline-router', 'views/br-timeline-view', 'lib/unfinishedToggler'], function($, TagSet, Router, brTimelineView, unfinishedToggler) {
  var TimelineApp;
  TimelineApp = Backbone.View.extend({
    sortField: function() {
      return $(".sort-radio[name='sortField']:checked").val();
    },
    initialize: function() {
      $("#tl-list").unfinishedToggler({
        exclusive: false
      });
      this.router = new Router();
      if (Backbone.history.fragment) {
        return this.initialRouting();
      }
    },
    getSelections: function() {
      var sSet,
        _this = this;
      sSet = this.selectionSet = new TagSet();
      sSet.url = '/api/selections';
      sSet.scomparator = function(modelA, modelB) {
        var firstModelField, secondModelField, sortOrder, sortValue;
        sortOrder = $(".sort-radio[name='sortOrder']:checked").val();
        firstModelField = modelA.get("source").pub_year;
        secondModelField = modelB.get("source").pub_year;
        if (firstModelField < secondModelField) {
          sortValue = -1;
        } else if (firstModelField > secondModelField) {
          sortValue = 1;
        } else {
          sortValue = 0;
        }
        if (sortOrder === "des") {
          sortValue = sortValue * -1;
        }
        return sortValue;
      };
      return sSet.fetch({
        error: function() {
          return console.log("Failed to fetch the selections.");
        },
        success: function() {
          return _this.renderSelections();
        }
      });
    },
    renderSelections: function() {
      var options;
      options = {
        collection: this.selectionSet,
        page: 'all'
      };
      return brTimelineView(options);
    },
    initialRouting: function() {
      var scrollTo;
      scrollTo = $(".tl-year[data-year='" + Backbone.history.fragment + "']").offset().top - 60;
      return $("html, body").animate({
        scrollTop: scrollTo
      });
    }
  });
  return TimelineApp;
});
