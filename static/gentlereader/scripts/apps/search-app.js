define(["jquery", "typeahead"], function($, typeahead) {
  var searchApp, searchSets;
  searchSets = [
    {
      name: "Authors",
      prefetch: "/api/search/authors",
      header: "<h3 class='search-category'>Authors</h3>"
    }, {
      name: "Topics",
      prefetch: "/api/search/topics",
      header: "<h3 class='search-category'>Topics</h3>"
    }, {
      name: "Genres",
      prefetch: "/api/search/genres",
      header: "<h3 class='search-category'>Genres</h3>"
    }, {
      name: "Contexts",
      prefetch: "/api/search/contexts",
      header: "<h3 class='search-category'>Contexts</h3>"
    }, {
      name: "Contexts",
      prefetch: "/api/search/contexts",
      header: "<h3 class='search-category'>Contexts</h3>"
    }, {
      name: "Nation",
      prefetch: "/api/search/nations",
      header: "<h3 class='search-category'>Nations</h3>"
    }, {
      name: "Languages",
      prefetch: "/api/search/languages",
      header: "<h3 class='search-category'>Languages</h3>"
    }, {
      name: "Forms",
      prefetch: "/api/search/forms",
      header: "<h3 class='search-category'>Forms</h3>"
    }, {
      name: "Selections",
      prefetch: "/api/search/selections",
      header: "<h3 class='search-category'>Selections</h3>"
    }
  ];
  searchApp = {
    initialize: function() {
      this.doTypeahead();
      return this.doSearch();
    },
    doTypeahead: function() {
      $(".search-input").typeahead(searchSets);
      return $(".twitter-typeahead").on("typeahead:selected", function($e, data) {
        return window.location = data.url;
      });
    },
    doSearch: function() {
      return $(".search-form").submit(function() {
        var query, url;
        query = $(this).find(".search-input").val();
        url = "/search?query=" + query;
        window.location = url;
        return false;
      });
    }
  };
  return searchApp;
});
