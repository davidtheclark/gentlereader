define(['backbone'],
	
    function (Backbone) {
		var HomeRouter = Backbone.Router.extend({
			initialize: function () {
				Backbone.history.start({ silent: true });
			},
			routes: {
				'about': 'about'
			},
			about: function() {
				$("html, body").animate({ scrollTop: 0 });
				$('#about-container').slideToggle();
				$('#open-about').fadeOut();					
			}
		});
		return HomeRouter;
	}
);