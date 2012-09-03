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
	
	id: 'page-select-container',
	className: 'adjustor-subcontainer',
	
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
		/* Tag Pages use the class and id on this label. */
		var viewContent = '<label for="page-select" id ="page-label" class="adjustor-section-label">select page : </label>';
		viewContent += '<div class="adjustor-section-content"><select id="page-select">';
		
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
			viewContent += '<option value="' + i + '">' + i + '. ' + range + '</option>';
		}

		viewContent += '<option value="all">see all ' + app.selectionSet.length + ' selections at once</option></select>';
		this.$el.append(viewContent);
		$('#filter-container').after(this.$el);
	},
	
	/* Make pageSelect change the pages */
	events: {
		'change #page-select': 'changePgSelect'
	},
	changePgSelect: function () {
		var toPage = $('#page-select').val();
		/* The router will run app.setPageLimits. */
		app.routing.navigate('page/' + toPage, { trigger: true });
	}
	
});

var PageInfoView = Backbone.View.extend({
	className: 'page-info-container',
	render: function () {
		var viewContent;
		if (app.currentPgNum > 1) {
			this.$el.append('<span class="page-changer prev-page">&lt;&lt; prev</span>');
		}
		if (app.currentPgNum > 1 && app.currentPgNum < app.pageCount) {
			this.$el.append(' &#124; ');
		}
		if (app.currentPgNum < app.pageCount) {
			this.$el.append('<span class="page-changer next-page">next &gt;&gt</span>');
		}
		$('#adjustor-container, #sel-container').append(this.$el);
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

/* Each tag in the faceted-search sidebar gets its own view */
var TagView = Backbone.View.extend({
	events: {
		'click': 'addFilter'
	},
	
	initialize: function (options) {
		if (options.hasOwnProperty('category')) {
			this.category = options.category;
		}
	},
	
	addFilter: function (ev) {
		var addedFilter = {};
		addedFilter = [this.category, this.model.id];
		window.app.adjustCurrentQueryObject(addedFilter);
		window.app.additionalFilters.collection.add(this.model);
		window.app.additionalFilters.render();
	},
	
	tagName: 'li',
	className: 'tag-filter',
	render: function () {
		var rootEl = this.$el;
		rootEl.attr('itemprop', 'itemListElement');
		var count = '<span class="filter-count">(' + this.model.get('count') + ')</span>';
		rootEl.append(this.model.get('name') + ' ' + count);
		return this
	}
});

/* One view for ALL the filters that have been applied */
var FiltersView = Backbone.View.extend({
	el: '#filter-container',
	
	events: {
		'click .remove-filter': 'removeFilter',
		'click #clear-filters': 'clearAllFilters'
	},
	
	render: function() {
		var rootEl = this.$el;
		rootEl.empty();
		if (this.collection.models.length != 0) {
			$('<div />').html('filters :')
				.attr('id', 'filter-label')
				.addClass('adjustor-section-label')
				.appendTo(rootEl);
			var content = $('<div />').addClass('adjustor-section-content')
				.appendTo(rootEl);
			var categories = [];
			this.collection.forEach(function(tag) {
				if (categories.indexOf(tag.get('tag_type_display')) == -1) {
					categories.push(tag.get('tag_type_display'));
					$('<ul />').html(tag.get('tag_type_display'))
						.attr('id', 'category-' + tag.get('tag_type'))
						.addClass('remove-filter-list')
						.appendTo(content);
				}
				var category = tag.get('tag_type_display') == 'language' ? 'language' : tag.get('tag_type_display') + 's';
				$('<li />').html(tag.get('name') + ' <span class="remove-tag-x">X</span>')
					.attr('id', category + '-' + tag.id)
					.addClass('remove-filter')
					.appendTo($('#category-' + tag.get('tag_type')));
			});
			$('<div />').html('[clear filters]')
				.attr('id', 'clear-filters')
				.appendTo(content);
		}
		return this
	},

	removeFilter: function (ev) {
		
		/* Use the filter's id to generate an array of [ category (string), tag id (integer) ] */
		var bits = $(ev.currentTarget).attr('id').split('-'); 
		var tagId = parseInt(bits[1]);
		this.collection.remove(this.collection.get(tagId));
		
		/* Render FiltersView, minus the removed filter */
		this.render();
		
		/* Re-create the selection set, adjusting the queryObject */
		app.adjustCurrentQueryObject(null, [ bits[0], tagId ]);
	},
	
	clearAllFilters: function () {
		this.collection.reset(); //Empties app.additionalFilters.collection.
		this.render(); //Re-renders the view, producing emptiness where fulness once was.
		$('#sel-container').fadeOut('medium', function () {
			app.resetQueryObject(); //Reset the selection-list.
			app.adjustCurrentQueryObject();
		});
	}
	
});
