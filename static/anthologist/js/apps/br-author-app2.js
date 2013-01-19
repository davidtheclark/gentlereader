define(['backbone',
        'models/author-set',
        'views/br-author-view',
        'views/pg-select-view',
        'views/bottom-paginator',
        'routers/br-sorting-router',
        'utils/pagination-details',
        'utils/sort-asc-des',
        'utils/globals',
        'utils/loading-loader'],

	function (Backbone, Collection, renderCol, PgSelectView, BottomPaginator, Router, paginationDetails, sortAscDes, globals, loader) {
		var globals = globals.getGlobals();
		var cont = $('#tag-list');
		var BrAuthorApp = Backbone.View.extend({
			itemsPerPage: 20,
			startPage: 'all',
			dataType: 'authors',
			initialize: function () {
				// instantiate the router
				this.router = new Router();
				// make sorters work
				this.setSorters();
				// set sortField and sortDir
				this.setQuery();
				// get collection
				this.getCollection(true);
				// set min-height so bottom paginator doesn't jump around
				cont.css('min-height', 22 * this.itemsPerPage);
			},
			setSorters: function () {
				var self = this;
				$('.sort-select').change(function () {
					self.sortCollection(); 
				});
			},
			setQuery: function () {
				this.sortField = $('#sort-field').val();
				this.sortDir = $('#sort-direction').val();
			},
			getCollection: function () {
				var self = this;
				var col = self.collection = new Collection();
				loader.addLoader();
				col.fetch({
					success: function () {
						/* Calculate page parameters (starting and stopping points.
						 * If there are multiple pages, create pageSelect and
						 * navigate to "all" URL. */
						self.setPages();
						if (self.pgCount > 1) {
							self.resetPg();
						} else {
							self.populatePg('all');
						}
					}
				});
			},
			setPages: function () {
				/* Use utility paginationDetails to calculate page parameters. */
				var pgParams = paginationDetails(this.collection, this.itemsPerPage);
				this.pageDetails = pgParams.startEndMods;
				this.pgCount = pgParams.pgCount;
			},
			resetPg: function () {
				var self = this;
				var url = 'pg/' + self.sortField + '/' + self.sortDir + '/' + self.startPage;
				self.getPageSelect();
				self.router.navigate(url, { replace: true });
				self.populatePg(self.startPage);
				self.bottomPaginator(self.startPage);
			},
			getPageSelect: function () {
				var pView = new PgSelectView({
					pageDetails: this.pageDetails,
					router: this.router,
					dataType: this.dataType,
					startPage: this.startPage,
					sorted: true
				});
			},
			populatePg: function (pg) {
				renderCol({
					collection: this.collection,
					page: pg,
					pageDetails: this.pageDetails,
					container: cont
				});
				loader.removeLoader();
			},
			bottomPaginator: function (pg) {
				/* Removed and re-created whenever the page changes. */
				if (this.bPg) {
					this.bPg.remove();
				}
				this.bPg = new BottomPaginator({
					currentPg: pg,
					pgCount: this.pgCount,
					router: this.router,
					sortField: this.sortField,
					sortDir: this.sortDir
				});
			},
			sortCollection: function () {
				var self = this;
				/* Reset the sorting parameters. */
				self.setQuery();
				cont.fadeOut(function () {
					/* Clear the container; set the collection's comparator
					 * according to the sort-selects; sort the collection;
					 * re-calculate page parameters; and reset the page. */
					cont.off().empty();
					self.collection.comparator = function (a,b) {
						var first = a.get(self.sortField);
						var second = b.get(self.sortField);
						return sortAscDes(self.sortDir, first, second);
					};
					self.collection.sort();
					self.setPages();
					self.resetPg();
				});
			},
		});
		return BrAuthorApp;
	}
);