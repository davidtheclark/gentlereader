define(["backbone", "routers/browse-highlights-router", "templates/brQuotRandomTempl", "templates/brQuotAuthTempl", "lib/matchMedia", "utils/isElementInViewport"], function(Backbone, Router, randomTempl, fromAuthorTempl, matchMedia, isElementInViewport) {
  var BrowseHighlightApp, cont;
  cont = $("#browseHighlights");
  return BrowseHighlightApp = Backbone.View.extend({
    initialize: function(options) {
      this.router = new Router();
      this.setRandomizers();
      this.setAuthorSelect();
      if (Backbone.history.fragment) {
        return this.initialRouting();
      } else {
        return this.getRandom();
      }
    },
    setRandomizers: function() {
      var _this = this;
      return $(".random-highlights").click(function() {
        _this.router.navigate("/", {
          trigger: false
        });
        return _this.getRandom();
      });
    },
    setAuthorSelect: function() {
      var $select,
        _this = this;
      $select = $("#selectHighlightAuthor");
      return $select.change(function() {
        return _this.router.navigate($select.val(), {
          trigger: true
        });
      });
    },
    initialRouting: function() {
      "If there is a url fragment, route right away to get\nauthor-specific highlights.";
      return this.getHighlights(Backbone.history.fragment);
    },
    getRandom: function() {
      var quantity, settings,
        _this = this;
      quantity = 3;
      settings = {
        dataType: "json",
        url: "/api/quotations/random?quantity=" + quantity,
        error: function() {
          return console.log("Failure getting random highlights.");
        },
        success: function(data) {
          return _this.render(data, randomTempl);
        }
      };
      return $.ajax(settings);
    },
    getHighlights: function(identifier) {
      var settings,
        _this = this;
      settings = {
        dataType: "json",
        url: "/api/authors/" + identifier + "/quotations",
        error: function() {
          return console.log("Failure getting author highlights.");
        },
        success: function(data) {
          return _this.render(data, fromAuthorTempl, "highlight-author");
        }
      };
      return $.ajax(settings);
    },
    render: function(data, template, scrollTo) {
      var markup;
      markup = template(data);
      return cont.fadeOut(function() {
        return cont.html(markup).fadeIn(function() {
          var adjustment;
          if (scrollTo && !isElementInViewport(document.getElementById(scrollTo))) {
            adjustment = matchMedia("screen and (min-width: 760px)").matches ? 55 : 0;
            return $("html, body").animate({
              scrollTop: $("#" + scrollTo).offset().top - adjustment
            }, "fast");
          }
        });
      });
    }
  });
});
