var timelineRouter = Backbone.Router.extend({
	routes: {
		':year': 'slide'
	},
	slide: function (year) {
		setTimeout(function () {
			$('html, body').animate({ scrollTop: $('#' + year).offset().top },'slow');
		}, 3000); //Wait is necessary so TimelineApplication can finish rendering the template
	}
});

var TimelineApplication = Backbone.View.extend({
	initialize: function () {
		$('#timeline-sel-container').empty();
		/* queryObject should describe whatever selections are being shown. */
		
		/* Usually initial sort is "asc", but would be "des" if user (1) came to the
		 * timeline through a route (e.g. #65), (2) changed the sort order (reducing
		 * the route to #), (3) left the page, then (4) used browser's backbutton to
		 * return to the timeline. */ 
		this.sortDir = $('#sort-direction').val(); 
		
		this.getSelections();
	},
	getSelections: function () {
		this.selectionSet = selSet = new SelectionSet(null, { query: { 'sort': 'pub_year', 'direction': this.sortDir } });
		selSet.fetch({
			success: function (set, response) {
				selSet.forEach(function (selection, index) {
					var selectionView = new SelectionView({
						model: selection,
						index: index
					});
					selectionView.render();
				});
				$('#timeline-sel-container').fadeIn('fast');
				
				//Make the toggle-teaser buttons work
				$('.toggle-teaser').click(function () {
					$(this).fadeOut('fast', function () {
						$(this).next().fadeIn('fast');
					});
				});
			}
		});
	},
});

$(function () {
	
	window.app = app = new TimelineApplication();
	var routing = new timelineRouter();
	Backbone.history.start();
	
	$('#sort-direction').change(function () {
		$('#timeline-sel-container').fadeOut('fast', function () {
			$('#timeline-sel-container').empty();
			app.sortDir = $('#sort-direction').val();
			routing.navigate('');
			app.getSelections();
		});
	});
	
});