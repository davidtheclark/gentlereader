define(["backbone", "utils/globals"], function(Backbone, globals) {
  var BrowseTimelineRouter;
  globals = globals.getGlobals();
  BrowseTimelineRouter = Backbone.Router.extend({
    initialize: function() {
      return Backbone.history.start({
        silent: true
      });
    },
    routes: {
      ":year": "goToYear"
    },
    selectAuthor: function(year) {
      return globals.app.goToYear(year);
    }
  });
  return BrowseTimelineRouter;
});
