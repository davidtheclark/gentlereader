define(['backbone',
        'views/br-tag-view'],
	
    function (Backbone, renderTagCol) {
		var selListRouter = Backbone.Router.extend({
			routes: {
				'page/:page': 'pageChange',		
			},
			pageChange: function (page) {
				$('#sel-container').fadeOut('fast', function () {
					$('#sel-container').empty();
					app.clearPageInfo();
					/* There might be no page count if user browses to a #route from an outside page. */
					if (!(app.pageCount)) { app.setPageLimits(1) }
					else if (page == 'all') { app.setAllSelectionsPage(); }
					else { app.setPageLimits(page); }
					/* If router is called by previous- or next-page buttons or a browser-back return,
					 * page-select has to be changed to match the page shown. */
					if ($('#page-select').val() != page) { $('#page-select').val(page); }
				});
			},
		});
		return TagRouter;
	}
);