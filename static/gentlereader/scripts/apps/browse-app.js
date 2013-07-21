define(['backbone', 'models/tag-set', 'views/pg-select-view', 'views/br-tag-view', 'views/br-sel-view', 'routers/br-tag-router', 'utils/pagination-details', 'utils/ignore-articles', 'utils/globals'], function(Backbone, TagSet, PgSelectView, brTagView, brSelView, BrTagRouter, paginationDetails, ignoreArticles, globals) {
  var BrowseApp, perPage;
  globals = globals.getGlobals();
  perPage = tagType === "selections" ? 10 : 25;
  BrowseApp = Backbone.View.extend({
    settings: {
      container: $("#tag-list"),
      dataType: tagType,
      startPage: 1,
      itemsPerPage: perPage
    },
    sortField: function() {
      return $(".sort-radio[name='sortField']:checked").val();
    },
    initialize: function() {
      return this.getTags();
    },
    theComparator: function(modelA, modelB) {
      var firstModelField, secondModelField, sortField, sortOrder, sortValue;
      sortField = $(".sort-radio[name='sortField']:checked").val();
      sortOrder = $(".sort-radio[name='sortOrder']:checked").val();
      switch (sortField) {
        case "name":
          firstModelField = ignoreArticles(modelA.get(sortField).toLowerCase());
          secondModelField = ignoreArticles(modelB.get(sortField).toLowerCase());
          break;
        case "last_name":
          firstModelField = modelA.get(sortField).toLowerCase();
          secondModelField = modelB.get(sortField).toLowerCase();
          break;
        case "author":
          firstModelField = modelA.get("source").author.last_name;
          secondModelField = modelB.get("source").author.last_name;
          break;
        case "date_entered":
          firstModelField = new Date(modelA.get("date_entered_simple"));
          secondModelField = new Date(modelB.get("date_entered_simple"));
          break;
        case "birth_year":
          firstModelField = new Date(modelA.get("birth_year"));
          secondModelField = new Date(modelB.get("birth_year"));
          break;
        case "pub_year":
          firstModelField = modelA.get("source").pub_year;
          secondModelField = modelB.get("source").pub_year;
      }
      if (firstModelField < secondModelField) {
        sortValue = -1;
      } else if (firstModelField > secondModelField) {
        sortValue = 1;
      } else {
        sortValue = 0;
      }
      if (sortOrder === "des") {
        sortValue = sortValue * -1;
      }
      return sortValue;
    },
    getTags: function(sort) {
      var tSet,
        _this = this;
      tSet = this.tagSet = new TagSet();
      tSet.url = "/api/" + this.settings.dataType;
      tSet.comparator = this.theComparator;
      return tSet.fetch({
        error: function() {
          return console.log("The set couldn't be fetched.");
        },
        success: function() {
          if (tSet.length > _this.settings.itemsPerPage) {
            $("#page-and-sort").toggle();
            _this.router = new BrTagRouter;
            _this.router.navigate("page/" + _this.settings.startPage, {
              replace: true
            });
            _this.start();
            return _this.setEvents();
          } else {
            return $(".browse-container").show();
          }
        }
      });
    },
    start: function() {
      this.getPages();
      this.getPageSelect();
      return this.renderSet(this.settings.startPage);
    },
    getPages: function() {
      return this.pgParams = paginationDetails(this.tagSet, this.settings.itemsPerPage).startEndModels;
    },
    getPageSelect: function() {
      return this.pgView = new PgSelectView({
        pgParams: this.pgParams,
        router: this.router,
        dataType: this.settings.dataType,
        startPage: this.settings.startPage,
        sortField: this.sortField()
      });
    },
    renderSet: function(page) {
      var options;
      options = {
        collection: this.tagSet,
        page: page,
        pgParams: this.pgParams,
        container: this.settings.container
      };
      if (this.settings.dataType !== "selections") {
        return brTagView(options);
      } else {
        return brSelView(options);
      }
    },
    setEvents: function() {
      var _this = this;
      $(".sort-radio").off().on("click", function() {
        return _this.reSort();
      });
      return $(".adjustor-btn, .x-adjustor").off().on("click", function(ev) {
        return _this.toggleAdjustors($(ev.currentTarget));
      });
    },
    reSort: function() {
      this.tagSet.sort();
      this.start();
      return this.setEvents();
    },
    toggleAdjustors: function($clicked) {
      var target;
      $clicked.toggleClass("is-active");
      target = $clicked.data("adjustor");
      if (target === "page") {
        return $("#adjustor-pages-container").toggleClass("is-active");
      } else if (target === "sort") {
        return $("#adjustor-sort-container").toggleClass("is-active");
      }
    }
  });
  return BrowseApp;
});
