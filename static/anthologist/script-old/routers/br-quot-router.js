define(['backbone',
        'utils/globals'],
        
	function(Backbone, globals) {
		var globals = globals.getGlobals();
		var QuotRouter = Backbone.Router.extend({
			initialize: function () {
				Backbone.history.start({ silent: true });
			},
			routes: {
				'author/:id' : 'getQuots',
				'': 'getRandom'
			},
			getQuots: function (id) {
				$('#html, body').animate({ scrollTop: 0});
				globals.app.getQuotations(id);
			},
			getRandom: function () {
				globals.app.getRandom();
			}
		});
		return QuotRouter;
	}
	
);