$(function () {
	var SourceApplication = Backbone.View.extend({
		
		initialize: function () {
			this.currentQueryObject = {};
			this.getSources();
		},
		
		getSources: function () {
			this.SourceSet = sourceSet = new SourceSet(null, { query: this.currentQueryObject });
			sourceSet.fetch({
				success: function (set, response) {
					sourceSet.forEach(function (source) {
						var sourceView = new SourceView({ model: source });
						sourceView.render();
					});
					$('#source-list').fadeIn('fast', function () {
						/* Get the currently computed height and make it permanent, so that
						 * switches in the sorting don't cause the footer to leap up. */
						$('#main').height($('#main').height());
					});
				}
			});
		},
		
		sortSourceList: function () {
			this.currentQueryObject = {
				sort: $('#sort-field').val(),
				direction: $('#sort-direction').val()
			};
			var theApp = this;
			$('#source-list').fadeOut('fast', function () {
				$('#source-list').empty();
				theApp.getSources();
			});
		}
		
	});
	
	window.app = app = new SourceApplication();
	
	$('.sort-select').change(function () {
		app.sortSourceList(); //above
	});
	
});