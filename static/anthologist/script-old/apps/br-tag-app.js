define(['backbone',
        'routers/br-tag-router',
        'models/tag-set',
        'views/br-tag-view',
        'utils/pagination-details',
        'views/pg-select-view',
        'views/bottom-paginator',
        'utils/globals',
        'utils/loading-loader',
        'utils/ajax-error'],

	function (Backbone, BrTagRouter, TagSet, renderTagCol, paginationDetails, PgSelectView, BottomPaginator, globals, loader, ajaxError) {
		var globals = globals.getGlobals();
		var cont = $('#tag-list');
		var BrTagApp = Backbone.View.extend({
			itemsPerPage: 20,
			// Variable "tagType" created in script in browse.jade
			dataType: tagType,
			initialize: function () {
				this.getTags();
				this.accessDescriptions();
				cont.css('min-height', 21 * this.itemsPerPage);
			},
			/* TagSet only created once, on initialize, because no sorting
			 * will refresh the set with a new API call. */
			getTags: function () {
				var self = this;
				var tSet = self.tagSet = new TagSet();
				// Variable "tagType" created in script in browse.jade
				tSet.url = '/api/' + self.dataType;
				loader.addLoader();
				tSet.fetch({
					error: ajaxError,
					success: function () {
						/* First, populate all tags, since initial view is "all";
						 * then, figure out pages, and if there's more than one
						 * page, created a router and a pageSelect and navigate to
						 * the "all" fragment. */
						self.changePg('all');
						self.setPages();
						if (self.pgCount > 1) {
							self.router = new BrTagRouter({
								tagSet: self.tagSet,
								pageDetails: self.pageDetails
							}),
							self.bottomPaginator('all');
							self.getPageSelect();
							/* "Replace" is true so this initial navigation is not
							 * logged in browser history; if user pushes browser's back,
							 * she will not have to click through the initial unfragmented
							 * page. */
							self.router.navigate('pg/all', { replace: true });
						}				
					}
				});
			},
			changePg: function (pg) {
				renderTagCol({
					collection: this.tagSet,
					page: pg,
					pageDetails: this.pageDetails,
					container: cont
				});
				loader.removeLoader();
			},
			setPages: function () {
				var pgParams = paginationDetails(this.tagSet, this.itemsPerPage);
				this.pageDetails = pgParams.startEndMods;
				this.pgCount = pgParams.pgCount;
			},
			bottomPaginator: function (pg) {
				/* Removed and re-created whenever the page changes. */
				if (this.bPg) {
					this.bPg.remove();
				}
				this.bPg = new BottomPaginator({
					currentPg: pg,
					pgCount: this.pgCount,
					router: this.router
				});
			},
			getPageSelect: function () {
				var pView = new PgSelectView({
					pageDetails: this.pageDetails,
					router: this.router,
					dataType: tagType,
					startPage: 'all'
				});
			},
			accessDescriptions: function () {
				/* Make tag description available. */
				$('#get-description').click(function () {
					$('#category-description').fadeToggle('fast');
				});
			}
		});
		return BrTagApp;
	}
);