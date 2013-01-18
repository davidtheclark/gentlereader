require.config({paths:{jade:'/static/anthologist/js/libraries/jade-runtime'},shim:{jade:{exports:'jade'}}});
define(['jade'],function(jade){
function timelineSel(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
buf.push('\n<!-- Unfortunately, this has to be almost identical to ../templates/includes/br-timeline-item.jade-->\n<h2');
buf.push(attrs({ 'id':("" + (source.pub_year) + ""), "class": ('timeline-date') }, {"id":true}));
buf.push('>');
var __val__ = source.date_display
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h2>\n<div class="timeline-sel-body">\n  <h3 class="timeline-sel-title"><a');
buf.push(attrs({ 'href':("/selections/" + (slug) + "") }, {"href":true}));
buf.push('>');
var __val__ = title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a> &mdash; </h3><span class="timeline-sel-info">by <a');
buf.push(attrs({ 'href':("/authors/" + (source.author.slug) + "") }, {"href":true}));
buf.push('>');
var __val__ = source.author.full_name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>. ');
if ( excerpt == true)
{
buf.push('From ' + ((interp = source_display) == null ? '' : interp) + '. ');
}
buf.push('</span><span class="posted-date">(Posted: ' + escape((interp = date_entered) == null ? '' : interp) + ')&nbsp;</span><span class="toggle-teaser">[See the teaser <span class="arrow-down"></span>]</span>\n  <div class="timeline-teaser"><span class="timeline-teaser-text">');
var __val__ = teaser
buf.push(null == __val__ ? "" : __val__);
buf.push('</span>&nbsp;&middot;&nbsp;&middot;&nbsp;&middot;&nbsp;<a');
buf.push(attrs({ 'href':("/selections/" + (slug) + ""), "class": ('read-rest') }, {"href":true}));
buf.push('>&nbsp;&lowast;&lowast;&lowast;&nbsp;read&nbsp;on&nbsp;&raquo;</a></div>\n</div>');
}
return buf.join("");
}return timelineSel});