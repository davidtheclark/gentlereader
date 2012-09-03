var TagItemView = Backbone.View.extend({
	tagName: 'a',
	jade: new Jade('/static/anthologist/jade/browse-item.jade'),
	render: function () {
		var mod = this.model;
		/* Set the link's target. */
		this.$el.attr('href', '/anthologist/' + mod.get('tag_type_display') + 's/' + mod.get('slug') )
		/* Call the jade template and append. */
		this.$el.append(this.jade.content(mod.toJSON()));
		$('#tag-list').append(this.el);
		return this
	}
});

var SelectPageView = Backbone.View.extend({
	
	tagName: 'select',
	id: 'page-select',
	
	/* Called to set the format for those items rendered in page-select's options. */
	getLimitItem: function (tag) {
		var limitItem;
		var limitField = (tagType == 'authors') ? $('#sort-field').val() : 'name';
		if (limitField == 'last_name' || limitField == 'name') {
			limitItem = tag.get(limitField).toUpperCase();
		}
		else { // If limitItem is a birth year (when Author Page is sorted by birth year).
			var year = tag.get(limitField);
			limitItem = (year < 0) ? -year + ' BCE' : year;
		}
		return limitItem;
	},
	
	render: function () {
		var thisView = this;
		var container = $('#page-select-container');
		container.append('<label for="page-select">select page : </label>')
		this.$el.append('<option value="all">see all ' + app.tagSet.length + ' ' + tagType + ' at once</option>');
		
		/* For every one of the pages, create an option whose text is "FIRST TAG to LAST TAG" 
		 * and value is the page number. */
		for (i = 1; i <= app.pageCount; i++) {
			/* When i = 1, we're dealing with the pg. 1's contents. */
			
			// Set start and end index values, with first item = 1.
			var start = app.itemsPerPage * (i - 1) + 1;
			/* If we're on the last page-worth of tags, the last tag will be the final
			 * tag in the set, not the end of a calculated page-length. */
			var end = (i == app.pageCount) ? app.tagSet.length : start + app.itemsPerPage - 1;
			
			// Get and format the first and last items, which will make the text of the option element.
			var firstItem, lastItem;
			app.tagSet.forEach(function(tag, index) {
				var adjIndex = index + 1;
				if (adjIndex == start) { firstItem = thisView.getLimitItem(tag); }
				if (adjIndex == end) { lastItem = thisView.getLimitItem(tag); }
			});
			var range = (firstItem != lastItem) ? firstItem + ' to ' + lastItem : firstItem;
			this.$el.append('<option value="' + i + '">' + i + '. ' + range + '</option>');
		}
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

var PageInfoView = Backbone.View.extend({
	className: 'page-info-container',
	jade: new Jade('/static/anthologist/jade/browse-page-info.jade'),
	render: function () {
		var templateVars = {
			pgNum: app.currentPgNum,
			pageCount: app.pageCount,
			pageStart: app.currentPgStart,
			pageEnd: app.currentPgEnd,
			setLength: app.tagSet.length,
			tagType: tagType,
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