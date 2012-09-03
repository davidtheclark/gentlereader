var SelectionView = Backbone.View.extend({
	tagName: 'section',
	className: 'timeline-sel-item',
	jade: new Jade('/static/anthologist/jade/timeline-selection.jade'),
	render: function () {
		this.$el.append(this.jade.content(this.model.toJSON()));
		var it = ((this.options.index % 2 != 0) ? this.$el.addClass('timeline-sel-even') : this.$el);
		$('#timeline-sel-container').append(it);
		return this
	}
});