define(['jquery'], function ($) {
	var run = function () {
		var br = $('#nav-browse');
		var togIt = function () {
			$('#nav-browse-menu').slideToggle(function () {
				$('#nav-browse>a').toggleClass('selected-br');
			});
		};
		var touch = function () {
			if (ev.targetTouches.length == 1) {
				brOff();
			}
		};
		var brOn = function () {
			togIt();
			$('#site-content-container').on('click', function () {
				brOff();
			});
			document.getElementById('site-content-container').addEventListener('touchstart', touch, false);
			$(window).on('scroll', function () {
				brOff();
			});
			br.off().click(function () {
				brOff();
			});
		};
		var brOff = function () {
			togIt();
			br.off().click(function (ev) {
				brOn();
			});
			document.getElementById('site-content-container').removeEventListener('touchstart', touch, false);
			$('#site-content-container').off('click');
			$(window).off('scroll');
		};
		br.click(function (ev) {
			brOn();
		});
	};
	return run;
});