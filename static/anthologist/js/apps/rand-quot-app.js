define(['jquery',
        'utils/ajax-error'],
        
    function ($, ajaxError) {
		
		var container;

		var app = function (cont) {
			$(document).ready(function () {
				container = cont || $('#quotation-container');
				layout();
				enableNew();
				getQuot();
			});
		};
		
		/* Loads (a) the DOM structure of the random quotation box,
		 * (b) the "another-specimen" links that are assigned
		 * their function once only (with enableNew()) and are not
		 * emptied when a new quotation is fetched, (c) the div-element
		 * that is emptied and re-populated with a new quotation. */
		var layout = function (q) {
			var content = '<h2 class="another-specimen">random highlight</h2>'
				+ '<div class="quotation-box-quotation"></div>'
				+ '<div class="quotation-box-citation"></div>'
				+ '<div class="quotation-box-followup">'
				+ '<span id="read-quotation-sel"></span><br />'
				+ '<span class="another-specimen">&#8635; see another highlight</span>'
				+ '</div>';
			container.append(content);
		};
		
		/* Makes "another-specimen" elements get a new quotation.
		 * This delegation only happens once, on initialize. */
		var enableNew = function () {
			$('.another-specimen').click(function () {
				container.fadeOut('fast', function () {
					getQuot();
				});
			});
		};
		
		/* Perform the AJAX request to get a random quotation.
		 * On success, populate the quotation in the random quotation box. */
		var getQuot = function () {
			var options = {
				url: '/api/quotations/random',
				cache: false,
				error: ajaxError,
				success: function (result) {
					popQuot(result);
				}
			}
			$.ajax(options);
		};
		
		/* When a new quotation is fetched, empty then populate
		 * the relevant parts of the random quotation box. */
		var popQuot = function (q) {
			var quot = q.quotation;
			var sel = q.selection;
			var text, citation, followup;
			/* Populate text. */
			text = '<a href="/highlights/' + quot.id + '">'
				+ unescape(quot.quotation) + '</a>';
			$('.quotation-box-quotation').empty()
				.append(text);
			/* Populate citation. */
			citation = '<a href="/selections/' + sel.slug + '">&#8212; '
				+ '"' + sel.title + '"';
			if (sel.title.charAt(sel.title.length - 1) != '?') {
				citation += ',';
			}
			citation += ' ' + sel.author
				+ '&nbsp;(' + sel.pub_year + ')</a>';
			$('.quotation-box-citation').empty()
				.append(citation);
			/* Populate followup. */
			followup = '<a href="/selections/' + sel.slug
				+ '">read this selection &raquo;</a>';
			$('#read-quotation-sel').empty()
				.append(followup)
			/* Fade-in the now re-populated container. */
			container.fadeIn('fast', function () {
				$('#sidebar').css('min-height', $('#sidebar').height());
			});
		};
		
		return app;		
	}
);