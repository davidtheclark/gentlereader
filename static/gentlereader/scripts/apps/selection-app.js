define(['jquery', 'lib/unfinishedToggler'], function($, unfinishedToggler) {
  return $(function() {
    var changeHighlight, widenTriggers;
    $("#relSelAccordion").unfinishedToggler({
      exclusive: false
    });
    widenTriggers = function() {
      var $items, $root, $triggers, isOpen;
      $root = $("#sExtrasAccordion");
      $items = $root.find(".uft-group");
      $triggers = $root.find(".uft-trigger");
      isOpen = false;
      $items.each(function() {
        if ($(this).hasClass("uft-on")) {
          return isOpen = true;
        }
      });
      if (isOpen) {
        return $triggers.addClass("m-wide");
      } else {
        return $triggers.removeClass("m-wide");
      }
    };
    $("#sExtrasAccordion").unfinishedToggler({
      exclusive: false,
      postChange: widenTriggers
    });
    changeHighlight = function($now) {
      this.getNew = function($now) {
        return $now.next(".m-inactive");
      };
      this.showNew = function($now) {
        var $next, $nextHeight, animFirst, animSecond, animThird;
        $next = this.getNew($now);
        $nextHeight = $next.height();
        animFirst = {
          opacity: 0
        };
        animSecond = {
          height: $nextHeight + "px"
        };
        animThird = {
          opacity: 1
        };
        if ($next.hasClass("s-highlight--all")) {
          $(".s-highlight > .s-extras--utils, .s-highlight > .s-extras--title").fadeOut();
        }
        return $now.animate(animFirst, 200, function() {
          return $(".s-highlight--text").animate(animSecond, 300, function() {
            return $next.animate(animThird, 200, function() {
              $now.removeClass("m-active").addClass("m-inactive");
              return $next.removeClass("m-inactive").addClass("m-active");
            });
          });
        });
      };
      return this.showNew($now);
    };
    return $(".s-highlight--another").click(function() {
      var $now;
      $now = $(".s-highlight--li.m-active");
      return changeHighlight($now);
    });
  });
});
