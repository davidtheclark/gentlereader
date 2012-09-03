var myRouterClass = Backbone.Router.extend({
	routes: {
		'about': 'about'
	},
	about: function() {		
		$('#about-container').slideToggle();
		$('#open-about').fadeOut();		
	}
});


$(document).ready(function () {
	
	/* Hyphenator doesn't seem to work in Opera (breaks up words but doesn't
	 * add the necessary hyphen). */
	if ($.browser.opera) {
		$('#content-body').removeClass('hyphenate');
	}
	
	var routing = new myRouterClass();
	Backbone.history.start();
	
	/* Making ABOUT work. */
	
	$('#open-about').click(function () {
		routing.navigate('about', { trigger: true });
	});
	$('#close-about').click(function () {
		routing.navigate('');
		$('#about-container').slideToggle('medium', function () {
			$('#open-about').fadeIn();
		});
	});
	
	$('#more-about-uniqueness').click(function () {
		$('#more-about-uniqueness').fadeOut('fast', function () {
			$('#about-hidden-uniqueness').fadeIn('slow');
		});
	})
	$('#more-about-me').click(function () {
		$('#more-about-me').fadeOut('fast', function () {
			$('#about-hidden-me').fadeIn('slow');
		});
	});

	
});