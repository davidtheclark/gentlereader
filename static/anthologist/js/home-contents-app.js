$(document).ready(function () {
	var HomeContentsApplication = Backbone.View.extend({
		
		initialize: function () {
			/* Set initial contentType for both selections and announcements */
			this.contentType = 'selAndAnn';
			this.getContents();
		},
		
		getContents: function (restrict) {
			var cSet = this.contentSet = new RecentContentSet(null, restrict);
			cSet.fetch({
				success: function (set, response) {
					cSet.forEach(function (item, index) {
						if (item.get('class_name') == 'Selection') {
							var selectionView = new SelectionView({
								model: item,
								index: index
							});
							selectionView.render();
						}
						else if (item.get('class_name') == 'Announcement') {
							var announcementView = new AnnouncementView({
								model: item,
								index: index
							});
							announcementView.render();
						}
					});
					$('#list-container, #recent-contents-followup-container').fadeIn('fast');
				}
			});
		},
		
		restrictContents: function () {
			var restrictTo;
			if (this.contentType == 'selAndAnn') {
				restrictTo = undefined;
			}
			else if (this.contentType == 'selOnly') {
				restrictTo = 'selections';
			}
			else if (this.contentType == 'annOnly') {
				restrictTo = 'announcements';
			}
			this.getContents({ 'restriction': restrictTo });
		}
		
	});
	
	//Create an instance of the application.
	window.app = app = new HomeContentsApplication();
	
	$('#recent-contents-filter').change(function () {
		/* Fade out the buttons as well as the contents, so they don't jump up and down */
		$('#recent-contents-followup-container').fadeOut('fast');
		$('#list-container').fadeOut('fast', function () {
			$('#list-container').empty();
			app.contentType = $('#recent-contents-filter').val();
			app.restrictContents();
		});
	});

});