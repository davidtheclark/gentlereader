define(['backbone',
        'views/paginated-col-view'],
	
	function (Backbone, PaginatedColView) {
		var BrTagView = Backbone.View.extend({
			tagName: 'a',
			initialize: function () {
				this.render();
			},
			render: function () {
				var mod = this.model;
				/* Set the link's target. */
				this.$el.attr('href', '/' + mod.get('tag_type_display') + 's/' + mod.get('slug'));
				var html = '<li><span itemprop="itemListElement">' + mod.get('name') + '</span></li>';
				this.$el.append(html);
				$('#tag-list').append(this.el);
				return this;
			}
		});
		var renderTagCol = function (opts) {
			new PaginatedColView({
				collection: opts.collection,
				page: opts.page,
				container: opts.container,
				pageDetails: opts.pageDetails,
				View: BrTagView
			});
		};		
		return renderTagCol;
	}
);