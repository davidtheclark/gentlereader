define(['backbone',
        'views/paginated-col-view',
        'templates/timelineSel'],
	
	function (Backbone, PaginatedColView, template) {
		var TimelineItemView = Backbone.View.extend({
			template: template,
			className: 'timeline-sel-item',
			initialize: function () {
				this.render();
			},
			render: function () {
				var mod = this.model;
				this.$el.append(this.template(mod.toJSON()));
				var it = (((this.options.index) % 2 != 0) ? this.$el.addClass('timeline-sel-even') : this.$el);
				$('#timeline-sel-container').append(it);
				return this;
			}
		});
		var renderTimelineCol = function (opts) {
			new PaginatedColView({
				collection: opts.collection,
				page: opts.page,
				container: opts.container,
				View: TimelineItemView,
				callback: opts.callback
			});
		};		
		return renderTimelineCol;
	}
);