var tagTypesArray = [ 'language', 'nations', 'forms', 'contexts', 'genres', 'topics', 'styles' ];

function incorporateQuery (options) {
	if (options && options.hasOwnProperty('query')) {
		queryParams = [];
		for (param in options.query) {
			queryParams.push(param + '=' + options.query[param]);
		}
		return "?" + queryParams.join("&");
	} else {
		return '';
	}
}

/* Takes a string and returns that string stripped of leading articles (the, an, a)
 * that a good sorter would ignore (putting "the pig" after "pie" instead of "thane") */
function ignoreArticles (string) {
	if (string.match(/^the /)) {
		return string.substring(4);
	}
	else if (string.match(/^an /)) {
		return string.substring(3);
	}
	else if (string.match(/^a /)) {
		return string.substring(2);
	}
	else {
		return string;
	}
}

var Selection = Backbone.Model.extend({
	initialize: function(options) {
		myUrl = this.url();
		if (myUrl.indexOf("?") != -1) {
			this.url = myUrl.split("?")[0] + this.id;
		}
	}
});

var SelectionSet = Backbone.Collection.extend({
	url: '/anthologist/api/selections/',	
	model: Selection,
	initialize: function(models, options) {
		this.url += incorporateQuery(options);
		 //Add attributes to house the tags for each of these selections.
		var self = this;
		_.forEach(tagTypesArray, function (tagType) {
			self[tagType] = new TagSet();
		});
	}
});

var RandomQuotationSet = Backbone.Collection.extend({
	url: '/anthologist/api/quotations/random'
});

var SourceSet = Backbone.Collection.extend({
	url: '/anthologist/api/sources/',
	initialize: function(models, options) {
		this.url += incorporateQuery(options);
	}
});

var AuthorSet = Backbone.Collection.extend({
	url: '/anthologist/api/authors/',
	initialize: function (models, options) {
		this.url += incorporateQuery(options);
	}
});

var TagSet = Backbone.Collection.extend({
	comparator: function (item) {
		return ignoreArticles(item.get('name')).toLowerCase(); // ignoreArticles() defined above.
	}
});

var TagFacetedFilterSet = Backbone.Collection.extend({
	/* This comparator will sort first by count (highest to lowest),
	 * second by name (alphabetical) */ 
	comparator: function(model1, model2) {
		var count1 = model1.get('count');
		var count2 = model2.get('count');
		var name1 = ignoreArticles(model1.get('name')).toLowerCase(); // ignoreArticles() defined above.
		var name2 = ignoreArticles(model2.get('name')).toLowerCase();
		var difference = count2 - count1;
		
		if (difference > 0) return 1;
		else if (difference == 0) {
			if (name1 > name2) return 1;
			else if (name1 < name2) return -1; 
		}
		else if (difference < 1) return -1;
	}
})

var RecentContentSet = Backbone.Collection.extend({
	url: '/anthologist/api/recent',
	initialize: function(models, options) {
		if (options && options.hasOwnProperty('restriction')) {
			this.url += '/' + options['restriction'];
		}
	}
});