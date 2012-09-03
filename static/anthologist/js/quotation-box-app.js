$(document).ready(function () {
	var QuotationApplication = Backbone.View.extend({
		initialize: function () {
			this.getQuotation()
		},
		getQuotation: function () {
			this.RandomQuotationSet = rQuotSet = new RandomQuotationSet(null, null);
			rQuotSet.fetch({
				success: function(set, response) {
					rQuotSet.forEach(function (quotation) {
						var quotationView = new QuotationView({ model: quotation });
						quotationView.render();
					});
					$('#quotation-container').fadeIn('fast');
				}
			});
		}
	});
	window.quoteApp = quoteApp = new QuotationApplication();
});