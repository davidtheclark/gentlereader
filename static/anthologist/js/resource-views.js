var SourceView = Backbone.View.extend({
	jade: new Jade('/static/anthologist/jade/source-list-item.jade'),
	render: function () {
		this.$el.append(this.jade.content(this.model.toJSON()));
		$('#source-list').append(this.$el);			
		return this
	}
});