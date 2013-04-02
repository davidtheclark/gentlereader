/* Creates a select menu whose displayed options reflect the selectionSet's models and
 * the current sort values.
 * Must be called with the following options:
 *   - pageDetails: an array of objects with information about where each
 *   page starts and ends, formatted thus
 *   [ { startIndex: value1, startMod: model1, endIndex: value2, endMod: model2 }, ... ]
 *   - sortField (optional): a field to sort by (date_entered, author, or pub_year)
 *   (without this, the model's "name" will be displayed by default)
 *   - router: a router used to navigate to new pages
 *   - container (optional): if the container's id is other than "page-select-container"
 *   - dataType: what is being paginated (e.g. selection, genre, author)
 *   - startPage: which page should be initially selected (should be "all" or 1)? */

define(['backbone'],
        
	function (Backbone) {
		var PgSelectView = Backbone.View.extend({
			
			initialize: function (opts) {
				_.extend(this, opts);
				this.render();
			},
			getModDisplay: function (mod) {
				/* From each relevant model, get the proper value
				 * to display in the pageSelect. Relies on the
				 * option "dataType" passed when the View is instantiated. */
				var self = this;
				/* pageSelects for selection-lists can show date_entered,
				 * author last name, or pub_year; for author-lists will show
				 * last_name; for tags will show name. */
				if (self.dataType === 'selections') {
					switch(self.sortField) {
					case 'date_entered':
						return mod.get('date_entered_simple');
						break;
					case 'author':
						return mod.get('source').author.last_name.toUpperCase();
						break;
					case 'pub_year':
						return mod.get('source').date_display;
						break;
					}
				} else if (self.dataType === 'authors') {
					return mod.get('last_name').toUpperCase();
				} else {
					return mod.get('name').toUpperCase();
				}
			},
			events: {
				'change': 'changePage'
			},
			changePage: function () {
				var self = this;
				if (self.router) {
					var page = $('#page-select').val();
					/* The "sorted" option is passed as "true" (on instantiation
					 * of the View) if the data can be sorted (not tags, which are
					 * always in ascending alphabetical order). */
					if (self.sorted) {
						var sorter = $("#sort-field").val();
						var director = $('#sort-direction').val();
						var url = 'pg/' + sorter + '/' + director + '/' + page;
						self.router.navigate(url, { trigger: true });
					} else {
						self.router.navigate('pg/' + page, { trigger: true });
					}
				} else { console.log('No router found.'); }
			},
			render: function () {
				var self = this;
				var dets = self.pageDetails
				if (dets) {
					/* If no "container" option is passed on instantiation,
					 * default to #page-select-container. */
					var container = self.container || $('#page-select-container');
					var pgCount = dets.length;
					var itemCount = dets[dets.length - 1].endIndex + 1
					container.off().empty();
					self.$el.append('<label for="page-select" class="adjustor-section-label">select page : </label>');
					var select = document.createElement('select');
					$(select).attr('id', 'page-select');
					var html = '<option value="all">show all ' + itemCount + ' ' + self.dataType + '</option>';
					for (i = 0; i < pgCount; i++) {
						var start = self.getModDisplay(dets[i].startMod);
						var end = self.getModDisplay(dets[i].endMod);
						html += '<option value=' + (i + 1);
						if (self.startPage === 1 && i === 0) {
							html += ' selected';
						}
						var fill = (start != end) ? start + ' to ' + end : start;
						html += '>' + (i + 1) + '. ' + fill + '</option>';
					}
					$(select).html(html);
					self.$el.append(select);
					container.append(self.el);
				} else { console.log('No pageDetails found.'); }
				return this;
			}
		});
		return PgSelectView;
	}
);