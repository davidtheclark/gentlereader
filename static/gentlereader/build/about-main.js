define("lib/unfinishedToggler",["jquery"],function(t){var n={};n.methods={init:function(e){var i={diasporic:!1,event:"click",exclusive:!0,allOff:!0,initial:!1,preChange:!1,postChange:!1};return this.each(function(){var s=n.root=t(this),o=t.extend({},i,e);s.data("uft",{settings:o}),o.initial&&n.methods._openInitial();var a=o.event+".uft";s.on(a,".uft-trigger",function(){var e=t(this);n.settings=s.data("uft").settings,n.settings.diasporic?n.methods._diasporic(e,s):n.methods._anasporic(e,s)})})},_openInitial:function(){var t=n.root.find(n.settings.initial);n.settings.diasporic?n.methods._diasporic(t,n.root):t.addClass("uft-on")},_anasporic:function(t,e){var i=e.find(".uft-group"),s=i.has(t);n.methods._change(s,i.not(s))},_diasporic:function(e,i){var s=e.data("uft").split(","),o=[],a=[],r=i.find(".uft-trigger, .uft-a, .uft-b");r.each(function(){var n=t(this),e=n.data("uft").split(",");e[0]===s[0]&&(e[1]===s[1]?o.push(n[0]):a.push(n[0]))}),n.methods._change(e,t(a),t(o))},_change:function(t,e,i){n.settings.preChange&&n.settings.preChange();var s=i?i:t;if(t.hasClass("uft-on"))n.settings.allOff&&s.removeClass("uft-on");else{var o=e.filter(".uft-on");s.addClass("uft-on"),n.settings.exclusive&&o.length>0&&o.removeClass("uft-on")}n.settings.postChange&&n.settings.postChange()}},t.fn.unfinishedToggler=function(e){return n.methods[e]?n.methods[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e?(t.error("Method "+e+" does not exist for jquery.unfinishedToggler."),void 0):n.methods.init.apply(this,arguments)}}),require(["jquery","apps/rand-quot-app","lib/unfinishedToggler"],function(t,n){return t(function(){return new n,$$("#about").unfinishedToggler({exclusive:!1})})}),define("about-main",function(){});