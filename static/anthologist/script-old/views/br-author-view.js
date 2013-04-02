define(['backbone',
        'views/paginated-col-view'],
	
	function (Backbone, PaginatedColView) {
		var BrAuthorView = Backbone.View.extend({
			tagName: 'a',
			initialize: function () {
				this.render();
			},
			render: function () {
				var mod = this.model;
				/* Set the link's target. */
				this.$el.attr('href', '/authors/' + mod.get('slug'));
				var html = '<li><span itemprop="itemListElement">'
					+ mod.get('full_name') + ' '
					+ '(' + mod.get('dates') + ')'
					+ '</span></li>';
				this.$el.append(html);
				$('#tag-list').append(this.el);
				return this;
			}
		});
		var renderAuthorCol = function (opts) {
			new PaginatedColView({
				collection: opts.collection,
				page: opts.page,
				container: opts.container,
				pageDetails: opts.pageDetails,
				View: BrAuthorView
			});
		};		
		return renderAuthorCol;
	}
);