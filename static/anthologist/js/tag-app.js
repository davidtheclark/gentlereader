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

$(document).ready(function () {
	
	var SelectionListApplication = Backbone.View.extend({
		
		/* Keep itemsPerPage an even number, so the View's even/odd distinction works easily. */
		itemsPerPage: 10,
		
		initialize: function (options) {
			/* Set the queryObject to the primary tag, the root query of the page. */
			this.resetQueryObject();
			/* Create the additionalFilters view that will serve for rendering filters and making them function. */
			this.additionalFilters = new FiltersView({ collection: new TagSet() });
			this.getSelections();
		},
		
		resetQueryObject: function () {
			/* app.currentQueryObject should be kept up-to-date with the app's selectionSet. */
			this.currentQueryObject = {};
			/* tagCategory and tagId retrieved from script in tag.jade (from python view).
			 * tagId is in an array because all the other queryObjects work with arrays
			 * (enabling multiple filters per tag type). */
			this.currentQueryObject[tagCategory] = [ tagId ];
		},
		
		/* Called by initialize() and adjustCurrentQueryObject(). */
		getSelections: function () {
			var thisApp = this;
			
			/* app.selectionSet is the complete, sorted selection set based on the queryObject and additionalFilters. */
			this.selectionSet = selSet = new SelectionSet(null, { query: this.currentQueryObject });
			selSet.fetch({
				success: function (set, response) {
					
					/* pageCount = total number of pages; all tags will have one at least 1. */
					thisApp.pageCount = Math.ceil(selSet.length / thisApp.itemsPerPage);
					
					/* If there are multiple pages, render the page-select element and 
					 * route to the first page of selections (which is silent, because trigger
					 * doesn't work at this point), and render first page of selections.
					 * Otherwise, no page-select needed; render all selections. */
					if (thisApp.pageCount > 1) {
						thisApp.routing.navigate('page/1', { trigger: false, replace: true });
						thisApp.setPageLimits(1);
						thisApp.renderPageSelect();
					}
					else {
						thisApp.setAllSelectionsPage();
					}
					
					thisApp.generateUniqueTags();
					thisApp.renderTags();
				}
			})
		},
		
		routing: new selListRouter(), //above

		renderPageSelect: function () {
			var selectPageView = new SelectPageView();
			selectPageView.render();
		},

		/* Called when user chooses a page from the page-select. */
		setPageLimits: function (pgNum) {
			var pgNum = this.currentPgNum = parseInt(pgNum);
			var start = this.currentPgStart = this.itemsPerPage * (pgNum - 1) + 1;
			var endCalc = start + this.itemsPerPage - 1;
			
			/* If calculated end (endCalc) is greater than selectionSet.length, use
			 * selectionSet.length for the currentPgEnd; otherwise, stick with calculated end. */ 
			end = this.currentPgEnd = (endCalc > this.selectionSet.length) ? this.selectionSet.length : endCalc;
			
			/* With new page limits set, render the selections.*/
			this.renderSelections();
			
			/* Create and render the page info and page changers. */
			var pageInfoView = new PageInfoView();
			pageInfoView.render();

		},
		
		setAllSelectionsPage: function () {
			this.currentPgNum = 'all';
			this.currentPgStart = 1;
			this.currentPgEnd = this.selectionSet.length;
			this.renderSelections();
		},
		
		renderSelections: function () {
			$('#sel-container').empty();

			//Create a view for each model and render it.
			var thisApp = this;
			this.selectionSet.forEach(function (selection, index) {
				/* Adjusted index is for (a) semantics (first tag is index = 1 instead of 'all'),
				 * (b) compatibility with app.selectionSet.length, which starts counting at 1. */
				var adjIndex = index + 1;
				if (thisApp.currentPgStart <= adjIndex && adjIndex <= thisApp.currentPgEnd) {
					var selectionView = new SelectionView({
						model: selection,
						index: index //Needed to add shading every other item.
					});
					selectionView.render();
				}
			});
			
			/* Display of #sel-container is set to "none" in CSS. */
			$('#sel-container').fadeIn('fast');
			
			$('#showing-content').append(this.currentPgStart + '-' + this.currentPgEnd + ' (of ' + this.selectionSet.length + ')')
			
			
			if (this.currentPgNum != 'all') {
				$('#sel-container').css('min-height', $('#sel-container').height());
			}

		},
		
		generateUniqueTags: function () {
			var tagApp = this; //For ease of reference.
			_.forEach(tagTypesArray, function (tagType) {
				var uniqueTagTest = [];
				var tagSet = tagApp.selectionSet[tagType] = new TagFacetedFilterSet();
				tagApp.selectionSet.forEach(function (selection) {
					_.forEach(selection.get(tagType), function (tag) {
						
						/* If the tag HAS NOT already shown up (is unique), add it to uniqueTagTest (to prevent duplication),
						 * create a "count" starting at 1, and add it to the selectionSet's relevant tag collection. */
						if (uniqueTagTest.indexOf(tag.id) == -1) {
							uniqueTagTest.push(tag.id);
							_.extend(tag, { count: 1 });
							tagApp.selectionSet[tagType].add(tag);
						}
						
						//If the tag is a duplicate, not unique, just add 1 to the tag's "count".
						else {							
							var tagModel = tagApp.selectionSet[tagType].get(tag.id);
							var curCount = tagModel.get('count');
							tagModel.set('count', curCount + 1);
						}
						
					});
				});
				//Re-sort the Collection once all tags have been added.
				tagSet.sort({ silent: true });
			});
		},
		
		renderTags: function () {
			var tagApp = this; //For ease of reference.
			
			//Ensure that any already-shown [more] and [fewer] buttons are hidden
			$('.more-tags, .fewer-tags').hide();
			
			_.forEach(tagTypesArray, function (tagType) {
				//Find and empty the relevant sidebar list.
				var putHere = '#' + tagType + '-tags';
				$(putHere).empty();
				tagApp.selectionSet[tagType].forEach(function (tag) {
					tagType = tag.get('tag_type_display');
					tagType = (tagType == 'language') ? tagType : tagType + "s";
					
					/* To prevent the primary tag (basis of the page) or any already-filtered tags
					 * from showing up in the sidebar as possible filters: only add the tag-as-filter
					 * if the currentQueryObject does not already contain it. */
					if (!(tagApp.currentQueryObject.hasOwnProperty(tagType) && tagApp.currentQueryObject[tagType].indexOf(tag.id) != -1)) {
						var tagView = new TagView({
							model: tag,
							category: tagType
						});
						$(putHere).append(tagView.render().$el);
					}
					
				});
				tagApp.showTags(tagType, false);
			});
		},
		
		showTags: function (tagType, showAll) {
			var tagApp = this; //For ease of reference.
			var putHere = '#' + tagType + '-tags';
			
			/* If there are more than 7 tags in the list, only show 7,
			 *  then add a [more] button to see the rest. */
			$(putHere + ' li').each(function (index) {
				if (showAll == false) {
					if (index <= 7) {
						$(this).css('display', 'list-item');
					}
					else if (index == 8) {
						$('#show-' + tagType).show();
					}
					else { false; } //Breaks the jQuery .each loop
				}
				else if (showAll == true) {
					$(this).css('display', 'list-item');
				}
			});
		},
		
		adjustCurrentQueryObject: function (additions, removals) { //Run by a new sort or the application of a new filter.
			//Process any added filters.
			if (additions != null) {
				if (this.currentQueryObject.hasOwnProperty(additions[0])) {
					this.currentQueryObject[additions[0]].push(additions[1]);
				} else {
					this.currentQueryObject[additions[0]] = [ additions[1] ];
				}
			}

			//Process any removed filters.
			if (removals != null) {
				var removeMe = this.currentQueryObject[removals[0]].indexOf(removals[1]);
				this.currentQueryObject[removals[0]].splice(removeMe, 1);
			}
			
			//Apply the sort-selects.
			this.currentQueryObject['sort'] = $('#sort-field').val();
			this.currentQueryObject['direction'] = $('#sort-direction').val();
			
			var thisApp = this;
			$('#sel-container').fadeOut('fast', function () {
				$('#page-select-container').undelegate().remove();
				$('#sel-container').empty();
				thisApp.clearPageInfo();
				thisApp.getSelections();
			});
		},
		
		clearPageInfo: function () {
			$('.page-info-container').undelegate();
			$('.page-info-container').remove();
			$('#showing-content').empty();
		}
	});
	
	Backbone.history.start({ silent: true });

	//Create an instance of the application.
	window.app = app = new SelectionListApplication();
	
	//Make sort-selects work.
	$('.sort-select').change(function () {
		app.adjustCurrentQueryObject(); 
	});
	
	//Make [more] buttons work on faceted browse.
	$('.more-tags').click(function (ev) {
		var tagType = $(ev.target).attr('id').substring(5)
		app.showTags(tagType, true);
		// Replace [more] with [fewer] button, to re-hide the >7 tags
		$(ev.target).hide();
		$('#hide-' + tagType).show();
	});
	//Make [fewer] buttons work on faceted browse.
	$('.fewer-tags').click(function (ev) {
		var tagType = $(ev.target).attr('id').substring(5)
		$('#' + tagType + '-tags li').hide();
		$(ev.target).hide();
		app.showTags(tagType, false);
	});

});

