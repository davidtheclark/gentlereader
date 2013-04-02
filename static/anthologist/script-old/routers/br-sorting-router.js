define(['backbone',
        'utils/globals'],
	
    function (Backbone, globals) {
		var globals = globals.getGlobals();
		var BrSortingRouter = Backbone.Router.extend({
			initialize: function () {
				Backbone.history.start({ silent: true });
			},
			routes: {
				'pg/:sort/:dir/:page': 'fixSelects'
			},
			/* Ensure that the select menus (sorter, director, paginator)
			 * match the displayed URL: they won't if the page changes
			 * without the user changing the select (e.g. through browser back).
			 * Also, because the sorter- and director-selects trigger
			 * an event (jQuery delegation in br-sel-app), they refresh the
			 * selectionSet and revert to page 1. */
			fixSelects: function (sort, dir, pg) {
				this.currentPg = pg;
				var sorter = $('#sort-field');
				var paginator = $('#page-select');
				var director = $('#sort-direction');
				if (sorter.val() != sort) {
					sorter.val(sort).trigger('change');
					return;
				}
				if (director.val() != dir) {
					director.val(dir).trigger('change');
					return;
				}
				if (paginator.val() != pg) {
					paginator.val(pg);
				}
				/* globals.app is the app that calls this router (declared in
				 * ?-main.js) */
				globals.app.populatePg(pg);
				globals.app.bottomPaginator(pg);
			}
		});
		return BrSortingRouter;
	}
);