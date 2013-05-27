define ['backbone'],
  
  (Backbone) ->
    RandQuotSet = Backbone.Collection.extend
      url : "/api/quotations/random"
    return RandQuotSet