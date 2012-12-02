var selListRouter = Backbone.Router.extend({
	routes: {
		'page/:page': 'pageChange',		
	},
	pageChange: function (page) {
		$('#sel-container').fadeOut('fast', function () {
			$('#sel-container').empty();
			app.clearPageInfo();
			/* Unlike the tag pages, the all-selections page will always display the first page
			 * and the paginator, because of all the space a selection, with its teaser, takes. */
			/* There might be no page count if user browses to a #route from an outside page. */
			if (!(app.pageCount)) { app.setPageLimits(1) }
			else if (page == 'all') { app.setAllSelectionsPage(); }
			else { app.setPageLimits(page); }
			/* If router is called by previous- or next-page browser buttons or a browser-back return,
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
			/* Set the queryObject to the primary tag, the root query of the page, and get selections. */
			this.resetQueryObject();
			this.getSelections();
		},
		
		resetQueryObject: function () {
			/* app.currentQueryObject should be kept up-to-date with the app's selectionSet. */
			this.currentQueryObject = {};
			/* If tagCategory=='undefined', for the All Selections Page, app doesn't need to filter initially or ever. */
			if (typeof(tagCategory) != 'undefined') {
				/* tagCategory and tagId retrieved from script in tag.jade (from python view).
				 * tagId is in an array because all the other queryObjects work with arrays
				 * (enabling multiple filters per tag type). */
				this.currentQueryObject[tagCategory] = [ tagId ];
			}
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
					} else {
						thisApp.setAllSelectionsPage();
					}
					
					/* Create tags & faceted search for Tag Pages (not All Selections Page). */
					if (typeof(tagCategory) != 'undefined') {
						thisApp.generateUniqueTags();
						thisApp.renderTags();
					}
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
				$('#page-select-container').undelegate();
				$('#sel-container, #page-select-container').empty();
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
	
	/* Set min-height for tag-list so page-info doesn't jump up on the last page. */
	$('#sel-container').css('min-height', 170 * app.itemsPerPage);

});

