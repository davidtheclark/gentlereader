define(['backbone',
        'models/sel-set',
        'views/br-timeline-view',
        'utils/ajax-error'],
	
	function (Backbone, SelSet, renderTimelineCol, ajaxError) {
		var cont = $('#timeline-sel-container');
		var BrTimelineApp = Backbone.View.extend({
			initialize: function () {
				var self = this;
				$(document).ready(function () {
					self.setSorter();
					self.setTeaser();
				});
				self.dir = 'asc';
				self.getSelections();
				
			},
			setSorter: function () {
				var self = this;
				$('#sort-direction').change(function () {
					self.sortSelections();
				});
			},
			setTeaser: function () {
				$('.toggle-teaser').click(function (ev) {
					$(ev.target).fadeOut('fast', function () {
						$(ev.target).next().fadeIn('fast');
					});
				});
			},
			getSelections: function () {
				var self = this;
				var queryObj = {
					display: 'list_item',
					sort: 'pub_year',
					direction: this.dir 
				}
				var sSet = this.selectionSet = new SelSet(null, { query: queryObj });
				sSet.fetch({
					error: ajaxError
				});
			},
			renderSelections: function () {
				renderTimelineCol({
					collection: this.selectionSet,
					page: 'all',
					container: cont,
					callback: this.setTeaser
				});
			},
			sortSelections: function () {
				var self = this;
				self.dir = $('#sort-direction').val();
				self.selectionSet.comparator = function (it) {
					var yr = it.get('source').pub_year;
					return (self.dir === 'asc') ? yr : -yr;
				};
				self.selectionSet.sort();
				self.renderSelections();
			}
		});
		return BrTimelineApp;
	}
);