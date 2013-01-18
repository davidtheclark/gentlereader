define(['backbone',
        'models/tag-set',
        'models/tag-filter-set',
        'views/filters-view',
        'models/sel-set',
        'utils/pagination-details',
        'utils/globals',
        'views/sel-view',
        'views/pg-select-view',
        'views/tag-faceted-view',
        'views/bottom-paginator',
        'routers/br-sorting-router'],

	function (Backbone, TagSet, TagFilterSet, FiltersView, SelectionSet, paginationDetails, globals, renderSelCol, PgSelectView, TagFacetedView, BottomPaginator, Router) {
		var tagTypesArray = [ 'author', 'language', 'nations', 'forms', 'contexts', 'genres', 'topics', 'styles' ];
		var globals = globals.getGlobals();
		var cont = $('#sel-container');
		var TagApp = Backbone.View.extend({
			// Keep itemPerPage even, so alternate shading works.
			itemsPerPage: 10,
			initialize: function () {
				this.router = new Router();
				this.setSorters();
				this.setMoreAndLess();
				this.resetQueryObject();
				this.additionalFilters = globals.additionalFilters = new FiltersView({ collection: new TagSet() });
				this.getSelections(true);
			},
			setSorters: function () {
				var self = this;
				$('.sort-select').change(function () {
					self.adjustCurrentQueryObject(); 
				});
			},
			setMoreAndLess: function () {
				/* Make the "more" and "less" buttons in the faceted filters work. */
				var self = this;
				$('.more-tags').click(function (ev) {
					var tagType = $(ev.target).attr('id').substring(5)
					// run showTags() with "true" for showAll parameter
					self.showTags(tagType, true);
					// hide the [more] button and show [fewer]
					$(ev.target).hide();
					$('#hide-' + tagType).show();
				});
				$('.fewer-tags').click(function (ev) {
					var tagType = $(ev.target).attr('id').substring(5)
					$('#' + tagType + '-tags li').hide();
					// hide the [fewer] button: showTags() will show the [more]
					$(ev.target).hide();
					self.showTags(tagType, false);
				});
			},
			resetQueryObject: function () {
				/* app.currentQueryObject should be kept up-to-date with the app's selectionSet. */
				this.currentQueryObject = {
					// display set to 'closure' to provide all tag information
					display: 'closure',
					sort: $('#sort-field').val(),
					direction: $('#sort-direction').val()
				};
				/* tagCategory and tagId retrieved from script in tag.jade (from python view).
				 * tagId is in an array because the categories of the queryObject require arrays
				 * (enabling multiple filters per tag type). */
				this.currentQueryObject[tagCategory] = [ tagId ];
			},
			getSelections: function (onInitialize) {
				/* This fucntion is called by initialize() and adjustCurrentQueryObject(). */
				var self = this;
				/* app.selectionSet is the complete, sorted selection set based
				 * on the queryObject. */
				var selSet = self.selectionSet = new SelectionSet(null, { query: self.currentQueryObject });
				selSet.fetch({
					success: function (set, response) {
						/* If there is more than one selection, show the
						 * adjustor container and sorters. */
						if (set.length > 1) {
							$('#adjustor-container, #sort-container').show();
						} else if (set.length <= 1 && !onInitialize) {
							/* In case this is called by a filter (not initialize), and now there's only
							 * one selection -- nothing to sort -- hide the sorters. */
							$('#sort-container').hide();
						}
						// get page parameters
						self.setPages();
						/* If there are multiple pages, setup pageSelect then
						 * navigate to the first page's url,
						 * manually populate the first page of selections,
						 * and create the bottom paginator.
						 * If there's only one page, populate all selections. */
						if (self.pgCount > 1) {
							self.getPageSelect();
							var url = 'pg/' + self.currentQueryObject.sort + '/'
								+ self.currentQueryObject.direction + '/1';
							var navOpts = {}
							if (onInitialize) {
								/* If this is the selectionSet created on initialize, 
								 * set "replace" to true to avoid logging the unfragmented page
								 * (/selections/) in history; so, once we navigate to
								 * "/selection/#pg/.../1", if the user presses the browser's back
								 * she will not go back to "/selections/" before returning to whatever
								 * page she actually wanted. */
								navOpts['replace'] = true;
							}
							self.router.navigate(url, navOpts);
							self.populatePg(1);
							
						} else {
							self.populatePg('all');
						}
					}
				})
			},
			setPages: function () {
				var pageParameters = paginationDetails(this.selectionSet, this.itemsPerPage);
				this.pageDetails = globals.pageDetails = pageParameters.startEndMods;
				this.pgCount = pageParameters.pgCount;
			},
			populatePg: function (pg) {
				var self = this;
				renderSelCol({
					collection: this.selectionSet,
					page: pg,
					container: $('#sel-container'),
					pageDetails: self.pageDetails
				});
				/* If results are paginated, created the bottom paginator.
				 * If not, remove any existing bottom paginator. */
				if (pg != 'all') {
					self.bottomPaginator(pg);
				} else {
					if (self.bPg) {
						self.bPg.remove();
					}
				}
				/* Get and render the tag-filters. */
				self.generateUniqueTags();
				self.renderTags();
			},
			getPageSelect: function () {
				/* Get and show the page-select. */
				this.pView = new PgSelectView({
					pageDetails: globals.pageDetails,
					sortField: this.currentQueryObject.sort,
					router: this.router,
					sorted: true,
					dataType: 'selections',
					startPage: 1
				});
				$('#page-select-container').show();
			},
			adjustCurrentQueryObject: function (additions, removals) {
				/* Run by a new sort or the application of a new filter. */
				var self = this;
				var co = self.currentQueryObject
				// process added filters
				if (additions != null) {
					if (co.hasOwnProperty(additions[0])) {
						co[additions[0]].push(additions[1]);
					} else {
						co[additions[0]] = [ additions[1] ];
					}
				}
				// process removed filters
				if (removals != null) {
					var removeMe = co[removals[0]].indexOf(removals[1]);
					co[removals[0]].splice(removeMe, 1);
				}
				// apply the sort-selects
				co['sort'] = $('#sort-field').val();
				co['direction'] = $('#sort-direction').val();
				/* If a page-select already exists, remove it, because
				 * this adjustment will require the creation of a new one. */
				if (self.pView) {
					self.pView.remove();
				}
				self.getSelections();
			},
			generateUniqueTags: function () {
				/* This function creates for each tagType an attribute of the selectionSet.
				 * These tagType attributes are populated with an array of models,
				 * containing every tag relevant to the selectionSet
				 * (referred to by one or more selections).
				 * In these arrays, tags are not duplicated, but are attributed
				 * with a "count" for how many selections refer to them.
				 * These attributes of the selectionSet are then used by renderTags().*/
				var self = this;
				_.forEach(tagTypesArray, function (tagType) {
					var uniqueTagTest = [];
					var tagSet = self.selectionSet[tagType] = new TagFilterSet();
					self.selectionSet.forEach(function (s) {
						var mods = (tagType == 'author') ? [s.get('source').author] : s.get(tagType);
						_.forEach(mods, function (tag) {
							if (uniqueTagTest.indexOf(tag.id) == -1) {
								/* If the tag HAS NOT already shown up (is unique),
								 * add it to uniqueTagTest (to prevent duplication),
								 * create a "count" starting at 1,
								 * and add it to the selectionSet's relevant tag collection. */
								uniqueTagTest.push(tag.id);
								_.extend(tag, { count: 1 });
								self.selectionSet[tagType].add(tag);
							} else {
								/* If the tag is a duplicate, not unique,
								 * just add 1 to the tag's existing "count" in
								 * selectionSet.[this tag type].[this tag]. */
								var tagModel = self.selectionSet[tagType].get(tag.id);
								tagModel.set('count', tagModel.get('count') + 1);
							}
						});
					});
					/* Re-sort the tag-filter-set (according to its comparator)
					 * once all tags have been added. */
					tagSet.sort({ silent: true });
				});
			},		
			renderTags: function () {
				var self = this;
				var co = self.currentQueryObject;
				// ensure that any already-shown [more] and [fewer] buttons are hidden
				$('.more-tags, .fewer-tags, .filter-type').hide();
				_.forEach(tagTypesArray, function (tagType) {
					/* For every tagType, find and purge the relevant sidebar filter-list.
					 * then use the selectionSet's attributes (created by generateUniqueTags())
					 * to create and render a View for each tag-filter. */
					var existingList = $('#' + tagType + '-tags');
					existingList.off().empty();
					var ct = 0;
					self.selectionSet[tagType].forEach(function (tag) {
						/* To prevent the primary tag (basis of the page) or any already-filtered tag
						 * from showing up in the sidebar as possible filters, only add the tag-filter
						 * if the currentQueryObject does not already contain it. */
						if (!(co.hasOwnProperty(tagType) && co[tagType].indexOf(tag.id) != -1)) {
							var tagView = new TagFacetedView({
								model: tag,
								category: tagType,
								adjustCO: self.adjustCurrentQueryObject
							});
							existingList.append(tagView.render().$el);
							ct++;
						}
					});
					/* All tag-filters are initially hidden; so run
					 * showTags to display the first 7 and, if needed,
					 * the [more] button. */
					if (ct >= 1) {
						self.showTags(tagType, false);
					}
				});
			},
			showTags: function (tagType, showAll) {
				/* "showAll" is a boolean value indicating whether
				 * every tag-filter should be shown (because this function
				 * was called by someone clicking [more]) or only the first
				 * 7 should be shown (standard). */
				var self = this;
				/* #[tagType]-tags will be the id of the relevant <ul>
				 * in the sidebar. */
				var putHere = '#' + tagType + '-tags';
				$(putHere + ' li').each(function (index) {
					if (showAll === false) {
						/* If there are more than 7 tags in the list, only show 7,
						 *  then show [more] button. */
						if (index <= 7) {
							$(this).css('display', 'list-item');
						}
						else if (index == 8) {
							$('#show-' + tagType).show();
						}
						else { false; } //Breaks the jQuery .each loop
					}
					else if (showAll === true) {
						$(this).css('display', 'list-item');
					}
				});
				$('.filter-type[data-type="' + tagType + '"]').show();
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
					sortField: this.currentQueryObject.sort,
					sortDir: this.currentQueryObject.direction
				});
			}
		});
		return TagApp;
	}
);