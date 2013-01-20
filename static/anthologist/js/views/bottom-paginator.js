/* This paginator is re-created whenever the page is changed. */

define(['backbone'],
		
	function (Backbone) {
		/* When instantiated, options should include
		 * 1. pgCount
		 * 2. currentPg
		 * 3. container (or we default to #bottom-pg-container)
		 * 4. router (relevant to the app that instantiates this View) */
		var BottomPaginator = Backbone.View.extend({
			initialize: function (opts) {
				_.extend(this, opts);
				this.render();
			},
			template: function (cp, count, cont) {
				/* cp = current page
				 * count = total page count
				 * cont = container */
				var botPgs = $('<div />').attr('id', 'bot-pgs')
					.appendTo(cont);
				for (var i = 0; i < count; i++) {
					var thisPg = i + 1;
					var pgSpan = $('<span />').attr('data-pg', thisPg)
						.addClass('bot-pg')
						.html(thisPg)
						.appendTo(botPgs);
					if (thisPg === parseInt(cp)) {
						$(pgSpan).addClass('bot-pg-selected');
					}
				}
				var allSpan = $('<span />').attr('data-pg', 'all')
					.addClass('bot-pg')
					.html('all')
					.appendTo(botPgs);
				if (cp === 'all') {
					$(allSpan).addClass('bot-pg-selected');
				}
				var changers = $('<div />').attr('id', 'bot-pg-changers')
					.appendTo(cont);
				/* If current page is 'all', 'next' and 'prev' don't make sense;
				 * if we're on the first page, 'prev' doesn't;
				 * if we're on the last page, 'next' doesn't. */
				if (cp != 'all') {
					if (cp > 1 && cp <= count) {
						var prevPg = parseInt(cp) - 1;
						var prev = $('<span />').attr('data-pg', prevPg)
							.addClass('bot-pg-chg')
							.html('&laquo; prev')
							.appendTo(changers);
					}
					if (cp < count) {
						var nextPg = parseInt(cp) + 1;
						var next = $('<span />').attr('data-pg', nextPg)
							.addClass('bot-pg-chg')
							.html('next &raquo;')
							.appendTo(changers);
					}
				}
			},
			events: {
				'click span': 'selectPg'
			},
			selectPg: function (ev) {
				var goTo = ev.target.getAttribute('data-pg');
				var url = (this.sortField) ? 'pg/' + this.sortField + '/' + this.sortDir + '/' + goTo : 'pg/' + goTo;
				this.router.navigate(url, { trigger: true });
				// scroll to the top of the page, to avoid weird lurches and awkward unintentional positioning
				$("html, body").animate({ scrollTop: 0 });
			},
			render: function () {
				var cont = this.container || $('#bottom-pg-container');
				this.template(this.currentPg, this.pgCount, this.el);
				cont.append(this.el);
				return this;
			}
		});
		return BottomPaginator;
	}
);