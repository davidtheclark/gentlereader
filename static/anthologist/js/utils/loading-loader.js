define(['jquery'], function ($) {
	var addLoader = function (container, relative) {
		var c = container || $('#wrapper');
		var el = '<div id="ajax-loading">&lowast;&lowast;&lowast; LOADING &lowast;&lowast;&lowast;</div>';
		c.append(el);
		var d = $('#ajax-loading');
		if (relative === true) {
			d.css({
				'position': 'absolute',
				'top': '100px'
			});
		}
		d.fadeIn();
	};
	var removeLoader = function () {
		var d = $('#ajax-loading');
		d.fadeOut(function () {
			d.remove();
		});
	};
	return {
		addLoader: addLoader,
		removeLoader: removeLoader
	};
});