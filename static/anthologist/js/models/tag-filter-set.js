define(['backbone',
        'utils/ignore-articles'],

	function (Backbone, ignoreArticles) {
		var TagFilterSet = Backbone.Collection.extend({
			/* This comparator will sort first by count (highest to lowest),
			 * second by name (alphabetical) */ 
			comparator: function(model1, model2) {
				var count1 = model1.get('count');
				var count2 = model2.get('count');
				var ln = function (mod) {
					return mod.get('last_name');
				};
				var a = (ln(model1)) ? ln(model1) : model1.get('name');
				var b = (ln(model2)) ? ln(model2) : model2.get('name');
				var name1 = ignoreArticles(a).toLowerCase();
				var name2 = ignoreArticles(b).toLowerCase();
				var difference = count2 - count1;
				if (difference > 0) return 1;
				else if (difference == 0) {
					if (name1 > name2) return 1;
					else if (name1 < name2) return -1; 
				}
				else if (difference < 1) return -1;
			}
		});
		return TagFilterSet;
	}
);