define(['jquery'], function ($) {
	var addLoader = function () {
		var el = '<div id="ajax-loading">&lowast;&lowast;&lowast; LOADING &lowast;&lowast;&lowast;</div>';
		$('#wrapper').append(el);
		$('#ajax-loading').fadeIn();
	};
	var removeLoader = function () {
		$('#ajax-loading').fadeOut(function () {
			$('#ajax-loading').remove();
		});
	};
	return {
		addLoader: addLoader,
		removeLoader: removeLoader
	};
});