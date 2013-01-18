define(['backbone',
        'utils/ignore-articles'],
		
	function (Backbone, ignoreArticles) {
		var TagSet = Backbone.Collection.extend({
			comparator: function (item) {
				var nm = (item.get('last_name')) ? item.get('last_name') : item.get('name');
				return ignoreArticles(nm.toLowerCase());
			}
		});
		return TagSet;
	}
);