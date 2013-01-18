require.config({paths:{jade:'/static/anthologist/js/libraries/jade-runtime'},shim:{jade:{exports:'jade'}}});
define(['jade'],function(jade){
function annListItem(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
buf.push('\n<section class="sel-item">\n  <header>\n    <h2 class="sel-title"><a');
buf.push(attrs({ 'href':("/announcements/" + (slug) + "") }, {"href":true}));
buf.push('>');
var __val__ = title
buf.push(null == __val__ ? "" : __val__);
buf.push('</a></h2>\n    <div class="announcement-label-container"><span class="announcement-label">announcement :&nbsp;</span>\n      <time');
buf.push(attrs({ 'datetime':("" + (date_entered_microdata) + ""), "class": ('sel-info') }, {"datetime":true}));
buf.push('>');
var __val__ = date_entered
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</time>\n    </div>\n  </header>\n  <div class="sel-teaser teaser-text"><span>');
var __val__ = teaser
buf.push(null == __val__ ? "" : __val__);
buf.push('</span><a');
buf.push(attrs({ 'href':("/announcements/" + (slug) + ""), "class": ('read-rest') }, {"href":true}));
buf.push('>&nbsp;&lowast;&lowast;&lowast;&nbsp;read&nbsp;on&nbsp;&raquo;</a></div>\n</section>');
}
return buf.join("");
}return annListItem});