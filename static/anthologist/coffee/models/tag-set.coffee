define ['backbone',
        'utils/ignore-articles'],

  (Backbone, ignoreArticles) ->
    
    TagSet = Backbone.Collection.extend
      comparator : (item) ->
        
        lastName = item.get("last_name") or ""
        nm = if lastName then lastName else item.get "name"
        return ignoreArticles nm.toLowerCase()
    
    return TagSet
