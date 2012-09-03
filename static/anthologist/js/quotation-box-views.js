var QuotationView = Backbone.View.extend({

	el: '#quotation-container',
	
	jade: new Jade('/static/anthologist/jade/quotation-box.jade'),
	
	render: function () {
		this.$el.html(this.jade.content(this.model.toJSON()));
		return this
	},
	
	events: {
		'click .another-specimen': 'changeSpecimen'
	},
	
	changeSpecimen: function () {
		var newQuotationSet = new RandomQuotationSet(null, null);
		newQuotationSet.fetch({
			success: function(set, response) {
				$('#quotation-container').fadeOut('fast', function () {
					$('#quotation-container').empty();
					quoteApp.getQuotation();
				});
			}
		});
	}
});