define(['backbone',
        'templates/brQuotAuth'],
        
	function(Backbone, brQuotAuth) {
		var cont = $('#author-list');
		var AuthModView = Backbone.View.extend({
			tagName: 'li',
			template: brQuotAuth,
			className: 'author-list-item',
			render: function () {
				this.$el.attr('data-auth', this.model.get('id'));
				this.$el.append(this.template(this.model.toJSON()));
				cont.append(this.el);
				return this
			}
		});
		var AuthColView = Backbone.View.extend({
			initialize: function () {
				this.render();
			},
			render: function () {
				var self = this;
				cont.fadeOut('fast', function () {
					/* Clear any existing author list. */
					cont.undelegate()
						.empty();
					/* Create and render a view for each author model. */
					self.collection.forEach(function(a) {
						var aView = new AuthModView({ model: a });
						aView.render();
					});
				}).fadeIn('fast');
				return this;
			}
		});
		return AuthColView;
	}
);