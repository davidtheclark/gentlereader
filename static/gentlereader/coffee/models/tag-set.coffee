define ['backbone',
        'utils/ignore-articles'],

  (Backbone, ignoreArticles) ->

    TagSet = Backbone.Collection.extend
      comparator : (item) ->

        # test if item is author
        author = item.has("last_name")
        # test if item is selection
        selection = item.has("teaser")

        if author
          nm = item.get "last_name"
        else if selection
          nm = item.get "date_entered"
        else
          nm = item.get "name"

        return ignoreArticles nm.toLowerCase()

    return TagSet
