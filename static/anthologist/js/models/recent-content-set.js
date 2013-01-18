define(['backbone'],
	
	function (Backbone) {
		var RecentContentSet = Backbone.Collection.extend({
			url: '/api/recent/',
			initialize: function(models, options) {
				if (options && options.hasOwnProperty('restriction') && typeof options['restriction'] !== 'undefined') {
					this.url += options['restriction'];
				}
			}
		});
		return RecentContentSet;
	}
);