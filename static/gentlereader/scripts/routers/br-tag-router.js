define(['backbone', 'utils/globals'], function(Backbone, globals) {
  var BrTagRouter;
  globals = globals.getGlobals();
  BrTagRouter = Backbone.Router.extend({
    /* App passes pageChanger() as an option.*/

    initialize: function(options) {
      _.extend(this, options);
      return Backbone.history.start({
        silent: true
      });
    },
    routes: {
      "page/:page": "changePage"
    },
    changePage: function(page) {
      return globals.app.renderSet(page);
    }
  });
  return BrTagRouter;
});
