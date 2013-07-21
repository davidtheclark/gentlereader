define(['backbone', 'utils/ignore-articles'], function(Backbone, ignoreArticles) {
  var TagSet;
  TagSet = Backbone.Collection.extend({
    comparator: function(item) {
      var author, nm, selection;
      author = item.has("last_name");
      selection = item.has("teaser");
      if (author) {
        nm = item.get("last_name");
      } else if (selection) {
        nm = item.get("date_entered");
      } else {
        nm = item.get("name");
      }
      return ignoreArticles(nm.toLowerCase());
    }
  });
  return TagSet;
});
