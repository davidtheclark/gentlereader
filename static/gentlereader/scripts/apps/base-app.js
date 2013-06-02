// Generated by CoffeeScript 1.6.1

define(['jquery', 'apps/search-app', 'lib/hyphenator'], function($, searchApp, Hyphenator) {
  var BaseApp;
  BaseApp = function() {
    var $browseBtn, $browseCont, $copyCont, $getCopy, $searchBtn, $searchCont, menuToggle;
    $searchBtn = $(".nav-search");
    $searchCont = $(".nav-search--container");
    $browseBtn = $(".nav-browse, .subnav-browse--close");
    $browseCont = $(".subnav-browse--container");
    menuToggle = function($desired, $other) {
      return $desired.slideToggle("fast", function() {
        $(document).off("click");
        if ($desired.css("display") === "block") {
          $other.slideUp();
          $desired.click(function(e) {
            return e.stopPropagation();
          });
          return $(document).one("click", function(e) {
            return $desired.slideToggle("fast");
          });
        }
      });
    };
    $browseBtn.click(function(e) {
      e.stopPropagation();
      return menuToggle($browseCont, $searchCont);
    });
    $searchBtn.click(function(e) {
      e.stopPropagation();
      return menuToggle($searchCont, $browseCont);
    });
    $("#toTop").click(function() {
      return $("html, body").animate({
        scrollTop: 0
      });
    });
    $getCopy = $(".get-copyright-info");
    $copyCont = $(".footer-copyright");
    $getCopy.click(function(e) {
      e.preventDefault();
      return $copyCont.slideToggle("fast", function() {
        if ($copyCont.css("display") === "block") {
          return $("html, body").animate({
            scrollTop: $copyCont.offset().top
          });
        }
      });
    });
    Hyphenator.run();
    return searchApp.initialize();
  };
  return BaseApp;
});
