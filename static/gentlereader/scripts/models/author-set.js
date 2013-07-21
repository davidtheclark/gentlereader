define(["backbone", "utils/incorporate-query"], function(Backbone, incorporateQuery) {
  var AuthorSet,
    _this = this;
  AuthorSet = Backbone.Collection.extend({
    url: "/api/authors",
    initialize: function(models, options) {
      return _this.url += incorporateQuery(options);
    }
  });
  return AuthorSet;
});
