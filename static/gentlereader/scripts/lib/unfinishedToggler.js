/*
Anticipating problems:
- If "exclusive" is true, the selector passed to "initial" cannot have more than one match.
- Because the appearance of "uft-on" elements is determined by CSS, if you want an element
"on" initially you can either apply the class in the markup or pass if to the "initial" option.

*/


define(['jquery'],

function($) {

  var app = {};

  app.methods = {

    init : function(options) {

      var defaults = {

        /* If "diasporic" is false (default), uft will assume that relationships
        are indicated by a DOM hierarchy: all related uft-group elements
        are children of a root element (on which the function is called),
        and all uft-trigger, -a, and -b elements are children of a
        uft-group.
          If "diasporic" is true, uft will group elements based
        on their data-uft attributes. */
        'diasporic' : false,

        /* The trigger event might be a click (default), onmouseover, or
        whatever. */
        'event' : 'click',

        /* If "exclusive" is true (default), only one group within any root
        can have the uft-on class at a time. Turing something "on" will turn
        everything else off. If it's false, multiple groups
        can be "on" at the same time. */
        'exclusive' : true,

        /* If "allOff" is true (default), all groups can be "off" at once.
        If it's false, at least one group must be "on". */
        'allOff' : true,

        /* "initial" should be either false (default) or a jQuery/CSS selector
        determining which any elements should initially get classed uft-on. */
        'initial' : false,

        /* "preChange" and "postChange" provide opportunities to load
        custom functions that will run before or after the uft-on
        class is changed by uft. Use cases include elaborate animations,
        specific custom formatting, etc. */
        'preChange' : false,
        'postChange' : false

      };

      return this.each(function(index) {
        /* Find all uft-triggers within this root, and bind them
        (depending on settings) to the _diasporic or _anasporic methods. */

        var $root = app.root = $(this);
        var settings = $.extend({}, defaults, options);

        /* Tie the settings to the root element, for future reference when
        that root (as opposed to any others) are clicked.
        Without this step, multiple uft calls on the same page won't work. */
        $root.data('uft', { settings : settings });

        /* If settings.initial is true, run _openIntial to dish out
        the uft-on class. */
        if (settings.initial) app.methods._openInitial();

        // Bind the uft-triggers.
        var namespacedEvent = settings.event + '.uft';
        $root.on(namespacedEvent, '.uft-trigger', function() {
          var $trigger = $(this);
          /* Now, given a certain root, attach its settings to the app,
          for reference outside of this method. */
          app.settings = $root.data('uft').settings;
          /* Then run. */
          if (!app.settings.diasporic) {
            app.methods._anasporic($trigger, $root);
          } else {
            app.methods._diasporic($trigger, $root);
          }
        });

      });

    },

    _openInitial : function () {
      /* Find elements that match the "initial" selector; then apply
      the uft-on class, either directly (anasporic) or through the
      _diasporic method. */
      var $els = app.root.find(app.settings.initial);
      if (app.settings.diasporic) {
        app.methods._diasporic($els, app.root);
      } else {
        $els.addClass('uft-on');
      }
    },

    _anasporic : function ($trigger, $root) {
      /* Required setup:
      1. The root element must have uft-group children.
      2. uft-trigger, -a and -b elements must be children of uft-groups;
      associated elements must be children of the same uft-group.

        Pass the trigger's uft-group and all the root's other uft-groups
      (strangers) to _change.
        *** Keep in mind that ONLY the uft-groups will receive (or be stripped of)
      the classname "uft-on": uft-trigger, -a, and -b elements will NOT be changed
      -- so their on/off-related styling has to depend upon their parent
      uft-group. */

      var $groups = $root.find('.uft-group');
      var $triggeredGroup = $groups.has($trigger);
      app.methods._change($triggeredGroup, $groups.not($triggeredGroup));
    },

    _diasporic : function ($trigger, $root) {
      /* Required setup:
      1. Every uft-trigger, uft-a, and uft-b must have a data-uft
      attribute that identifies its relations. The value should be a string with
      two comma-separated values: the first represents a uft supergroup, the second
      a uft group. (The supergroup allows there to be multiple diasporic uft sets
      within a single root.)

      Find the $trigger's relatives (others with the same data-uft attribute)
      and strangers; then pass them to _change.
      *** ALL uft elements will receive or lose the classname "uft-on", since a
      diasporic call cannot rely on any hierarchical markup structure. CSS
      must account for this. */

      // Turn the trigger's DNA into a two-valued array.
      var triggerDNA = $trigger.data('uft').split(',');
      var relatives = [];
      var strangers = [];

      // Get all uft elements within the root.
      var $elements = $root.find('.uft-trigger, .uft-a, .uft-b');

      $elements.each(function() {
        /* If the element is not in the trigger's supergroup (first value of the DNA),
        ignore it. If it's part of the supergrou AND group, it's a relative; if it's
        part of the supergroup but not the group, it's a stranger. */
        var $el = $(this);
        var elDNA = $el.data('uft').split(',');
        if (elDNA[0] === triggerDNA[0]) {
          if (elDNA[1] === triggerDNA[1]) {
            relatives.push($el[0]);
          } else {
            strangers.push($el[0]);
          }
        }
      });

      app.methods._change($trigger, $(strangers), $(relatives));
    },

    _change : function ($item, $strangers, $relatives) {

      if (app.settings.preChange) {
        app.settings.preChange();
      }

      /* inCrowd is a slight abstraction to incorporate both diasporic and
      anasporic groups. Anasporic calls will pass no relatives, just the uft-group,
      since only the uft-group will receive or lose the class "uft-on".
      Diasporic calls will pass relatives, since all of them need to be
      individually classed. inCrowd represents whatever element(s) will receive
      or lose the class "uft-on". */
      var $inCrowd = ($relatives) ? $relatives : $item;

      if ($item.hasClass('uft-on')) {
        if (app.settings.allOff) {
          /* If the item is "on" already and the settings allow everything
          to be "off", turn the item off. */
          $inCrowd.removeClass('uft-on');
        }
      } else {
        var $alreadyOn = $strangers.filter('.uft-on');
        $inCrowd.addClass('uft-on');
        if (app.settings.exclusive && $alreadyOn.length > 0) {
          $alreadyOn.removeClass('uft-on');
        }
      }

      if (app.settings.postChange) {
        app.settings.postChange();
      }

    }

  };

  $.fn.unfinishedToggler = function(method) {

    if (app.methods[method]) {
      return app.methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return app.methods.init.apply( this, arguments );
    } else {
      $.error('Method ' +  method + ' does not exist for jquery.unfinishedToggler.');
    }

  };

}

);