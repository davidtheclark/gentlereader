define(['backbone',
        'templates/selListItem',
        'templates/annListItem'],
	
	function (Backbone, selTempl, annTempl) {
		var SelectionView = Backbone.View.extend({
			initialize: function () {
				this.render();
			},
			className: 'sel-item-container',
			render: function () {
				this.$el.append(selTempl(this.model.toJSON()));
				var it = ((this.options.index % 2 != 0) ? this.$el.addClass('sel-even') : this.$el);
				$('#list-container').append(it);
				return this;
			}
		});
		var AnnouncementView = Backbone.View.extend({
			initialize: function () {
				this.render();
			},
			className: 'sel-item-container',
			render: function () {
				this.$el.append(annTempl(this.model.toJSON()));
				var it = ((this.options.index % 2 != 0) ? this.$el.addClass('sel-even') : this.$el);
				$('#list-container').append(it);
				return this;
			}
		});
		return {
			Sel: SelectionView,
			Ann: AnnouncementView
		}
	}
);