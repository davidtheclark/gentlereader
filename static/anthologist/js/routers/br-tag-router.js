define(['backbone',
        'views/br-tag-view',
        'utils/globals'],
	
    function (Backbone, renderTagCol, globals) {
		var globals = globals.getGlobals();
		var BrTagRouter = Backbone.Router.extend({
			initialize: function (opts) {
				_.extend(this, opts);
				Backbone.history.start({ silent: true });
			},
			routes: {
				'pg/:page': 'changeThePage'
			},
			changeThePage: function (pg) {
				/* Check and adjust the pageSelect on top. */
				var paginator = $('#page-select');
				if (paginator.val() != pg) {
					paginator.val(pg);
				}
				/* Bottom paginator is removed and re-created,
				 * so doesn't need checking or adjustment. */
				/* globals.app is the app that calls this router (declared in
				 * br-tag-main.js) */
				globals.app.changePg(pg);
				globals.app.bottomPaginator(pg);
			}
		});
		return BrTagRouter;
	}
);