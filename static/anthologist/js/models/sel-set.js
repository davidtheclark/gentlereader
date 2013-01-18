define(['backbone',
        'utils/tag-types-array',
        'utils/incorporate-query',
        'models/tag-set'],
		
	function (Backbone, tagTypesArray, incorporateQuery, TagSet) {
			
		var Sel = Backbone.Model.extend({
			initialize: function(options) {
				myUrl = this.url();
				if (myUrl.indexOf("?") != -1) {
					this.url = myUrl.split("?")[0] + this.id;
				}
			}
		});
	
		var SelSet = Backbone.Collection.extend({
			url: '/api/selections/',	
			model: Sel,
			initialize: function (models, options) {
				this.url += incorporateQuery(options);
				 //Add attributes to house the tags for each of these selections.
				var self = this;
				_.forEach(tagTypesArray, function (tagType) {
					self[tagType] = new TagSet();
				});
			}
		});
		
		return SelSet;
	}
);