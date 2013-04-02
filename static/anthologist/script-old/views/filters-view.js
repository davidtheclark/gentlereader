define(['backbone',
        'utils/globals'],
	
	function (Backbone, globals) {
		var globals = globals.getGlobals();
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
						var type = tag.get('tag_type_display');
						if (categories.indexOf(type) == -1) {
							categories.push(type);
							$('<ul />').html(type)
								.attr('id', 'category-' + tag.get('tag_type'))
								.addClass('remove-filter-list')
								.appendTo(content);
						}
						var category = (type === 'language') ? 'language' : (type === 'author') ? 'author' : type + 's';
						var name = (tag.get('last_name')) ? tag.get('last_name') : tag.get('name');
						$('<li />').html(name + ' <span class="remove-tag-x">X</span>')
							.attr({
								'id': category + '-' + tag.id,
								'data-id': tag.id,
								'data-type': category
							}).addClass('remove-filter')
							.appendTo($('#category-' + tag.get('tag_type')));
					});
					$('<span />').html('[clear all filters]')
						.attr('id', 'clear-filters')
						.appendTo(content);
					rootEl.show();
				} else {
					rootEl.hide();
				}
				return this
			},
	
			removeFilter: function (ev) {
				/* Use the filter's id to generate an array of [ category (string), tag id (integer) ] */
				var tar = $(ev.currentTarget)
				var tagId = tar.attr('data-id');
				var tagType = tar.attr('data-type');
				this.collection.remove(this.collection.get(tagId));
				/* Render FiltersView, minus the removed filter */
				this.render();
				/* Re-create the selection set, adjusting the queryObject */
				globals.app.adjustCurrentQueryObject(null, [ tagType, tagId ]);
			},
			
			clearAllFilters: function () {
				this.collection.reset(); //Empties app.additionalFilters.collection.
				this.render(); //Re-renders the view, producing emptiness where fulness once was.
				$('#sel-container').fadeOut('medium', function () {
					globals.app.resetQueryObject(); //Reset the selection-list.
					globals.app.adjustCurrentQueryObject();
				});
			}		
		});
		return FiltersView;
	}
);