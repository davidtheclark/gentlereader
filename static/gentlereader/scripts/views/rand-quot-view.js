define(["backbone", "templates/randQuotTempl"], function(Backbone, randQuotTempl) {
  var $container, RandQuotView;
  $container = $(".rq-content");
  RandQuotView = Backbone.View.extend({
    className: "rand-quot-view",
    template: randQuotTempl,
    initialize: function(options) {
      _.extend(this, options);
      return this.render();
    },
    render: function() {
      /* If there is already an active highglight, @offscreen
      should have been set to true. The new highlight will
      be created and hidden offscreen.
      */

      var containerWidth;
      if (this.offscreen) {
        containerWidth = $container.width();
        this.$el.css({
          position: "absolute",
          right: "-5000px",
          width: containerWidth,
          opacity: 0
        });
      }
      this.$el.append(this.template(this.model.toJSON()));
      $container.append(this.el);
      return this;
    }
  });
  return RandQuotView;
});
