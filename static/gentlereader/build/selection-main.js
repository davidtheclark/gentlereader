define("lib/unfinishedToggler",["jquery"],function(e){var t={};t.methods={init:function(i){var n={diasporic:!1,event:"click",exclusive:!0,allOff:!0,initial:!1,preChange:!1,postChange:!1};return this.each(function(){var r=t.root=e(this),a=e.extend({},n,i);r.data("uft",{settings:a}),a.initial&&t.methods._openInitial();var o=a.event+".uft";r.on(o,".uft-trigger",function(){var i=e(this);t.settings=r.data("uft").settings,t.settings.diasporic?t.methods._diasporic(i,r):t.methods._anasporic(i,r)})})},_openInitial:function(){var e=t.root.find(t.settings.initial);t.settings.diasporic?t.methods._diasporic(e,t.root):e.addClass("uft-on")},_anasporic:function(e,i){var n=i.find(".uft-group"),r=n.has(e);t.methods._change(r,n.not(r))},_diasporic:function(i,n){var r=i.data("uft").split(","),a=[],o=[],s=n.find(".uft-trigger, .uft-a, .uft-b");s.each(function(){var t=e(this),i=t.data("uft").split(",");i[0]===r[0]&&(i[1]===r[1]?a.push(t[0]):o.push(t[0]))}),t.methods._change(i,e(o),e(a))},_change:function(e,i,n){t.settings.preChange&&t.settings.preChange();var r=n?n:e;if(e.hasClass("uft-on"))t.settings.allOff&&r.removeClass("uft-on");else{var a=i.filter(".uft-on");r.addClass("uft-on"),t.settings.exclusive&&a.length>0&&a.removeClass("uft-on")}t.settings.postChange&&t.settings.postChange()}},e.fn.unfinishedToggler=function(i){return t.methods[i]?t.methods[i].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof i&&i?(e.error("Method "+i+" does not exist for jquery.unfinishedToggler."),void 0):t.methods.init.apply(this,arguments)}}),define("apps/selection-app",["jquery","lib/unfinishedToggler"],function(e){return e(function(){var t,i;return e("#relSelAccordion").unfinishedToggler({exclusive:!1}),i=function(){var t,i,n,r;return i=e("#sExtrasAccordion"),t=i.find(".uft-group"),n=i.find(".uft-trigger"),r=!1,t.each(function(){return e(this).hasClass("uft-on")?r=!0:void 0}),r?n.addClass("u-wide"):n.removeClass("u-wide")},e("#sExtrasAccordion").unfinishedToggler({exclusive:!1,postChange:i}),t=function(t){return this.getNew=function(e){return e.next(".u-inactive")},this.showNew=function(t){var i,n,r,a,o;return i=this.getNew(t),n=i.height(),r={opacity:0},a={height:n+"px"},o={opacity:1},i.hasClass("s-highlight--all")&&e(".s-highlight > .s-extras--utils, .s-highlight > .s-extras--title").fadeOut(),t.animate(r,200,function(){return e(".s-highlight--text").animate(a,300,function(){return i.animate(o,200,function(){return t.removeClass("u-active").addClass("u-inactive"),i.removeClass("u-inactive").addClass("u-active")})})})},this.showNew(t)},e(".s-highlight--another").click(function(){var i;return i=e(".s-highlight--li.u-active"),t(i)})})}),require(["jquery","apps/selection-app"],function(){}),define("selection-main",function(){});