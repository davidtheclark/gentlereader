define(['backbone',
        'templates/selListItem',
        'views/paginated-col-view'],
	
	function (Backbone, selListItemTempl, PaginatedColView) {
		var SelView = Backbone.View.extend({
			className: 'sel-item-container',
			template: selListItemTempl,
			initialize: function () {
				this.render();
			},
			render: function () {
				this.$el.append(this.template(this.model.toJSON()));
				/* To every other model add the "sel-even" class, which will shade it. */
				var it = (((this.options.index) % 2 != 0) ? this.$el.addClass('sel-even') : this.$el);
				$('#sel-container').append(it);
				return this
			}
		});
		var renderSelCol = function (opts) {
			new PaginatedColView({
				collection: opts.collection,
				page: opts.page,
				container: opts.container,
				pageDetails: opts.pageDetails,
				View: SelView
			});
		}
		return renderSelCol;
	}	
);