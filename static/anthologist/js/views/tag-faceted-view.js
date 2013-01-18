define(['backbone',
        'utils/globals'],

	function (Backbone, globals) {
		var globals = globals.getGlobals();
		var TagFacetedView = Backbone.View.extend({
			initialize: function (opts) {
				_.extend(this, opts);
			},
			events: {
				'click': 'addFilter'
			},			
			addFilter: function (ev) {
				if (globals.app.selectionSet.length === 1) {
					alert("No need to filter results: you're only looking at one selection.");
					return;
				}
				var addedFilter = {};
				addedFilter = [this.category, this.model.id];
				globals.app.adjustCurrentQueryObject(addedFilter);
				globals.app.additionalFilters.collection.add(this.model);
				globals.app.additionalFilters.render();
			},
			tagName: 'li',
			className: 'tag-filter',
			render: function () {
				var rootEl = this.$el;
				var mod = this.model;
				var count = mod.get('count');
				var nm;
				if (count) {
					var ctSpan = '<span class="filter-count">(' + count + ')</span>';
				}
				if (mod.get('tag_type_display') === 'author') {
					var lastNm = mod.get('last_name');
					var firstNm = mod.get('first_name');
					nm = lastNm;
					if (firstNm) {
						nm += ', ' + firstNm; 
					}
				} else {
					nm = mod.get('name');
				}
				rootEl.append(nm + '&nbsp;' + ctSpan);
				return this;
			}
		});
		return TagFacetedView;
	}
);