define(['backbone', 'templates/pgSelectTempl'], function(Backbone, pgSelectTempl) {
  var BottomPaginatorView, PgSelectView;
  BottomPaginatorView = Backbone.View.extend({
    className: "bottom-paginator",
    tagName: 'ul',
    initialize: function(options) {
      _.extend(this, options);
      return this.fillPageList();
    },
    fillPageList: function() {
      var $list, i, liClass, _i, _ref;
      liClass = this.liClass = "bottom-paginator-i";
      $list = this.$el;
      $list.append("<li class='" + liClass + "' data-page='prev'>&lsaquo;</li>");
      for (i = _i = 1, _ref = this.total; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        $list.append("<li class='" + liClass + "' data-page='" + i + "'>" + i + "</li>");
      }
      $list.append("<li class='" + liClass + "' data-page='next'>&rsaquo;</li>");
      return this.renderPageList();
    },
    assignCurrent: function(current) {
      var lis;
      if (current === "all") {
        this.$el.hide();
      } else {
        this.$el.show();
      }
      lis = $("." + this.liClass);
      return lis.each(function() {
        var $li;
        $li = $(this);
        $li.removeClass("is-current");
        if ($li.data("page") === current) {
          return $li.addClass("is-current");
        }
      });
    },
    renderPageList: function() {
      $(".browse-container").append(this.el);
      return this.assignCurrent(this.current);
    },
    events: {
      "click .bottom-paginator-i": "go"
    },
    go: function(ev) {
      var $target, pageNo;
      pageNo = $(ev.currentTarget).data("page");
      if (pageNo === "next") {
        $target = $(".page-select-arrow.u-right");
      } else if (pageNo === "prev") {
        $target = $(".page-select-arrow.u-left");
      } else {
        $target = $(".pagelist-i[data-page='" + pageNo + "']");
      }
      $target.click();
      return $("html, body").animate({
        scrollTop: 0
      });
    }
  });
  PgSelectView = Backbone.View.extend({
    el: "#adjustor-pages-container",
    template: pgSelectTempl,
    initialize: function(options) {
      _.extend(this, options);
      $(".bottom-paginator").off().remove();
      this.bottomPaginator = new BottomPaginatorView({
        current: this.pageNo,
        total: this.options.pgParams.length,
        router: this.router
      });
      this.pageNo = this.startPage;
      this.setEvents();
      return this.render();
    },
    getModelDisplay: function(model) {
      /* From each relevant model, get the text to display in
      the page list. This relies on the option "dataType" passed when
      the View is instantiated. The page list for selection lists can show
      date entered, author last name, or pub year; for author lists just
      last name; for tags just name.
      */

      if (this.dataType === "selections") {
        switch (this.sortField) {
          case "date_entered":
            return model.get("date_entered_simple");
          case "author":
            return model.get("source").author.last_name.toUpperCase();
          case "pub_year":
            return model.get("source").date_display;
        }
      } else if (this.dataType === "authors") {
        switch (this.sortField) {
          case "last_name":
            return model.get("last_name").toUpperCase();
          case "birth_year":
            return model.get("birth_year");
        }
      } else {
        return model.get("name").toUpperCase();
      }
    },
    setEvents: function() {
      var _this = this;
      return $(".page-select-arrow").off().on("click", function(ev) {
        return _this.flipPage($(ev.currentTarget));
      });
    },
    events: {
      "click .pagelist-i": "changePage"
    },
    changePage: function(ev) {
      this.pageNo = $(ev.currentTarget).data("page");
      this.pageName = $(ev.currentTarget).text();
      if (this.router) {
        this.router.navigate("page/" + this.pageNo, {
          trigger: true
        });
        return this.changeSelectedPage();
      } else {
        return console.log("No router found.");
      }
    },
    changeSelectedPage: function() {
      var $newPage, items, result;
      $("#page-list-current").empty();
      items = $(".pagelist-i");
      $newPage = items.filter("[data-page='" + this.pageNo + "']");
      items.filter(".is-active").removeClass("is-active");
      $newPage.addClass("is-active");
      if (this.pageNo === "all") {
        result = "showing " + ($newPage.text()) + "<br><br>";
      } else {
        result = "showing page " + this.pageNo + " of " + this.pgParams.length + ":<br>" + ($newPage.text());
      }
      $('#page-list-current').html(result);
      return this.bottomPaginator.assignCurrent(this.pageNo);
    },
    flipPage: function($clicked) {
      var lastPage, move, newPage, prev;
      move = $clicked.hasClass("u-left") ? "prev" : "next";
      lastPage = this.pgParams.length;
      if (this.pageNo === 'all') {
        if (move === "prev") {
          newPage = lastPage;
        } else {
          newPage = 1;
        }
      } else {
        prev = $clicked.hasClass("u-left");
        if (this.pageNo === 1 && prev) {
          newPage = lastPage;
        } else if (this.pageNo === lastPage && !prev) {
          newPage = 1;
        } else {
          newPage = prev ? this.pageNo - 1 : this.pageNo + 1;
        }
      }
      return $(".pagelist-i").filter("[data-page='" + newPage + "']").click();
    },
    render: function() {
      var container, end, i, itemCount, params, pg, pgCount, results, start, templateVars, _i, _len;
      $(this.el).off().empty();
      params = this.pgParams;
      if (params) {
        container = this.container || $("#adjustor-pages-container");
        pgCount = params.length;
        itemCount = params[pgCount - 1].endIndex + 1;
        container.off();
        templateVars = {
          itemCount: itemCount,
          dataType: this.dataType,
          pages: []
        };
        for (i = _i = 0, _len = params.length; _i < _len; i = ++_i) {
          pg = params[i];
          start = this.getModelDisplay(pg.startModel);
          end = this.getModelDisplay(pg.endModel);
          results = {
            fill: start !== end ? "" + start + " to " + end : start,
            num: i + 1
          };
          templateVars.pages.push(results);
        }
        this.$el.append(this.template(templateVars));
        container.append(this.el);
        this.changeSelectedPage();
      } else {
        console.log("No page details found.");
      }
      return this;
    }
  });
  return PgSelectView;
});
