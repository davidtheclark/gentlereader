define(['backbone',
		'utils/incorporate-query'],

	function (Backbone, incorporateQuery) {
		var SourceSet = Backbone.Collection.extend({
			url: '/api/sources/',
			initialize: function (models, options) {
				this.url += incorporateQuery(options);
			}
		});
		return SourceSet;
	}
);