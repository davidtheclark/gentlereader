function displayButtons() {
	function makeItHappen(cssObj) {
		$('#content-body').fadeOut('fast', function () {
			$('#content-body').css(cssObj);
		})
		$('#content-body').fadeIn('fast');
	}
	$('#width-select').change(function () {
		makeItHappen({ 'max-width': Number($('#width-select').val()) });
	});
	$('#size-select').change(function () {
		makeItHappen({ 'font-size': $('#size-select').val() });
	});
	$('#font-select').change(function () {
		makeItHappen({ 'font-family': $('#font-select').val() });
	});
	$('#align-select').change(function () {
		makeItHappen({ 'text-align': $('#align-select').val() });
	});
}

function toggleSidebar(cssObj) {
	$('#sidebar, .sidebar-toggle').toggle();
	$('#main').animate(cssObj, 'slow');
}

$(function () {
	
	/* Hyphenator doesn't seem to work in Opera (breaks up words but doesn't
	 * add the necessary hyphen). */
	if ($.browser.opera) {
		$('#content-body').removeClass('hyphenate');
	}
	
	//make display buttons work
	displayButtons();

	//toggle the sidebar
	$('#close-sidebar').click(function () {
		toggleSidebar ({ 'float': 'none', 'width': '100%' });
	});
	$('#open-sidebar').click(function () {
		toggleSidebar({ 'float': 'left', 'width': '75%' });
	});
	
});