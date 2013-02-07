define(['backbone'],
	
    function (Backbone) {
		var HomeRouter = Backbone.Router.extend({
			initialize: function () {
				Backbone.history.start({ silent: true });
			},
			routes: {
				'about': 'toggleAbout',
				'home': 'toggleAbout'
			},
			toggleAbout: function () {
				$("html, body").animate({ scrollTop: 0 });
				$('#about-container').slideToggle('medium', function () {
					$('#open-about').fadeToggle();
				});
			}
		});
		return HomeRouter;
	}
);