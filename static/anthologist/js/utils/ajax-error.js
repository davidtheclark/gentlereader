define(['jquery'], function ($) {
	var apologize = function () {
		var c = $('<div />').appendTo('#wrapper')
			.attr('id', 'ajax-error-container');
		var text = '<span id="ajax-error-heading">Sadly,</span><p>the server betrayed you '
			+ 'and failed to satisfy your request. Please reload the page, and everything '
			+ 'should turn out okay.</p>';
		var d = $('<div />').appendTo('#wrapper')
			.attr('id', 'ajax-error-message')
			.html(text);
		var e = $('<div />').appendTo(d)
			.attr('id', 'ajax-error-reload')
			.html('reload')
			.click(function () {
				location.reload(forceGet=true);
			});
	};
	return apologize;
});