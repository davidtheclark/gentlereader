/* Each item in the selection list gets its own view */
var SelectionView = Backbone.View.extend({
	className: 'sel-item-container',
	jade: new Jade('/static/anthologist/jade/selection-list-item.jade'),
	render: function () {
		this.$el.append(this.jade.content(this.model.toJSON()));
		var it = (((this.options.index) % 2 != 0) ? this.$el.addClass('sel-even') : this.$el);
		$('#sel-container').append(it);
		return this
	}
});

var SelectPageView = Backbone.View.extend({
	
	tagName: 'select',
	id: 'page-select',
	
	/* Called to set the format for those items rendered in page-select's options. */
	getLimitItem: function (item) {
		var limitItem;
		var limitField = $('#sort-field').val();
		if (limitField == 'author') {
			limitItem = item.get('source').author.last_name.toUpperCase();
		}
		else if (limitField == 'pub_year') {
			var year = item.get('source').pub_year;
			limitItem = (year < 0) ? -year + ' BCE' : year;
		}
		else if (limitField == 'date_entered') {
			limitItem = item.get('date_entered_microdata').substring(0, 9);
		}
		return limitItem;
	},
	
	render: function () {
		var thisView = this;
		var container = $('#page-select-container');
		container.append('<label for="page-select">select page : </label>')
		
		/* For every one of the pages, create an option whose text is "FIRST TAG to LAST TAG" 
		 * and value is the page number. */
		for (i = 1; i <= app.pageCount; i++) {
			/* When i = 1, we're dealing with the pg. 1's contents. */
			
			// Set start and end index values, with first item = 1.
			var start = app.itemsPerPage * (i - 1) + 1;
			/* If we're on the last page-worth of tags, the last tag will be the final
			 * tag in the set, not the end of a calculated page-length. */
			var end = (i == app.pageCount) ? app.selectionSet.length : start + app.itemsPerPage - 1;
			
			// Get and format the first and last items, which will make the text of the option element.
			var firstItem, lastItem;
			app.selectionSet.forEach(function(tag, index) {
				var adjIndex = index + 1;
				if (adjIndex == start) { firstItem = thisView.getLimitItem(tag); }
				if (adjIndex == end) { lastItem = thisView.getLimitItem(tag); }
			});
			var range = (firstItem != lastItem) ? firstItem + ' to ' + lastItem : firstItem;
			this.$el.append('<option value="' + i + '">' + i + '. ' + range + '</option>');
		}
		this.$el.append('<option value="all">see all ' + app.selectionSet.length + ' selections at once</option>');
		container.append(this.el);
	},
	
	/* Make pageSelect change the pages */
	events: {
		'change': 'changePgSelect'
	},
	changePgSelect: function () {
		var toPage = $('#page-select').val();
		/* The router will run app.setPageLimits. */
		app.routing.navigate('page/' + toPage, { trigger: true });
	}
	
});

var PageInfoView = Backbone.View.extend({ //from browse-views.js
	className: 'page-info-container',
	jade: new Jade('/static/anthologist/jade/browse-page-info.jade'),
	render: function () {
		var templateVars = {
			pgNum: app.currentPgNum,
			pageCount: app.pageCount,
			pageStart: app.currentPgStart,
			pageEnd: app.currentPgEnd,
			setLength: app.selectionSet.length,
			tagType: 'selections',
		}
		this.$el.append(this.jade.content(templateVars));
		$('#adjustor-container, #main-content').append(this.el);;
	},
	
	/* Make page changers work. */
	events: {
		'click .page-changer': 'pgChanger'
	},
	pgChanger: function (ev) {
		var clicked = $(ev.currentTarget);
		var currentPage = app.currentPgNum;
		var newPage = (clicked.is('.prev-page')) ? currentPage - 1 : (clicked.is('.next-page')) ? currentPage + 1 : 'all';
		/* This will trigger the router with the new page, which changes the page-select
		 * and runs app.setPageLimits. */
		app.routing.navigate('page/' + newPage, { trigger: true });
	}
});