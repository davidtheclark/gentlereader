define(['backbone',
		'templates/sourceListItem'],

	function (Backbone, template) {
		var SourceView = Backbone.View.extend({
			template: template,
			render: function () {
				this.$el.append(this.template(this.model.toJSON()));
				$('#source-list').append(this.$el);			
				return this;
			}
		});
		return SourceView;
	}
);