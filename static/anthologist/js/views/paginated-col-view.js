define(['backbone'],
		
	function (Backbone) {
		var PaginatedColView = Backbone.View.extend({
			initialize: function (opts) {
				_.extend(this, opts);
				this.render();
			},
			render: function () {
				/* Backbone collection, current page, pageDetails,
				 * and View need to be passed as options on instantiation. */
				var self = this;
				if (self.collection && self.page) {
					/* start and end set the limits for the page: only
					 * models within that range will be rendered. */
					var start, end;
					self.container.fadeOut('fast', function () {
						self.container.off().empty();
						if (self.page === 'all') {
							start = 0;
							end = self.collection.length - 1;
						} else {
							var thisPageDets = self.pageDetails[self.page - 1];
							start = thisPageDets.startIndex;
							end = thisPageDets.endIndex
						}
						var i = start;
						while (i <= end) {
							var sView = new self.View({
								model: self.collection.models[i],
								index: i
							});
							i++
						}
					});
					self.container.fadeIn('fast', function () {
						if (self.callback) { self.callback(); }
					});
				} else {
					console.log('Missing options: requires "collection" and "page".');
				}
				return this;
			}
		});
		return PaginatedColView;
	}
);