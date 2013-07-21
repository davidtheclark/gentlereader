define(['backbone'], function(Backbone) {
  var RandQuotSet;
  RandQuotSet = Backbone.Collection.extend({
    url: "/api/quotations/random"
  });
  return RandQuotSet;
});
