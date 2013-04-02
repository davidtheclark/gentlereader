define(['backbone',
        'utils/incorporate-query'],
        
	function(Backbone, incorporateQuery) {
		var AuthorSet = Backbone.Collection.extend({
			url: '/api/authors/',
			initialize: function (models, options) {
				this.url += incorporateQuery(options);
			}
		});	
		return AuthorSet;
	}
);
