define(['backbone',
        'models/author-set',
        'views/br-quot-auth-view',
        'routers/br-quot-router',
        'templates/brQuotQuot',
        'templates/brQuotInitial',
        'utils/sort-asc-des',
        'utils/ajax-error'],
        
	function(Backbone, AuthorSet, AuthColView, Router, brQuotQuotTempl, brQuotInitialTempl, sortAscDes, ajaxError) {		
		var qList = $('#quotation-list-container');
		var aCont = $('#author-container');
		var shower = $('#browse-all');
		var hider = $('#hide-authors');
		var QuotApp = Backbone.View.extend({
			initialize: function (options) {
				this.router = new Router();
				this.getAuthors();
				this.setSorters();
				this.setShowHideAuthors();
			},
			getAuthors: function () {
				/* Only called once, on load; and this function, on success,
				 * initiates the fetching of the highlights */
				var self = this;
				var aSet = self.authorSet = new AuthorSet();
				aSet.fetch({
					error: ajaxError,
					success: function () {
						self.renderAuthors();
						if (Backbone.history.fragment) {
							self.initialRouting();
						} else {
							self.noRouting();
						}
					}
				});
			},
			renderAuthors: function () {
				this.authorsView = new AuthColView({ collection: this.authorSet });
				this.setRandomizers('.auth-sidebar-random');
			},
			initialRouting: function () {
				/* If there is a url fragment, route right away to get quotations. */
				this.getQuotations(Backbone.history.fragment.substr(7));
			},
			noRouting: function () {
				this.showAuthors();
				this.getRandom();
			},
			getRandom: function () {
				var self = this;
				var quantity = 3
				var sets = {
					dataType: 'json',
					url: '/api/quotations/random?quantity=' + quantity,
					error: ajaxError,
					success: function (data) {
						self.renderRandom(data);
					}
				}
				$.ajax(sets);
			},
			renderRandom: function (data) {
				var self = this;
				var header = '<h2>a few at random</h2>'
					+ '<div id="more-random">&#8635; more random highlights</div>';
				$('#quotation-header').html(header);
				var templ = brQuotInitialTempl(data);
				$('#quotation-list').html(templ);
				self.setRandomizers('#more-random');
			},
			setRandomizers: function (randomizer) {
				var self = this;
				$(randomizer).click(function () {
					self.getRandom();
				});
			},
			setSorters: function () {
				/* Make the author-sorters work. */
				var self = this;
				$('.sort-select').change(function () {
					self.sortAuthors();
				});
			},
			sortAuthors: function () {
				/* Set the authorSet's comparator, sort, and re-render. */
				var field = $('#sort-field').val();
				var dir = $('#sort-direction').val();
				this.authorSet.comparator = function (a, b) {
					var first = a.get(field);
					var second = b.get(field);
					return sortAscDes(dir, first, second);
				}
				this.authorSet.sort();
				this.renderAuthors();
			},
			getQuotations: function (id) {
				/* Simple AJAX request for quotations, since they will not
				 * be manipulated, so don't need Backbone models. */
				var self = this;
				var sets = {
					dataType: 'json',
					url: '/api/authors/' + id + '/quotations',
					error: ajaxError,
					success: function (data) {
						self.renderQuotations(data);
					}
				};
				$.ajax(sets);
				$('.selected-author').removeClass('selected-author');
				$('.author-list-item[data-auth="' + id + '"]').addClass('selected-author');
			},
			renderQuotations: function (data) {
				/* Populate the #quotation-header, then use a
				 * template to populate the quotations themselves. */
				var header = '<h2><span class="header-from">from </span>'
					+ '<a href="/authors/' + data.author.slug + '">'
					+ data.author.full_name + '</a>';
				$('#quotation-header').html(header);
				var templ = brQuotQuotTempl(data);
				$('#quotation-list').html(templ);
				this.setSelCollapsers();
			},
			setShowHideAuthors: function () {
				/* Make all the show/hide-authors buttons work. */
				var self = this;
				shower.click(function () {
					self.showAuthors();
				});
				$('#hide-authors, #close-authors').click(function () {
					self.hideAuthors();
				});
			},
			showAuthors: function () {
				shower.fadeToggle('fast', function () {
					qList.css({
						'margin-left': '260px',
						'font-size': '0.9em'
					});
					aCont.fadeIn('fast');
					hider.fadeToggle('fast');
				});
			},
			hideAuthors: function () {
				aCont.fadeOut('fast', function () {
					hider.fadeToggle('fast', function () {
						qList.css({
							'margin-left': '20px',
							'font-size': '1em'
						});
						shower.fadeToggle('fast');
					});
				});
			},
			setSelCollapsers: function () {
				$('.hide-sel-quotes, .show-quotations').click(function (ev) {
					var tar = $(ev.target);
					var selId = tar.attr('data-sel');
					var selQuots = $('.quotation-list[data-sel=' + selId + ']');
					var toFade;
					tar.fadeOut('fast');
					if (tar.hasClass('hide-sel-quotes')) {
						toFade = $('.show-quotations[data-sel=' + selId + ']');
					} else if (tar.hasClass('show-quotations')) {
						toFade = $('.hide-sel-quotes[data-sel=' + selId + ']');
					}
					toFade.fadeIn('fast');
					selQuots.slideToggle({easing: 'linear'});
				});
			}
		});
		return QuotApp;
	}
);