define(['backbone',
		'models/source-set',
		'views/source-view',
		'utils/sort-asc-des',
        'utils/ajax-error'],
	
	function (Backbone, SourceSet, SourceView, sortAscDes, ajaxError) {
		var cont = $('#source-list');
		var ResourceApp = Backbone.View.extend({
			initialize: function () {
				this.setSorters();
				this.getSources();
			},
			setSorters: function () {
				var self = this;
				$('.sort-select').change(function () {
					self.sortSourceList();
				});	
			},
			getSources: function () {
				/* The sourceSet is created and fetched once, on initialize;
					sorting is done through Backbone's comparator. */ 
				var self = this;
				var sourceSet = this.sourceSet = new SourceSet();
				sourceSet.fetch({
					error: ajaxError,
					success: function (set, response) {
						self.renderSources();
						/* Get the currently computed height and make it permanent, so that
						 * switches in the sorting don't cause the footer to leap up. */
						$('#main').height($('#main').height());
					}
				});
			},
			renderSources: function () {
				this.sourceSet.forEach(function (source) {
					var sourceView = new SourceView({ model: source });
					sourceView.render();
				});
				cont.fadeIn('fast');
			},
			sortSourceList: function () {
				var self = this;
				cont.fadeOut('fast', function () {
					cont.off().empty();
					self.sourceSet.comparator = function (a,b) {
						var sortField = $('#sort-field').val();
						var first = (sortField === 'author') ? a.get('author').last_name : a.get('pub_year');
						var second = (sortField === 'author') ? b.get('author').last_name : b.get('pub_year');
						return sortAscDes($('#sort-direction').val(), first, second);
					}
					self.sourceSet.sort();
					self.renderSources();
				});
			}
		});
		return ResourceApp;
	}
);