var browseRouter = Backbone.Router.extend({
	routes: {
		'page/:page': 'pageChange',
		
		/* This occurs when a user changes pages, triggering a #route,
		 * then uses the browser's back. */
		'': 'restart'
		
	},
	pageChange: function (page) {
		$('#tag-list').fadeOut('fast', function () {
			$('#tag-list').empty();
			app.clearPageInfo();
			/* If #page is 'all' (because we got here by clicking a [show all] page-changers,
			 * or #page is outside of pageCount (don't know why this would happen,
			 * but playing it safe), or pageCount doesn't exist (which happens when I backtrack
			 * to a #page from an external page), then get all tags; otherwise, set limits. */
			if (page == 'all' || page > app.pageCount || !(app.pageCount)) { app.setAllTagsPage(); }
			else { app.setPageLimits(page); }
			
			/* If router is called by [previous] or [next] buttons,
			 * page-select has to be changed to match the page shown. */
			if ($('#page-select').val() != page) { $('#page-select').val(page); }
		});
	},
	restart: function () {
		$('#tag-list').fadeOut('fast', function () {
			$('#tag-list').empty();
			app.clearPageInfo();
			app.setAllTagsPage();
			$('#page-select').val('all');
		});
	}
});

$(function () {
	var BrowseTagApplication = Backbone.View.extend({
		
		itemsPerPage: 20,
		
		initialize: function () {
			/* If this is running, user has JavaScript enabled, so the template-generated list should
			 * be destroyed in favor of the AJAX list. */
			$('#tag-list').empty();
			
			/* If the user has returned to a #route with the browser's back, set fragment to 'all'.*/ 
			if (Backbone.history.fragment) {
				this.routing.navigate('page/all', { trigger: false });
			}
			
			var thisApp = this;
			/* Only the Author Page has sorting, so only it needs a queryObject. */
			if (tagType == 'authors') { this.currentQueryObject = {}; }
			this.getTags();
		},
		
		/* Only called by initialize(). */
		getTags: function () {
			var thisApp = this;
			
			/* Author Page requires sortability; Non-Author Pages require a dynamic url. */
			if (tagType == 'authors') {
				thisApp.tagSet = new AuthorSet(null, { query: thisApp.currentQueryObject });
			}
			else {
				thisApp.tagSet = new TagSet();
				thisApp.tagSet.url = '/anthologist/api/' + tagType;
			}
			
			/* After fetch, get page count, set limits, then renderTags(). */
			thisApp.tagSet.fetch({
				success: function () { 
					/* pageCount = total number of pages; all tags will have one at least 1. */
					thisApp.pageCount = Math.ceil(thisApp.tagSet.length / thisApp.itemsPerPage);
					/* If there are multiple pages, set router to #all (which will then fun
					 * setAllTagsPage()) and render the page-select element. */
					if (thisApp.pageCount > 1) {
						thisApp.renderPageSelect();
					}
					/* Otherwise, don't start router, just initially populate the full tag list
					 * (setAllTagsPage() will set app attributes then run renderTags()). */
					thisApp.setAllTagsPage();
				}
			});
		},
		
		routing: new browseRouter(), //above
		
		renderPageSelect: function () {
			var selectPageView = new SelectPageView();
			selectPageView.render();
		},
		
		/* currentPgNum, currentPgStart, and currentPgEnd should always correspond
		 * with what is visible to the user. */
		
		/* Called when user chooses a page from the page-select. */
		setPageLimits: function (pgNum) {
			var pgNum = this.currentPgNum = parseInt(pgNum);
			var start = this.currentPgStart = this.itemsPerPage * (pgNum - 1) + 1;
			var endCalc = start + this.itemsPerPage - 1;
			/* If calculated end (endCalc) is greater than tagSet.length, use
			 * tagSet.length for the currentPgEnd; otherwise, stick with calculated end. */ 
			end = this.currentPgEnd = (endCalc > this.tagSet.length) ? this.tagSet.length : endCalc;
			
			/* With new page limits set, render the tags.*/
			this.renderTags();
			
			/* Create and render the page info and page changers. */
			var pageInfoView = new PageInfoView();
			pageInfoView.render();
		},
		
		setAllTagsPage: function () {
			this.currentPgNum = 'all';
			this.currentPgStart = 1;
			this.currentPgEnd = this.tagSet.length;
			this.renderTags();
		},
		
		renderTags: function () {
			var thisApp = this;
			/* For every tag within the page limits, render a TagItemView. */
			this.tagSet.forEach(function(tag, index) {
				/* Adjusted index is for (a) semantics (first tag is index = 1 instead of 'all'),
				 * (b) compatibility with app.tagSet.length, which starts counting at 1. */
				var adjIndex = index + 1;
				if (thisApp.currentPgStart <= adjIndex && adjIndex <= thisApp.currentPgEnd) {
					var tagView = new TagItemView({ model: tag }); 
					tagView.render();
				}
			});
			/* #tag-list set to "display: none" in CSS (browse.less). Once its filled, fade in.*/
			$('#tag-list').fadeIn('fast');
			
		},
	
		/* Called when user changes sorting on Author Page. */
		sortAuthorList: function () {
			var thisApp = this;
			/* Reset currentQueryObject based on sort-selects. */
			this.currentQueryObject = {
				sort: $('#sort-field').val(),
				direction: $('#sort-direction').val()
			};
			/* Fade out, empty, re-populate. */
			$('#tag-list').fadeOut('fast', function () {
				$('#page-select').undelegate();
				$('#tag-list, #page-select-container').empty();
				thisApp.clearPageInfo();
				thisApp.getTags();
				thisApp.routing.navigate('page/all', { trigger: true });
			});
		},
		
		clearPageInfo: function () {
			$('.page-info-container').undelegate();
			$('.page-info-container').remove();
		}
		
	});

	Backbone.history.start({ silent: true });

	/* Create an instance of the BrowseTagApplication. */
	window.app = app = new BrowseTagApplication();
	
	
	/* Make Author Page sorters work. */
	if (tagType == 'authors') {
		$('.sort-select').change(function () { app.sortAuthorList(); });
	}
	
	$('#get-description').click(function () {
		$('#category-description').fadeToggle('fast');
	});
	
	/* Set min-height for tag-list so page-info doesn't jump up on the last page. */
	$('#tag-list').css('min-height', 21 * app.itemsPerPage);

});