define(['backbone',
        'apps/rand-quot-app',
        'models/tag-set',
        'models/tag-filter-set',
        'views/filters-view',
        'models/sel-set',
        'utils/pagination-details',
        'utils/globals',
        'utils/loading-loader',
        'utils/sort-asc-des',
        'views/sel-view',
        'views/pg-select-view',
        'views/tag-faceted-view',
        'views/bottom-paginator',
        'routers/br-sorting-router',
        'utils/ajax-error'],

	function (Backbone, RandQuotApp, TagSet, TagFilterSet, FiltersView, SelectionSet, paginationDetails, globals, loader, sortAscDes, renderSelCol, PgSelectView, TagFacetedView, BottomPaginator, Router, ajaxError) {
		var tagTypesArray = [ 'author', 'language', 'nations', 'forms', 'contexts', 'genres', 'topics', 'styles' ];
		var globals = globals.getGlobals();
		var cont;
		var TagApp = Backbone.View.extend({
			// Keep itemPerPage even, so alternate shading works.
			itemsPerPage: 10,
			startPage: 1,
			dataType: 'selections',
			initialize: function () {
				var self = this;
				self.router = new Router();
				$(document).ready(function () {
					cont = $('#sel-container');
					self.setSorters();
					self.setQuery();
					self.setMoreAndLess();
					self.resetQueryObject();
					self.additionalFilters = globals.additionalFilters = new FiltersView({ collection: new TagSet() });
					self.getSelections(true);
				});
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
				var self = this;
				/* app.currentQueryObject should be kept up-to-date with the app's collection. */
				self.currentQueryObject = {
					// display set to 'closure' to provide all tag information
					display: 'closure',
					sort: self.sortField,
					direction: self.sortDir
				};
				/* tagCategory and tagId retrieved from script in tag.jade (from python view).
				 * tagId is in an array because the categories of the queryObject require arrays
				 * (enabling multiple filters per tag type). */
				this.currentQueryObject[tagCategory] = [ tagId ];
			},
			getSelections: function (onInitialize) {
				/* This function is called by initialize() -- in which case onInitialize = true --
				 * and adjustCurrentQueryObject(). */
				var self = this;
				/* If we are coming from a one-selection-set to a many-selection-set,
				 * populatePg must know.*/
				self.oldSetVal = (self.collection) ? self.collection.length : null;
				var selSet = self.collection = new SelectionSet(null, { query: self.currentQueryObject });
				loader.addLoader();
				selSet.fetch({
					error: ajaxError,
					success: function (set, response) {
						if (set.length > 1) {
							/* If there is more than one selection, show the
							 * adjustor container and sorters. */
							$('#adjustor-container, #sort-container').show();
						} else if (set.length <= 1 && !onInitialize) {
							/* In case this is called by a filter (not initialize), and now there's only
							 * one selection -- nothing to sort -- hide the sorters. */
							$('#sort-container').hide();
						}
						self.initiatePopulation(onInitialize);
					}
				});
			},
			initiatePopulation: function (onInitialize) {
				var self = this;
				var url = 'pg/' + self.sortField + '/' + self.sortDir + '/' + self.startPage;
				var navOpts = {}
				if (onInitialize) {
					/* If this is the collection created on initialize, 
					 * set "replace" to true to avoid logging the unfragmented page
					 * (/selections/) in history; so, once we navigate to
					 * "/selection/#pg/.../1", if the user presses the browser's back
					 * she will not go back to "/selections/" before returning to whatever
					 * page she actually wanted. */
					navOpts['replace'] = true;
				}
				self.router.navigate(url, navOpts);
				/* Calculate page parameters (starting and stopping points).
				 * If there are multiple pages, create pageSelect and
				 * navigate to startPage. If there's only one page, set
				 * URL to "all". */
				self.setPages();
				if (self.pgCount > 1) {
					self.resetPg();
				} else {
					self.populatePg('all');
					self.bottomPaginator();
				}
			},
			setPages: function () {
				var pageParameters = paginationDetails(this.collection, this.itemsPerPage);
				this.pageDetails = globals.pageDetails = pageParameters.startEndMods;
				this.pgCount = pageParameters.pgCount;
			},
			resetPg: function () {
				var self = this;
				var url = 'pg/' + self.sortField + '/' + self.sortDir + '/' + self.startPage;
				self.router.navigate(url, { replace: true });
				self.getPageSelect();
				self.bottomPaginator(self.startPage);
				self.populatePg(self.startPage);
			},
			getPageSelect: function () {
				/* Get and show the page-select. */
				this.pView = new PgSelectView({
					pageDetails: globals.pageDetails,
					router: this.router,
					sorted: true,
					sortField: this.sortField,
					sortDir: this.sortDir,
					dataType: this.dataType,
					startPage: this.startPage
				});
				$('#page-select-container').show();
			},
			bottomPaginator: function (pg) {
				/* Removed and re-created whenever the page changes. */
				if (this.bPg) {
					this.bPg.remove();
				}
				if (this.pgCount > 1) {
					this.bPg = new BottomPaginator({
						currentPg: pg,
						pgCount: this.pgCount,
						router: this.router,
						sortField: this.sortField,
						sortDir: this.sortDir
					});
				}
			},
			populatePg: function (pg) {
				var self = this;
				renderSelCol({
					collection: self.collection,
					page: pg,
					container: cont,
					pageDetails: self.pageDetails
				});
				/* Get and render the tag-filters. */
				if (self.collection.length > 1) {
					if (self.oldSetVal === 1) {
						self.fromOneToMany();
					}
					self.generateUniqueTags();
					self.renderTags();
				} else {
					if (self.oldSetVal != 1) {
						self.onlyOneSelection();
					}
				}
				/* Remove the loader: its work is finished. */
				loader.removeLoader();
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
						var getField = function (mod, field) {
							switch (field) {
							case 'date_entered':
								return mod.get('date_entered_microdata');
								break;
							case 'author':
								return mod.get('source').author.last_name.toUpperCase();
								break;
							case 'pub_year':
								return mod.get('source').pub_year;
								break;
							}
						};
						var first = getField(a, self.sortField);
						var second = getField(b, self.sortField);
						return sortAscDes(self.sortDir, first, second);
					};
					self.collection.sort();
					self.initiatePopulation();
				});
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
				/* This function creates for each tagType an attribute of the collection.
				 * These tagType attributes are populated with an array of models,
				 * containing every tag relevant to the collection
				 * (referred to by one or more selections).
				 * In these arrays, tags are not duplicated, but are attributed
				 * with a "count" for how many selections refer to them.
				 * These attributes of the collection are then used by renderTags().*/
				var self = this;
				_.forEach(tagTypesArray, function (tagType) {
					var uniqueTagTest = [];
					var tagSet = self.collection[tagType] = new TagFilterSet();
					self.collection.forEach(function (s) {
						var mods = (tagType == 'author') ? [s.get('source').author] : s.get(tagType);
						_.forEach(mods, function (tag) {
							if (uniqueTagTest.indexOf(tag.id) == -1) {
								/* If the tag HAS NOT already shown up (is unique),
								 * add it to uniqueTagTest (to prevent duplication),
								 * create a "count" starting at 1,
								 * and add it to the collection's relevant tag collection. */
								uniqueTagTest.push(tag.id);
								_.extend(tag, { count: 1 });
								self.collection[tagType].add(tag);
							} else {
								/* If the tag is a duplicate, not unique,
								 * just add 1 to the tag's existing "count" in
								 * collection.[this tag type].[this tag]. */
								var tagModel = self.collection[tagType].get(tag.id);
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
					 * then use the collection's attributes (created by generateUniqueTags())
					 * to create and render a View for each tag-filter. */
					var existingList = $('#' + tagType + '-tags');
					existingList.off().empty();
					var ct = 0;
					self.collection[tagType].forEach(function (tag) {
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
			onlyOneSelection: function () {
				/* Called if the collection (whether initially or after filtering)
				 * only contains one selection. Filters are
				 * hidden from the sidebar, replaced with a short message and a random
				 * highlight. */
				$('.related-tag-superlist').fadeOut('fast');
				$('<div />').insertAfter('.instructions')
					.attr('id', 'only-one-warning')
					.html("There's only one selection showing; so no need for filters.");
				$('#sidebar-contribute').css('border-bottom', '1px solid white');
				$('<div />').insertAfter('#sidebar-contribute')
					.attr('id', 'quotation-container');
				RandQuotApp();
			},
			fromOneToMany: function () {
				/* Called if the collection was filtered down to one selection
				 * (calling onlyOneSelection) and then the filters were cleared.
				 * Filters are shown in the sidebar and the elements added by
				 * onlyOneSelection are removed. */
				$('.related-tag-superlist').fadeIn('fast');
				$('#only-one-warning, #quotation-container').remove();
				$('#sidebar-contribute').css('border-bottom', 'none');
			},
		});
		return TagApp;
	}
);