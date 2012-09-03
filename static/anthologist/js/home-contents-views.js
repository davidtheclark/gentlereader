var SelectionView = Backbone.View.extend({
	className: 'sel-item-container',
	jade: new Jade('/static/anthologist/jade/selection-list-item.jade'),
	render: function () {
		this.$el.append(this.jade.content(this.model.toJSON()));
		var it = ((this.options.index % 2 != 0) ? this.$el.addClass('sel-even') : this.$el);
		$('#list-container').append(it);
		return this
	}
});

var AnnouncementView = Backbone.View.extend({
	className: 'sel-item-container',
	jade: new Jade('/static/anthologist/jade/announcement-list-item.jade'),
	render: function () {
		this.$el.append(this.jade.content(this.model.toJSON()));
		var it = ((this.options.index % 2 != 0) ? this.$el.addClass('sel-even') : this.$el);
		$('#list-container').append(it);
		return this
	}
});