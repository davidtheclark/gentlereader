require.config({paths:{jade:'/static/anthologist/js/libraries/jade-runtime'},shim:{jade:{exports:'jade'}}});
define(['jade'],function(jade){
function selListItem(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
buf.push('\n<section class="sel-item">\n  <h2 class="sel-title"><a');
buf.push(attrs({ 'href':("/selections/" + (slug) + "") }, {"href":true}));
buf.push('>');
var __val__ = title
buf.push(null == __val__ ? "" : __val__);
buf.push('</a></h2>\n  <div class="sel-info"><a');
buf.push(attrs({ 'href':("/authors/" + (source.author.slug) + "") }, {"href":true}));
buf.push('>');
var __val__ = source.author.full_name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>. ');
if ( excerpt)
{
buf.push('From ' + ((interp = source_display) == null ? '' : interp) + '. ');
}
else if ( source.volume_title)
{
buf.push('From ' + ((interp = source.root_work) == null ? '' : interp) + '. ');
}
buf.push('<a');
buf.push(attrs({ 'href':("/timeline/#" + (source.pub_year) + "") }, {"href":true}));
buf.push('>');
var __val__ = source.date_display
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>. <span class="posted-date">(Posted:\n      <time');
buf.push(attrs({ 'datetime':("" + (date_entered_microdata) + "") }, {"datetime":true}));
buf.push('>');
var __val__ = date_entered
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</time>)</span>\n  </div>\n  <div class="sel-teaser"><span itemprop="description" class="sel-teaser-text hyphenate">');
var __val__ = teaser
buf.push(null == __val__ ? "" : __val__);
buf.push('</span><a');
buf.push(attrs({ 'href':("/selections/" + (slug) + ""), "class": ('read-rest') }, {"href":true}));
buf.push('>&nbsp;&lowast;&lowast;&lowast;&nbsp;read&nbsp;on&nbsp;&raquo;</a></div>\n</section>');
}
return buf.join("");
}return selListItem});