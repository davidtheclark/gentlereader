define(['backbone'], function(Backbone) {
  var PaginatedColView;
  PaginatedColView = Backbone.View.extend({
    initialize: function(options) {
      /* Backbone collection, current page, page parameters,
      and View need to be passed as options on instantiation.
      */

      _.extend(this, options);
      return this.render();
    },
    render: function() {
      var _this = this;
      if (this.collection && this.page) {
        this.container.fadeOut("fast", function() {
          var end, i, sView, start, thisPageParams, _i;
          _this.container.off().empty();
          if (_this.page === "all") {
            start = 0;
            end = _this.collection.length - 1;
          } else {
            thisPageParams = _this.pgParams[_this.page - 1];
            start = thisPageParams.startIndex;
            end = thisPageParams.endIndex;
          }
          for (i = _i = start; start <= end ? _i <= end : _i >= end; i = start <= end ? ++_i : --_i) {
            sView = new _this.View({
              model: _this.collection.models[i],
              index: i
            });
          }
          return _this.container.fadeIn("fast", function() {
            if (_this.callback) {
              return _this.callback();
            }
          });
        });
      } else {
        console.log("Missing options: requires 'collection' and 'page'.");
      }
      return this;
    }
  });
  return PaginatedColView;
});
