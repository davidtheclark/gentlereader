define ["backbone",
        "utils/incorporate-query"],

  (Backbone, incorporateQuery) ->

    AuthorSet = Backbone.Collection.extend

      url : "/api/authors"
      initialize : (models, options) =>
        @url += incorporateQuery options

    return AuthorSet