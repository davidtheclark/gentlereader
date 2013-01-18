define(['backbone',
        'routers/home-router',
        'models/recent-content-set',
        'views/home-content-view'],
	
	function (Backbone, HomeRouter, RecentContentSet, homeViews) {
		var HomeApp = Backbone.View.extend({
			initialize: function () {
				this.router = new HomeRouter();
				if (Backbone.history.fragment === 'about') {
					this.router.about();
				}
				this.operaCheck();
				this.setAbout();
				this.setFilter();
				/* Set initial contentType for both selections and announcements */
				this.contentType = 'selAndAnn';
				this.getContents();
			},
			operaCheck: function () {
				/* Last I checked, the Hyphenate plugin does not work in Opera:
				 * results in broken words without added hyphens. */
				if ($.browser.opera) {
					$('#content-body').removeClass('hyphenate');
				}
			},
			setAbout: function () {
				/* Make all the clicking in the About section work. */
				var self = this;
				$('#open-about').click(function () {
					self.router.navigate('about', { trigger: true });
				});
				$('#close-about').click(function () {
					self.router.navigate('');
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
			},
			setFilter: function () {
				/* Make the Recent Contents filter work (set restrictions and fetch a new collection). */
				var self = this;
				$('#recent-contents-filter').change(function () {
					/* Fade out the buttons as well as the contents, so they don't jump up and down */
					$('#recent-contents-followup-container').fadeOut('fast');
					$('#list-container').fadeOut('fast', function () {
						$('#list-container').off().empty();
						self.contentType = $('#recent-contents-filter').val();
						self.restrictContents();
					});
				});	
			},
			getContents: function (restriction) {
				/* After initialize, a new collection is fetched and rendered
				 * when a filter is selected. */
				var self = this;
				var cSet = self.contentSet = new RecentContentSet(null, restriction);
				cSet.fetch({
					success: function () {
						self.renderContents();
						$('#list-container, #recent-contents-followup-container').fadeIn('fast');
					}
				});
			},
			renderContents: function () {
				/* Determined whether each model is a selection or announcement
				 * and instantiates the appropriate View. */
				this.contentSet.forEach(function (item, index) {
					var View = (item.get('class_name') === 'Selection') ? homeViews.Sel : homeViews.Ann;
					new View({
						model: item,
						index: index
					});
				});
			},
			restrictContents: function () {
				/* Creates the restriction parameter and gets a new Recent Content set to match it. */
				var restrictTo;
				switch(this.contentType) {
					case 'selAndAnn':
						restrictTo = undefined;
						break;
					case 'selOnly':
						restrictTo = 'selections';
						break;
					case 'annOnly':
						restrictTo = 'announcements';
						break;
				}
				this.getContents({ 'restriction': restrictTo });
			}
		});
		return HomeApp;
	}
);